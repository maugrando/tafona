"""Projeto Borrego Tafona (PBT) — controle do rebanho ovino da fazenda.

Rebanho, genealogia (quem pode cruzar com quem), monta a campo, parições,
sanidade, pesagens, custos e painel. Banco SQLite próprio em /dados/ovelhas.db.

Sem login no app: o controle de acesso é feito pela infraestrutura, na frente do app.
"""
import csv
import io
import json
import logging
import os
import re
import sqlite3
import threading
import time
import zipfile
from contextlib import closing
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, Response

BASE = Path(__file__).parent
DADOS = Path(os.environ.get("TAFONA_DADOS", "/dados"))
DB = DADOS / "ovelhas.db"

router = APIRouter()

FUSO = ZoneInfo("America/Sao_Paulo")
log = logging.getLogger("ovelhas")

GESTACAO_DIAS = 150          # ovelha: 147–152 dias
MONTA_DIAS = 45              # carneiro no lote: ~2 a 3 cios
DESMAME_DIAS = (60, 90)      # janela de desmame do cordeiro
SEPARAR_MACHO_MESES = 4      # borrego inteiro começa a cobrir: separar das fêmeas
HORA_PUSH = 7                # aviso diário no celular
IDADE_PUBERDADE_MESES = 7    # a partir daí a borrega pode emprenhar e entra nos alertas
CATEGORIAS_DESPESA = ["Animais", "Ração e grão", "Sal mineral", "Medicamentos e vacinas", "Cerca e estrutura",
                      "Brincos e identificação", "Mão de obra", "Frete", "Outros"]
CATEGORIAS_RECEITA = ["Venda de animal", "Venda de lã", "Outros"]
TIPOS_SANIDADE = ["Vacina", "Vermífugo", "Famacha", "Casqueamento", "Carrapaticida/piolho", "Vitamina/mineral", "Outro"]


# ---------------------------------------------------------------- banco
def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def criar_banco():
    DADOS.mkdir(parents=True, exist_ok=True)
    with closing(db()) as con, con:
        con.executescript(
            """
            CREATE TABLE IF NOT EXISTS config (
                chave TEXT PRIMARY KEY,
                valor TEXT
            );
            CREATE TABLE IF NOT EXISTS animais (
                id            INTEGER PRIMARY KEY,
                brinco        TEXT NOT NULL UNIQUE,
                nome          TEXT,
                sexo          TEXT NOT NULL CHECK (sexo IN ('F','M')),
                raca          TEXT,
                nascimento    TEXT,                 -- AAAA-MM-DD (pode ser aproximado)
                pai_id        INTEGER REFERENCES animais(id),
                mae_id        INTEGER REFERENCES animais(id),
                origem        TEXT NOT NULL DEFAULT 'comprado',  -- 'comprado' | 'nascido'
                entrada       TEXT,                 -- data em que entrou na fazenda
                valor_compra  REAL,
                status        TEXT NOT NULL DEFAULT 'ativo',     -- ativo | vendido | abatido | morto
                saida         TEXT,
                valor_saida   REAL,
                motivo_saida  TEXT,
                obs           TEXT,
                criado_em     TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS montas (
                id          INTEGER PRIMARY KEY,
                carneiro_id INTEGER NOT NULL REFERENCES animais(id),
                inicio      TEXT NOT NULL,
                fim         TEXT,                   -- NULL = carneiro ainda no lote
                obs         TEXT,
                criado_em   TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS monta_ovelhas (
                monta_id  INTEGER NOT NULL REFERENCES montas(id) ON DELETE CASCADE,
                ovelha_id INTEGER NOT NULL REFERENCES animais(id),
                PRIMARY KEY (monta_id, ovelha_id)
            );
            CREATE TABLE IF NOT EXISTS paricoes (
                id        INTEGER PRIMARY KEY,
                mae_id    INTEGER NOT NULL REFERENCES animais(id),
                pai_id    INTEGER REFERENCES animais(id),
                monta_id  INTEGER REFERENCES montas(id),
                data      TEXT NOT NULL,
                vivos     INTEGER NOT NULL DEFAULT 0,
                mortos    INTEGER NOT NULL DEFAULT 0,
                obs       TEXT,
                criado_em TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS sanidade (
                id         INTEGER PRIMARY KEY,
                animal_id  INTEGER NOT NULL REFERENCES animais(id),
                data       TEXT NOT NULL,
                tipo       TEXT NOT NULL,
                produto    TEXT,
                dose       TEXT,
                famacha    INTEGER,                 -- 1 a 5, só no tipo Famacha
                custo      REAL NOT NULL DEFAULT 0, -- já rateado por animal
                proxima    TEXT,                    -- próxima aplicação prevista
                obs        TEXT,
                grupo      TEXT,                    -- mesmo valor nas linhas de uma aplicação em lote
                criado_em  TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS pesagens (
                id        INTEGER PRIMARY KEY,
                animal_id INTEGER NOT NULL REFERENCES animais(id),
                data      TEXT NOT NULL,
                kg        REAL NOT NULL,
                obs       TEXT,
                criado_em TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS lancamentos (
                id         INTEGER PRIMARY KEY,
                data       TEXT NOT NULL,
                tipo       TEXT NOT NULL CHECK (tipo IN ('despesa','receita')),
                categoria  TEXT NOT NULL,
                descricao  TEXT,
                valor      REAL NOT NULL,
                animal_id  INTEGER REFERENCES animais(id),   -- NULL = rebanho todo
                origem     TEXT,                              -- 'sanidade:<grupo>' | 'animal:<id>' | NULL (manual)
                criado_em  TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS avisos_estado (
                chave      TEXT PRIMARY KEY,         -- identifica o aviso (tipo:animal:referência)
                feito_em   TEXT,                     -- marcado como feito (não volta)
                adiado_ate TEXT                      -- some até essa data
            );
            CREATE TABLE IF NOT EXISTS push_inscricoes (
                endpoint   TEXT PRIMARY KEY,
                p256dh     TEXT NOT NULL,
                auth       TEXT NOT NULL,
                aparelho   TEXT,
                criado_em  TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE INDEX IF NOT EXISTS ix_san_animal ON sanidade(animal_id, data);
            CREATE INDEX IF NOT EXISTS ix_pes_animal ON pesagens(animal_id, data);
            CREATE INDEX IF NOT EXISTS ix_lan_data ON lancamentos(data);
            """
        )
        colunas = {r["name"] for r in con.execute("PRAGMA table_info(animais)")}
        if "desmame" not in colunas:
            con.execute("ALTER TABLE animais ADD COLUMN desmame TEXT")   # data do desmame (cordeiro nascido aqui)
        for chave, valor in [("raca_padrao", "Hampshire Down"), ("nome_rebanho", "Projeto Borrego Tafona")]:
            con.execute("INSERT OR IGNORE INTO config (chave, valor) VALUES (?, ?)", (chave, valor))
        # nome antigo de fábrica -> nome do projeto (não mexe se o Mau já tiver trocado)
        con.execute("UPDATE config SET valor = 'Projeto Borrego Tafona' WHERE chave = 'nome_rebanho' AND valor IN ('Ovelhas · Tafona', 'PBT · Projeto Borrego Tafona')")


# ---------------------------------------------------------------- utilidades
def dia():
    """Hoje no fuso da fazenda (o container roda em UTC)."""
    return datetime.now(FUSO).date()


def hoje():
    return dia().isoformat()


def d(s):
    """'AAAA-MM-DD' -> date (ou None)."""
    if not s:
        return None
    return date.fromisoformat(str(s)[:10])


def idade_meses(nasc, ref=None):
    n = d(nasc)
    if not n:
        return None
    r = d(ref) or dia()
    return (r.year - n.year) * 12 + (r.month - n.month) - (1 if r.day < n.day else 0)


def idade_txt(nasc):
    m = idade_meses(nasc)
    if m is None:
        return ""
    if m < 1:
        return f"{(dia() - d(nasc)).days} dias"
    if m < 24:
        return f"{m} meses"
    return f"{m // 12} anos" + (f" e {m % 12} m" if m % 12 else "")


def num(v, padrao=0.0):
    try:
        return float(str(v).replace(",", "."))
    except (TypeError, ValueError):
        return padrao


def texto(v, n=200):
    v = ("" if v is None else str(v)).strip()
    return v[:n] or None


def data_ok(v, obrigatoria=True):
    v = (v or "")[:10]
    if not v:
        if obrigatoria:
            raise HTTPException(400, "data em branco")
        return None
    try:
        date.fromisoformat(v)
    except ValueError:
        raise HTTPException(400, f"data inválida: {v}")
    return v


# ---------------------------------------------------------------- genealogia / parentesco
def _pais(con):
    """{id: (pai_id, mae_id)} de todos os animais."""
    return {r["id"]: (r["pai_id"], r["mae_id"]) for r in con.execute("SELECT id, pai_id, mae_id FROM animais")}


def ancestrais(pais, aid, geracoes=6):
    """{ancestral_id: [profundidades]} — um ancestral pode aparecer por mais de um caminho."""
    out = {}

    def sobe(x, prof):
        if x is None or prof > geracoes:
            return
        out.setdefault(x, []).append(prof)
        p, m = pais.get(x, (None, None))
        sobe(p, prof + 1)
        sobe(m, prof + 1)

    sobe(aid, 0)
    return out


def parentesco(pais, a, b):
    """Coeficiente de parentesco (Wright, sem corrigir endogamia dos ancestrais).
    0,5 = pai/filha ou irmãos inteiros · 0,25 = meio-irmãos, avô/neta · 0,125 = primos."""
    if a == b:
        return 1.0
    anc_a, anc_b = ancestrais(pais, a), ancestrais(pais, b)
    comuns = set(anc_a) & set(anc_b)
    r = 0.0
    for c in comuns:
        for na in anc_a[c]:
            for nb in anc_b[c]:
                r += 0.5 ** (na + nb)
    return min(r, 1.0)


def classificar(r):
    if r >= 0.4:
        return "bloqueado", "Pai/filha ou irmãos: não cruzar"
    if r >= 0.2:
        return "bloqueado", "Meio-irmãos ou avô/neta: não cruzar"
    if r >= 0.1:
        return "atencao", "Primos: evitar se houver outra opção"
    if r > 0:
        return "ok", "Parentesco distante"
    return "ok", "Sem parentesco conhecido"


def grau_txt(pais, a, b):
    """Nome do parentesco mais próximo (para a tela), ou ''."""
    pa, ma = pais.get(a, (None, None))
    pb, mb = pais.get(b, (None, None))
    if b in (pa, ma):
        return "pai/mãe"
    if a in (pb, mb):
        return "filho(a)"
    if (pa and pa == pb) and (ma and ma == mb):
        return "irmãos inteiros"
    if (pa and pa == pb) or (ma and ma == mb):
        return "meio-irmãos"
    anc_a = ancestrais(pais, a, 2)
    anc_b = ancestrais(pais, b, 2)
    if b in anc_a or a in anc_b:
        return "avô/avó–neto(a)"
    return ""


# ---------------------------------------------------------------- animais
def _animal_dict(r):
    a = dict(r)
    a["idade"] = idade_txt(a.get("nascimento"))
    a["idade_meses"] = idade_meses(a.get("nascimento"))
    return a


def _lista_animais(con, todos=False):
    sql = """SELECT a.*, p.brinco AS pai_brinco, m.brinco AS mae_brinco,
                    (SELECT kg FROM pesagens WHERE animal_id = a.id ORDER BY data DESC, id DESC LIMIT 1) AS ultimo_peso,
                    (SELECT data FROM pesagens WHERE animal_id = a.id ORDER BY data DESC, id DESC LIMIT 1) AS ultima_pesagem
             FROM animais a LEFT JOIN animais p ON p.id = a.pai_id LEFT JOIN animais m ON m.id = a.mae_id"""
    if not todos:
        sql += " WHERE a.status = 'ativo'"
    sql += " ORDER BY a.status = 'ativo' DESC, a.sexo, a.brinco"
    return [_animal_dict(r) for r in con.execute(sql)]


def _animal_por_id(con, aid):
    r = con.execute("SELECT * FROM animais WHERE id = ?", (aid,)).fetchone()
    if not r:
        raise HTTPException(404, "animal não encontrado")
    return r


@router.get("/api/ovelhas/animais")
def animais(todos: int = 0):
    with closing(db()) as con:
        return {"animais": _lista_animais(con, todos=bool(todos))}


@router.get("/api/ovelhas/animais/{aid}")
def animal(aid: int):
    with closing(db()) as con:
        a = _animal_dict(_animal_por_id(con, aid))
        pais = _pais(con)
        brincos = {r["id"]: r["brinco"] for r in con.execute("SELECT id, brinco FROM animais")}

        def no(x, prof):
            if x is None or prof > 3:
                return None
            p, m = pais.get(x, (None, None))
            return {"id": x, "brinco": brincos.get(x), "pai": no(p, prof + 1), "mae": no(m, prof + 1)}

        a["arvore"] = no(aid, 0)
        a["filhos"] = [dict(r) for r in con.execute(
            "SELECT id, brinco, sexo, nascimento, status FROM animais WHERE pai_id = ? OR mae_id = ? ORDER BY nascimento DESC",
            (aid, aid))]
        a["pesagens"] = [dict(r) for r in con.execute("SELECT * FROM pesagens WHERE animal_id = ? ORDER BY data, id", (aid,))]
        a["sanidade"] = [dict(r) for r in con.execute("SELECT * FROM sanidade WHERE animal_id = ? ORDER BY data DESC, id DESC", (aid,))]
        a["paricoes"] = [dict(r) for r in con.execute(
            "SELECT p.*, c.brinco AS pai_brinco FROM paricoes p LEFT JOIN animais c ON c.id = p.pai_id WHERE p.mae_id = ? ORDER BY p.data DESC", (aid,))]
        a["custos"] = _custos_animal(con, aid)
        a["lancamentos"] = [dict(r) for r in con.execute(
            "SELECT * FROM lancamentos WHERE animal_id = ? ORDER BY data DESC, id DESC", (aid,))]
        return a


@router.get("/api/ovelhas/proximo-brinco")
def proximo_brinco():
    """Sugere o próximo brinco seguindo o padrão do último cadastrado.

    Brinco comprado já numerado (001, 002…, ou PBT-001…): soma 1 ao número do último,
    mantendo o prefixo e os zeros. Sem nenhum animal ainda: sugere 001."""
    with closing(db()) as con:
        ultimo = con.execute("SELECT brinco FROM animais ORDER BY id DESC LIMIT 1").fetchone()
        if not ultimo:
            return {"brinco": "001"}
        m = re.match(r"^(.*?)(\d+)$", ultimo["brinco"])
        if not m:
            return {"brinco": ""}
        prefixo, n = m.group(1), m.group(2)
        # maior número já usado com o mesmo prefixo (o último cadastrado pode não ser o maior)
        maior = int(n)
        for r in con.execute("SELECT brinco FROM animais WHERE brinco LIKE ?", (prefixo + "%",)):
            mm = re.match(r"^" + re.escape(prefixo) + r"(\d+)$", r["brinco"])
            if mm:
                maior = max(maior, int(mm.group(1)))
        candidato = f"{prefixo}{maior + 1:0{len(n)}d}"
        return {"brinco": candidato}


@router.post("/api/ovelhas/animais")
async def salvar_animal(req: Request):
    """Cria (sem id) ou altera (com id) um animal."""
    b = await req.json()
    campos = {
        "brinco": texto(b.get("brinco"), 30),
        "nome": texto(b.get("nome"), 60),
        "sexo": b.get("sexo"),
        "raca": texto(b.get("raca"), 60),
        "nascimento": data_ok(b.get("nascimento"), obrigatoria=False),
        "pai_id": b.get("pai_id") or None,
        "mae_id": b.get("mae_id") or None,
        "origem": "nascido" if b.get("origem") == "nascido" else "comprado",
        "entrada": data_ok(b.get("entrada"), obrigatoria=False),
        "valor_compra": num(b.get("valor_compra"), None) if b.get("valor_compra") not in (None, "") else None,
        "obs": texto(b.get("obs"), 500),
    }
    if campos["sexo"] not in ("F", "M"):
        raise HTTPException(400, "sexo inválido")
    with closing(db()) as con, con:
        if b.get("id"):
            aid = int(b["id"])
            _animal_por_id(con, aid)
            if campos["pai_id"] == aid or campos["mae_id"] == aid:
                raise HTTPException(400, "um animal não pode ser pai/mãe de si mesmo")
            if not campos["brinco"]:
                campos.pop("brinco")
            sets = ", ".join(f"{k} = ?" for k in campos)
            try:
                con.execute(f"UPDATE animais SET {sets} WHERE id = ?", (*campos.values(), aid))
            except sqlite3.IntegrityError:
                raise HTTPException(400, "já existe um animal com esse brinco")
            # a despesa da compra acompanha o que estiver no cadastro (valor, data, origem)
            a = _animal_por_id(con, aid)
            con.execute("DELETE FROM lancamentos WHERE origem = ?", (f"animal:{aid}",))
            if a["origem"] == "comprado" and a["valor_compra"]:
                con.execute(
                    "INSERT INTO lancamentos (data, tipo, categoria, descricao, valor, animal_id, origem) VALUES (?,?,?,?,?,?,?)",
                    (a["entrada"] or hoje(), "despesa", "Animais", f"Compra do animal {a['brinco']}", a["valor_compra"], aid, f"animal:{aid}"))
        else:
            if not campos["brinco"]:
                raise HTTPException(400, "brinco em branco")
            if not campos["raca"]:
                campos["raca"] = con.execute("SELECT valor FROM config WHERE chave='raca_padrao'").fetchone()[0]
            cols = ", ".join(campos)
            try:
                cur = con.execute(f"INSERT INTO animais ({cols}) VALUES ({','.join('?' * len(campos))})", tuple(campos.values()))
            except sqlite3.IntegrityError:
                raise HTTPException(400, "já existe um animal com esse brinco")
            aid = cur.lastrowid
            # compra vira despesa automaticamente
            if campos["origem"] == "comprado" and campos["valor_compra"]:
                con.execute(
                    "INSERT INTO lancamentos (data, tipo, categoria, descricao, valor, animal_id, origem) VALUES (?,?,?,?,?,?,?)",
                    (campos["entrada"] or hoje(), "despesa", "Animais", f"Compra do animal {campos['brinco']}",
                     campos["valor_compra"], aid, f"animal:{aid}"),
                )
        return {"id": aid, "animais": _lista_animais(con, todos=True)}


@router.post("/api/ovelhas/animais/{aid}/saida")
async def saida_animal(aid: int, req: Request):
    """Baixa: vendido, abatido ou morto. Venda vira receita."""
    b = await req.json()
    status = b.get("status")
    if status not in ("vendido", "abatido", "morto", "ativo"):
        raise HTTPException(400, "status inválido")
    with closing(db()) as con, con:
        a = _animal_por_id(con, aid)
        if status == "ativo":
            con.execute("UPDATE animais SET status='ativo', saida=NULL, valor_saida=NULL, motivo_saida=NULL WHERE id=?", (aid,))
            con.execute("DELETE FROM lancamentos WHERE origem = ?", (f"saida:{aid}",))
        else:
            data = data_ok(b.get("data")) or hoje()
            valor = num(b.get("valor"), 0)
            con.execute("UPDATE animais SET status=?, saida=?, valor_saida=?, motivo_saida=? WHERE id=?",
                        (status, data, valor or None, texto(b.get("motivo"), 200), aid))
            con.execute("DELETE FROM lancamentos WHERE origem = ?", (f"saida:{aid}",))
            if status == "vendido" and valor > 0:
                con.execute(
                    "INSERT INTO lancamentos (data, tipo, categoria, descricao, valor, animal_id, origem) VALUES (?,?,?,?,?,?,?)",
                    (data, "receita", "Venda de animal", f"Venda do animal {a['brinco']}", valor, aid, f"saida:{aid}"))
        return {"ok": True}


@router.delete("/api/ovelhas/animais/{aid}")
def excluir_animal(aid: int):
    with closing(db()) as con, con:
        _animal_por_id(con, aid)
        usos = con.execute(
            "SELECT (SELECT COUNT(*) FROM animais WHERE pai_id=? OR mae_id=?) + (SELECT COUNT(*) FROM paricoes WHERE mae_id=?) "
            "+ (SELECT COUNT(*) FROM monta_ovelhas WHERE ovelha_id=?) + (SELECT COUNT(*) FROM montas WHERE carneiro_id=?)",
            (aid, aid, aid, aid, aid)).fetchone()[0]
        if usos:
            raise HTTPException(400, "esse animal tem filhos, montas ou parições: dê baixa em vez de excluir")
        for t in ("sanidade", "pesagens", "lancamentos"):
            con.execute(f"DELETE FROM {t} WHERE animal_id = ?", (aid,))
        con.execute("DELETE FROM animais WHERE id = ?", (aid,))
        return {"ok": True}


# ---------------------------------------------------------------- cruzamento
@router.get("/api/ovelhas/cruzamento/{carneiro_id}")
def cruzamento(carneiro_id: int):
    """Para um carneiro: cada fêmea ativa com semáforo de parentesco."""
    with closing(db()) as con:
        c = _animal_por_id(con, carneiro_id)
        if c["sexo"] != "M":
            raise HTTPException(400, "escolha um carneiro")
        pais = _pais(con)
        saida = []
        for f in con.execute("SELECT id, brinco, nome, nascimento, status FROM animais WHERE sexo='F' AND status='ativo' ORDER BY brinco"):
            r = parentesco(pais, carneiro_id, f["id"])
            nivel, motivo = classificar(r)
            m = idade_meses(f["nascimento"])
            if m is not None and m < IDADE_PUBERDADE_MESES and nivel == "ok":
                nivel, motivo = "atencao", f"Borrega nova ({m} meses): esperar"
            saida.append({"id": f["id"], "brinco": f["brinco"], "nome": f["nome"], "idade": idade_txt(f["nascimento"]),
                          "parentesco": round(r, 3), "grau": grau_txt(pais, carneiro_id, f["id"]), "nivel": nivel, "motivo": motivo})
        return {"carneiro": dict(c), "femeas": saida}


# ---------------------------------------------------------------- montas e parições
def _montas(con):
    rows = con.execute("""SELECT m.*, c.brinco AS carneiro_brinco FROM montas m JOIN animais c ON c.id = m.carneiro_id
                          ORDER BY m.inicio DESC, m.id DESC""").fetchall()
    out = []
    for r in rows:
        m = dict(r)
        m["ovelhas"] = [dict(o) for o in con.execute(
            """SELECT a.id, a.brinco, a.nome,
                      (SELECT COUNT(*) FROM paricoes p WHERE p.monta_id = ? AND p.mae_id = a.id) AS pariu
               FROM monta_ovelhas mo JOIN animais a ON a.id = mo.ovelha_id WHERE mo.monta_id = ? ORDER BY a.brinco""", (m["id"], m["id"]))]
        ini, fim = d(m["inicio"]), d(m["fim"]) or dia()
        m["paricao_de"] = (ini + timedelta(days=GESTACAO_DIAS - 5)).isoformat()
        m["paricao_ate"] = (fim + timedelta(days=GESTACAO_DIAS + 5)).isoformat()
        m["aberta"] = m["fim"] is None
        out.append(m)
    return out


@router.get("/api/ovelhas/montas")
def montas():
    with closing(db()) as con:
        return {"montas": _montas(con)}


@router.post("/api/ovelhas/montas")
async def salvar_monta(req: Request):
    b = await req.json()
    with closing(db()) as con, con:
        if b.get("id") and b.get("acao") == "fechar":
            con.execute("UPDATE montas SET fim = ? WHERE id = ?", (data_ok(b.get("fim")) or hoje(), int(b["id"])))
            return {"montas": _montas(con)}
        if b.get("id") and b.get("acao") == "excluir":
            if con.execute("SELECT COUNT(*) FROM paricoes WHERE monta_id = ?", (int(b["id"]),)).fetchone()[0]:
                raise HTTPException(400, "essa monta já tem parições registradas")
            con.execute("DELETE FROM montas WHERE id = ?", (int(b["id"]),))
            return {"montas": _montas(con)}
        carneiro = _animal_por_id(con, int(b["carneiro_id"]))
        if carneiro["sexo"] != "M":
            raise HTTPException(400, "escolha um carneiro")
        ovelhas = [int(x) for x in b.get("ovelhas", [])]
        if not ovelhas:
            raise HTTPException(400, "escolha pelo menos uma ovelha")
        pais = _pais(con)
        bloqueadas = [str(con.execute("SELECT brinco FROM animais WHERE id=?", (o,)).fetchone()[0])
                      for o in ovelhas if classificar(parentesco(pais, carneiro["id"], o))[0] == "bloqueado"]
        if bloqueadas and not b.get("forcar"):
            raise HTTPException(400, "parentesco próximo com: " + ", ".join(bloqueadas))
        cur = con.execute("INSERT INTO montas (carneiro_id, inicio, fim, obs) VALUES (?,?,?,?)",
                          (carneiro["id"], data_ok(b.get("inicio")), data_ok(b.get("fim"), False), texto(b.get("obs"), 300)))
        con.executemany("INSERT OR IGNORE INTO monta_ovelhas (monta_id, ovelha_id) VALUES (?,?)", [(cur.lastrowid, o) for o in ovelhas])
        return {"montas": _montas(con)}


@router.post("/api/ovelhas/paricoes")
async def salvar_paricao(req: Request):
    """Registra o parto e já cria os cordeiros vivos como animais (brincos informados)."""
    b = await req.json()
    with closing(db()) as con, con:
        mae = _animal_por_id(con, int(b["mae_id"]))
        if mae["sexo"] != "F":
            raise HTTPException(400, "a mãe precisa ser uma fêmea")
        data = data_ok(b.get("data"))
        monta_id = b.get("monta_id") or None
        pai_id = b.get("pai_id") or None
        if monta_id and not pai_id:
            pai_id = con.execute("SELECT carneiro_id FROM montas WHERE id = ?", (monta_id,)).fetchone()[0]
        cordeiros = b.get("cordeiros", [])   # [{"brinco": "...", "sexo": "F"|"M", "kg": 4.2}]
        vivos = int(b.get("vivos", len(cordeiros)))
        mortos = int(b.get("mortos", 0))
        cur = con.execute("INSERT INTO paricoes (mae_id, pai_id, monta_id, data, vivos, mortos, obs) VALUES (?,?,?,?,?,?,?)",
                          (mae["id"], pai_id, monta_id, data, vivos, mortos, texto(b.get("obs"), 300)))
        raca = mae["raca"] or con.execute("SELECT valor FROM config WHERE chave='raca_padrao'").fetchone()[0]
        criados = []
        for c in cordeiros:
            brinco = texto(c.get("brinco"), 30)
            if not brinco or c.get("sexo") not in ("F", "M"):
                raise HTTPException(400, "cada cordeiro precisa de brinco e sexo")
            try:
                a = con.execute(
                    "INSERT INTO animais (brinco, sexo, raca, nascimento, pai_id, mae_id, origem, entrada) VALUES (?,?,?,?,?,?,'nascido',?)",
                    (brinco, c["sexo"], raca, data, pai_id, mae["id"], data))
            except sqlite3.IntegrityError:
                raise HTTPException(400, f"já existe o brinco {brinco}")
            if c.get("kg"):
                con.execute("INSERT INTO pesagens (animal_id, data, kg, obs) VALUES (?,?,?,'ao nascer')", (a.lastrowid, data, num(c["kg"])))
            criados.append(a.lastrowid)
        return {"paricao_id": cur.lastrowid, "criados": criados}


@router.get("/api/ovelhas/paricoes")
def paricoes():
    with closing(db()) as con:
        rows = con.execute("""SELECT p.*, m.brinco AS mae_brinco, c.brinco AS pai_brinco FROM paricoes p
                              JOIN animais m ON m.id = p.mae_id LEFT JOIN animais c ON c.id = p.pai_id
                              ORDER BY p.data DESC, p.id DESC LIMIT 200""")
        return {"paricoes": [dict(r) for r in rows]}


# ---------------------------------------------------------------- sanidade
@router.get("/api/ovelhas/sanidade")
def sanidade(limite: int = 300):
    with closing(db()) as con:
        rows = con.execute("""SELECT s.*, a.brinco FROM sanidade s JOIN animais a ON a.id = s.animal_id
                              ORDER BY s.data DESC, s.id DESC LIMIT ?""", (limite,))
        return {"sanidade": [dict(r) for r in rows], "tipos": TIPOS_SANIDADE}


@router.post("/api/ovelhas/sanidade")
async def salvar_sanidade(req: Request):
    """Aplica em um ou vários animais de uma vez. custo_total é rateado entre eles."""
    b = await req.json()
    ids = [int(x) for x in b.get("animais", [])]
    if not ids:
        raise HTTPException(400, "escolha pelo menos um animal")
    tipo = texto(b.get("tipo"), 40) or "Outro"
    data = data_ok(b.get("data")) or hoje()
    proxima = data_ok(b.get("proxima"), False)
    if not proxima and b.get("repete_dias"):
        proxima = (d(data) + timedelta(days=int(b["repete_dias"]))).isoformat()
    custo_total = num(b.get("custo_total"), 0)
    por_animal = round(custo_total / len(ids), 2) if custo_total else 0
    grupo = datetime.now().strftime("%Y%m%d%H%M%S%f")
    famacha = int(b["famacha"]) if b.get("famacha") not in (None, "") else None
    with closing(db()) as con, con:
        for aid in ids:
            _animal_por_id(con, aid)
            con.execute(
                "INSERT INTO sanidade (animal_id, data, tipo, produto, dose, famacha, custo, proxima, obs, grupo) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (aid, data, tipo, texto(b.get("produto"), 80), texto(b.get("dose"), 40), famacha, por_animal, proxima,
                 texto(b.get("obs"), 300), grupo))
        if custo_total > 0:
            con.execute(
                "INSERT INTO lancamentos (data, tipo, categoria, descricao, valor, animal_id, origem) VALUES (?,?,?,?,?,?,?)",
                (data, "despesa", "Medicamentos e vacinas", f"{tipo}" + (f" · {texto(b.get('produto'), 80)}" if b.get("produto") else "") +
                 f" em {len(ids)} animal(is)", custo_total, None, f"sanidade:{grupo}"))
        return {"ok": True, "aplicados": len(ids)}


@router.delete("/api/ovelhas/sanidade/{sid}")
def excluir_sanidade(sid: int):
    with closing(db()) as con, con:
        r = con.execute("SELECT grupo FROM sanidade WHERE id = ?", (sid,)).fetchone()
        if not r:
            raise HTTPException(404)
        con.execute("DELETE FROM sanidade WHERE id = ?", (sid,))
        # se era o último do grupo, apaga a despesa; senão, reduz proporcionalmente
        resto = con.execute("SELECT COUNT(*), COALESCE(SUM(custo),0) FROM sanidade WHERE grupo = ?", (r["grupo"],)).fetchone()
        if resto[0] == 0:
            con.execute("DELETE FROM lancamentos WHERE origem = ?", (f"sanidade:{r['grupo']}",))
        else:
            con.execute("UPDATE lancamentos SET valor = ? WHERE origem = ?", (resto[1], f"sanidade:{r['grupo']}"))
        return {"ok": True}


# ---------------------------------------------------------------- pesagens
@router.post("/api/ovelhas/pesagens")
async def salvar_pesagem(req: Request):
    """Uma ou várias pesagens: [{"animal_id": 1, "kg": 32.5}], mesma data."""
    b = await req.json()
    data = data_ok(b.get("data")) or hoje()
    itens = [(int(i["animal_id"]), num(i["kg"])) for i in b.get("itens", []) if num(i.get("kg")) > 0]
    if not itens:
        raise HTTPException(400, "nenhum peso informado")
    with closing(db()) as con, con:
        con.executemany("INSERT INTO pesagens (animal_id, data, kg, obs) VALUES (?,?,?,?)",
                        [(aid, data, kg, texto(b.get("obs"), 100)) for aid, kg in itens])
        return {"ok": True, "n": len(itens)}


@router.delete("/api/ovelhas/pesagens/{pid}")
def excluir_pesagem(pid: int):
    with closing(db()) as con, con:
        con.execute("DELETE FROM pesagens WHERE id = ?", (pid,))
        return {"ok": True}


# ---------------------------------------------------------------- custos
def _custos_animal(con, aid):
    """Custo direto + rateio do custo geral do rebanho pelos dias em que o animal esteve ativo."""
    direto = con.execute("SELECT COALESCE(SUM(valor),0) FROM lancamentos WHERE tipo='despesa' AND animal_id = ?", (aid,)).fetchone()[0]
    receita = con.execute("SELECT COALESCE(SUM(valor),0) FROM lancamentos WHERE tipo='receita' AND animal_id = ?", (aid,)).fetchone()[0]
    rateado = _rateio(con).get(aid, 0.0)
    return {"direto": round(direto, 2), "rateado": round(rateado, 2), "total": round(direto + rateado, 2), "receita": round(receita, 2)}


def _rateio(con):
    """Despesas sem animal (ração, sal, cerca...) rateadas por animal-dia entre os animais presentes em cada mês."""
    gerais = con.execute("SELECT substr(data,1,7) AS mes, SUM(valor) AS v FROM lancamentos WHERE tipo='despesa' AND animal_id IS NULL GROUP BY mes").fetchall()
    if not gerais:
        return {}
    animais = con.execute("SELECT id, COALESCE(entrada, nascimento, substr(criado_em,1,10)) AS ini, saida FROM animais").fetchall()
    out = {}
    for g in gerais:
        ano, mes = int(g["mes"][:4]), int(g["mes"][5:7])
        m_ini = date(ano, mes, 1)
        m_fim = (date(ano + (mes == 12), (mes % 12) + 1, 1) - timedelta(days=1))
        dias = {}
        for a in animais:
            ini = max(d(a["ini"]) or m_ini, m_ini)
            fim = min(d(a["saida"]) or m_fim, m_fim)
            n = (fim - ini).days + 1
            if n > 0:
                dias[a["id"]] = n
        total = sum(dias.values())
        if total:
            for aid, n in dias.items():
                out[aid] = out.get(aid, 0.0) + g["v"] * n / total
    return out


@router.get("/api/ovelhas/lancamentos")
def lancamentos(ano: int | None = None):
    with closing(db()) as con:
        sql = "SELECT l.*, a.brinco FROM lancamentos l LEFT JOIN animais a ON a.id = l.animal_id"
        args = ()
        if ano:
            sql += " WHERE substr(l.data,1,4) = ?"
            args = (str(ano),)
        rows = con.execute(sql + " ORDER BY l.data DESC, l.id DESC LIMIT 500", args).fetchall()
        return {"lancamentos": [dict(r) for r in rows], "categorias_despesa": CATEGORIAS_DESPESA, "categorias_receita": CATEGORIAS_RECEITA}


@router.post("/api/ovelhas/lancamentos")
async def salvar_lancamento(req: Request):
    b = await req.json()
    tipo = b.get("tipo")
    if tipo not in ("despesa", "receita"):
        raise HTTPException(400, "tipo inválido")
    valor = num(b.get("valor"), 0)
    if valor <= 0:
        raise HTTPException(400, "valor precisa ser maior que zero")
    with closing(db()) as con, con:
        vals = (data_ok(b.get("data")) or hoje(), tipo, texto(b.get("categoria"), 60) or "Outros", texto(b.get("descricao"), 200),
                valor, b.get("animal_id") or None)
        if b.get("id"):
            con.execute("UPDATE lancamentos SET data=?, tipo=?, categoria=?, descricao=?, valor=?, animal_id=? WHERE id=? AND origem IS NULL",
                        (*vals, int(b["id"])))
        else:
            con.execute("INSERT INTO lancamentos (data, tipo, categoria, descricao, valor, animal_id) VALUES (?,?,?,?,?,?)", vals)
        return {"ok": True}


@router.delete("/api/ovelhas/lancamentos/{lid}")
def excluir_lancamento(lid: int):
    with closing(db()) as con, con:
        r = con.execute("SELECT origem FROM lancamentos WHERE id = ?", (lid,)).fetchone()
        if not r:
            raise HTTPException(404)
        if r["origem"]:
            raise HTTPException(400, "esse lançamento foi gerado por uma compra, venda ou sanidade: apague lá")
        con.execute("DELETE FROM lancamentos WHERE id = ?", (lid,))
        return {"ok": True}


@router.get("/api/ovelhas/custos")
def custos(ano: int | None = None):
    """Resumo: por categoria, por mês, por animal (direto + rateado)."""
    with closing(db()) as con:
        filtro, args = "", ()
        if ano:
            filtro, args = " AND substr(data,1,4) = ?", (str(ano),)
        cat = [dict(r) for r in con.execute(
            f"SELECT tipo, categoria, SUM(valor) AS valor FROM lancamentos WHERE 1=1{filtro} GROUP BY tipo, categoria ORDER BY tipo, valor DESC", args)]
        mes = [dict(r) for r in con.execute(
            f"""SELECT substr(data,1,7) AS mes,
                       SUM(CASE WHEN tipo='despesa' THEN valor ELSE 0 END) AS despesa,
                       SUM(CASE WHEN tipo='receita' THEN valor ELSE 0 END) AS receita
                FROM lancamentos WHERE 1=1{filtro} GROUP BY mes ORDER BY mes""", args)]
        rateio = _rateio(con)
        por_animal = []
        for a in con.execute("SELECT id, brinco, sexo, status, nascimento, valor_compra FROM animais ORDER BY status='ativo' DESC, brinco"):
            direto = con.execute("SELECT COALESCE(SUM(valor),0) FROM lancamentos WHERE tipo='despesa' AND animal_id=?", (a["id"],)).fetchone()[0]
            receita = con.execute("SELECT COALESCE(SUM(valor),0) FROM lancamentos WHERE tipo='receita' AND animal_id=?", (a["id"],)).fetchone()[0]
            por_animal.append({"id": a["id"], "brinco": a["brinco"], "sexo": a["sexo"], "status": a["status"], "idade": idade_txt(a["nascimento"]),
                               "direto": round(direto, 2), "rateado": round(rateio.get(a["id"], 0), 2),
                               "total": round(direto + rateio.get(a["id"], 0), 2), "receita": round(receita, 2)})
        tot_d = sum(c["valor"] for c in cat if c["tipo"] == "despesa")
        tot_r = sum(c["valor"] for c in cat if c["tipo"] == "receita")
        ativos = con.execute("SELECT COUNT(*) FROM animais WHERE status='ativo'").fetchone()[0]
        anos = [r[0] for r in con.execute("SELECT DISTINCT substr(data,1,4) FROM lancamentos ORDER BY 1 DESC")]
        return {"categorias": cat, "meses": mes, "animais": por_animal, "total_despesa": round(tot_d, 2), "total_receita": round(tot_r, 2),
                "resultado": round(tot_r - tot_d, 2), "ativos": ativos, "custo_por_cabeca": round(tot_d / ativos, 2) if ativos else 0, "anos": anos}


# ---------------------------------------------------------------- painel e alertas
def _aviso(lista, chave, nivel, tipo, texto, animal_id=None, acao=None, rotulo=None, ref=None, manual=False):
    """nivel: alto (vermelho) | medio (laranja) | baixo (cinza). manual=True: some com 'Feito'."""
    lista.append({"chave": chave, "nivel": nivel, "tipo": tipo, "texto": texto, "animal_id": animal_id,
                  "acao": acao, "rotulo": rotulo, "ref": ref, "manual": manual})


def _alertas(con, todos=False):
    """Avisos e tarefas de manejo. Filtra os marcados como feitos e os adiados (salvo todos=True)."""
    av = []
    hj = dia()
    # --- sanidade com data marcada (repetição)
    rows = con.execute("""SELECT s.animal_id, a.brinco, s.tipo, MAX(s.proxima) AS proxima
                          FROM sanidade s JOIN animais a ON a.id = s.animal_id
                          WHERE a.status='ativo' AND s.proxima IS NOT NULL GROUP BY s.animal_id, s.tipo""").fetchall()
    for r in rows:
        ultima = con.execute("SELECT MAX(data) FROM sanidade WHERE animal_id=? AND tipo=?", (r["animal_id"], r["tipo"])).fetchone()[0]
        if ultima >= r["proxima"]:
            continue
        falta = (d(r["proxima"]) - hj).days
        chave = f"san:{r['animal_id']}:{r['tipo']}:{r['proxima']}"
        if falta < 0:
            _aviso(av, chave, "alto" if -falta > 15 else "medio", "sanidade", f"{r['brinco']}: {r['tipo']} vencido há {-falta} dia(s)",
                   r["animal_id"], "sanidade", f"Aplicar {r['tipo'].lower()}", r["tipo"])
        elif falta == 0:
            _aviso(av, chave, "medio", "sanidade", f"{r['brinco']}: {r['tipo']} vence hoje", r["animal_id"], "sanidade", f"Aplicar {r['tipo'].lower()}", r["tipo"])
        elif falta <= 7:
            _aviso(av, chave, "baixo", "sanidade", f"{r['brinco']}: {r['tipo']} em {falta} dia(s)", r["animal_id"], "sanidade", f"Aplicar {r['tipo'].lower()}", r["tipo"])
    # --- Famacha 4 ou 5 na última avaliação, sem vermífugo depois dela
    for r in con.execute("""SELECT a.brinco, s.animal_id, s.famacha, s.data FROM sanidade s JOIN animais a ON a.id=s.animal_id
                            WHERE s.tipo='Famacha' AND a.status='ativo'
                              AND s.id = (SELECT id FROM sanidade WHERE animal_id=s.animal_id AND tipo='Famacha' ORDER BY data DESC, id DESC LIMIT 1)
                              AND s.famacha >= 4"""):
        verm = con.execute("SELECT COUNT(*) FROM sanidade WHERE animal_id=? AND tipo='Vermífugo' AND data >= ?", (r["animal_id"], r["data"])).fetchone()[0]
        if not verm:
            _aviso(av, f"famacha:{r['animal_id']}:{r['data']}", "alto", "famacha", f"{r['brinco']}: Famacha {r['famacha']} em {fmt_data(r['data'])}. Vermifugar",
                   r["animal_id"], "sanidade", "Aplicar vermífugo", "Vermífugo")
    # --- Famacha do rebanho na época do verme (dez a mar): a cada 15 dias
    if hj.month in (12, 1, 2, 3) and con.execute("SELECT COUNT(*) FROM animais WHERE status='ativo'").fetchone()[0]:
        ult = con.execute("SELECT MAX(s.data) FROM sanidade s JOIN animais a ON a.id=s.animal_id WHERE s.tipo='Famacha' AND a.status='ativo'").fetchone()[0]
        if ult is None or (hj - d(ult)).days >= 15:
            semana = hj.isocalendar()
            _aviso(av, f"famacha-rebanho:{semana[0]}-{semana[1]}", "medio", "famacha",
                   "Famacha do rebanho: época de verme, avaliar a cada 15 dias" + (f" (último {fmt_data(ult)})" if ult else ""),
                   None, "sanidade", "Fazer Famacha", "Famacha")
    # --- monta: tirar o carneiro, vacina pré-parto, parição
    for m in _montas(con):
        if m["aberta"]:
            dias_lote = (hj - d(m["inicio"])).days
            if dias_lote >= MONTA_DIAS:
                _aviso(av, f"tirar-carneiro:{m['id']}", "alto" if dias_lote >= MONTA_DIAS + 15 else "medio", "monta",
                       f"Tirar o carneiro {m['carneiro_brinco']} do lote: está há {dias_lote} dias com as ovelhas", None,
                       "tirar_carneiro", "Tirar carneiro", m["id"])
        de, ate = d(m["paricao_de"]), d(m["paricao_ate"])
        for o in m["ovelhas"]:
            if o["pariu"]:
                continue
            if de - timedelta(days=40) <= hj < de:
                vac = con.execute("SELECT COUNT(*) FROM sanidade WHERE animal_id=? AND tipo='Vacina' AND data >= ?", (o["id"], m["inicio"])).fetchone()[0]
                if not vac:
                    _aviso(av, f"vacina-pre-parto:{m['id']}:{o['id']}", "medio", "sanidade",
                           f"{o['brinco']}: vacinar antes do parto (previsto a partir de {fmt_data(m['paricao_de'])}); protege o cordeiro pelo colostro",
                           o["id"], "sanidade", "Aplicar vacina", "Vacina")
            if de - timedelta(days=14) <= hj <= ate:
                _aviso(av, f"paricao:{m['id']}:{o['id']}", "medio", "paricao",
                       f"{o['brinco']}: parição prevista entre {fmt_data(m['paricao_de'])} e {fmt_data(m['paricao_ate'])}. Deixar perto da sede",
                       o["id"], "paricao", "Registrar parição", m["id"])
            elif hj > ate:
                _aviso(av, f"vazia:{m['id']}:{o['id']}", "baixo", "paricao",
                       f"{o['brinco']}: passou da data prevista e não há parição registrada (vazia?)", o["id"], "ficha", "Abrir ficha", None, manual=True)
    # --- cordeiros nascidos aqui: vacina, desmame, separar machos
    for a in con.execute("SELECT id, brinco, sexo, nascimento, desmame FROM animais WHERE status='ativo' AND origem='nascido' AND nascimento IS NOT NULL"):
        idade = (hj - d(a["nascimento"])).days
        if 30 <= idade <= 120:
            vac = con.execute("SELECT COUNT(*) FROM sanidade WHERE animal_id=? AND tipo='Vacina'", (a["id"],)).fetchone()[0]
            if not vac:
                _aviso(av, f"vacina-cordeiro:{a['id']}", "medio", "sanidade", f"Cordeiro {a['brinco']}: primeira vacina (está com {idade} dias)",
                       a["id"], "sanidade", "Aplicar vacina", "Vacina")
        if not a["desmame"] and idade >= DESMAME_DIAS[0]:
            _aviso(av, f"desmame:{a['id']}", "alto" if idade > DESMAME_DIAS[1] + 20 else ("medio" if idade >= 75 else "baixo"), "manejo",
                   f"Cordeiro {a['brinco']}: hora do desmame ({idade} dias). Separar da mãe", a["id"], "desmame", "Registrar desmame")
        if a["sexo"] == "M" and (idade_meses(a["nascimento"]) or 0) >= SEPARAR_MACHO_MESES:
            _aviso(av, f"separar-macho:{a['id']}", "medio", "manejo",
                   f"Borrego {a['brinco']}: {idade_meses(a['nascimento'])} meses. Separar das fêmeas (já pode cobrir) ou castrar",
                   a["id"], "ficha", "Abrir ficha", None, manual=True)
    # --- carneiro: filhas chegando à idade de cruzar
    for c in con.execute("SELECT id, brinco FROM animais WHERE sexo='M' AND status='ativo'"):
        filhas = [f for f in con.execute("SELECT id, nascimento FROM animais WHERE sexo='F' AND status='ativo' AND pai_id=?", (c["id"],))
                  if (idade_meses(f["nascimento"]) or 0) >= IDADE_PUBERDADE_MESES - 1]
        if filhas:
            _aviso(av, f"genetica:{c['id']}:{len(filhas)}", "medio", "genetica",
                   f"Carneiro {c['brinco']} tem {len(filhas)} filha(s) em idade de cruzar: separar as borregas ou trocar o carneiro",
                   c["id"], "ficha", "Abrir ficha", None, manual=True)
    # --- pesagem atrasada (um aviso só para o rebanho)
    sem = [r["brinco"] for r in con.execute("SELECT a.brinco, (SELECT MAX(data) FROM pesagens WHERE animal_id=a.id) AS ult FROM animais a WHERE a.status='ativo'")
           if r["ult"] is None or (hj - d(r["ult"])).days > 60]
    if sem:
        _aviso(av, f"pesagem:{hj.year}-{hj.month}", "baixo", "pesagem",
               f"Pesar: {len(sem)} animal(is) sem pesagem há mais de 60 dias ({', '.join(sem[:6])}{'…' if len(sem) > 6 else ''})", None, "pesagem", "Pesar")
    # --- feitos e adiados
    if not todos:
        estado = {r["chave"]: r for r in con.execute("SELECT * FROM avisos_estado")}
        def vale(a):
            e = estado.get(a["chave"])
            if not e:
                return True
            if e["feito_em"]:
                return False
            return not (e["adiado_ate"] and e["adiado_ate"] >= hj.isoformat())
        av = [a for a in av if vale(a)]
    ordem = {"alto": 0, "medio": 1, "baixo": 2}
    return sorted(av, key=lambda x: ordem[x["nivel"]])


def _pendentes(avisos):
    """Quantos contam para a bolinha vermelha: vermelhos e laranjas."""
    return sum(1 for a in avisos if a["nivel"] in ("alto", "medio"))


@router.get("/api/ovelhas/avisos")
def avisos():
    with closing(db()) as con:
        av = _alertas(con)
        return {"avisos": av, "pendentes": _pendentes(av)}


@router.post("/api/ovelhas/avisos/estado")
async def estado_aviso(req: Request):
    """{"chave": "...", "acao": "feito" | "adiar", "dias": 7}"""
    b = await req.json()
    chave = texto(b.get("chave"), 120)
    if not chave:
        raise HTTPException(400, "aviso sem chave")
    with closing(db()) as con, con:
        if b.get("acao") == "feito":
            con.execute("INSERT INTO avisos_estado (chave, feito_em) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET feito_em = excluded.feito_em",
                        (chave, hoje()))
        elif b.get("acao") == "adiar":
            ate = (dia() + timedelta(days=max(1, min(60, int(b.get("dias", 7)))))).isoformat()
            con.execute("INSERT INTO avisos_estado (chave, adiado_ate) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET adiado_ate = excluded.adiado_ate",
                        (chave, ate))
        else:
            raise HTTPException(400, "ação inválida")
        av = _alertas(con)
        return {"avisos": av, "pendentes": _pendentes(av)}


@router.post("/api/ovelhas/animais/{aid}/desmame")
async def desmame(aid: int, req: Request):
    b = await req.json()
    with closing(db()) as con, con:
        _animal_por_id(con, aid)
        con.execute("UPDATE animais SET desmame = ? WHERE id = ?", (data_ok(b.get("data"), False) or hoje(), aid))
        if b.get("kg"):
            con.execute("INSERT INTO pesagens (animal_id, data, kg, obs) VALUES (?,?,?,'desmame')", (aid, data_ok(b.get("data"), False) or hoje(), num(b["kg"])))
        return {"ok": True}


def fmt_data(s):
    return f"{s[8:10]}/{s[5:7]}/{s[0:4]}" if s else ""


@router.get("/api/ovelhas/painel")
def painel():
    with closing(db()) as con:
        hj = dia()
        ativos = con.execute("SELECT id, sexo, nascimento FROM animais WHERE status='ativo'").fetchall()
        cont = {"total": len(ativos), "ovelhas": 0, "carneiros": 0, "borregas": 0, "borregos": 0, "cordeiros": 0}
        for a in ativos:
            m = idade_meses(a["nascimento"])
            if m is not None and m < 4:
                cont["cordeiros"] += 1
            elif m is not None and m < 12:
                cont["borregas" if a["sexo"] == "F" else "borregos"] += 1
            else:
                cont["ovelhas" if a["sexo"] == "F" else "carneiros"] += 1
        ano = str(hj.year)
        fin = con.execute("""SELECT SUM(CASE WHEN tipo='despesa' THEN valor ELSE 0 END) AS d, SUM(CASE WHEN tipo='receita' THEN valor ELSE 0 END) AS r
                             FROM lancamentos WHERE substr(data,1,4)=?""", (ano,)).fetchone()
        fin_tot = con.execute("""SELECT SUM(CASE WHEN tipo='despesa' THEN valor ELSE 0 END) AS d, SUM(CASE WHEN tipo='receita' THEN valor ELSE 0 END) AS r
                                 FROM lancamentos""").fetchone()
        pari = con.execute("SELECT COUNT(*) AS n, COALESCE(SUM(vivos),0) AS vivos, COALESCE(SUM(mortos),0) AS mortos FROM paricoes WHERE substr(data,1,4)=?", (ano,)).fetchone()
        proximas = []
        for m in _montas(con):
            for o in m["ovelhas"]:
                if not o["pariu"] and d(m["paricao_ate"]) >= hj:
                    proximas.append({"brinco": o["brinco"], "de": m["paricao_de"], "ate": m["paricao_ate"], "carneiro": m["carneiro_brinco"]})
        proximas.sort(key=lambda x: x["de"])
        return {
            "contagem": cont,
            "ano": ano,
            "despesa_ano": round(fin["d"] or 0, 2), "receita_ano": round(fin["r"] or 0, 2),
            "despesa_total": round(fin_tot["d"] or 0, 2), "receita_total": round(fin_tot["r"] or 0, 2),
            "custo_por_cabeca_ano": round((fin["d"] or 0) / cont["total"], 2) if cont["total"] else 0,
            "paricoes_ano": dict(pari),
            "proximas_paricoes": proximas[:10],
            "alertas": (av := _alertas(con)),
            "pendentes": _pendentes(av),
            "montas_abertas": [m for m in _montas(con) if m["aberta"]],
        }


# ---------------------------------------------------------------- config e exportação
@router.get("/api/ovelhas/config")
def config():
    with closing(db()) as con:
        return {r["chave"]: r["valor"] for r in con.execute("SELECT chave, valor FROM config")}


@router.post("/api/ovelhas/config")
async def salvar_config(req: Request):
    b = await req.json()
    with closing(db()) as con, con:
        for k in ("raca_padrao", "nome_rebanho"):
            if k in b:
                con.execute("INSERT OR REPLACE INTO config (chave, valor) VALUES (?,?)", (k, texto(b[k], 80) or ""))
        return {r["chave"]: r["valor"] for r in con.execute("SELECT chave, valor FROM config")}


@router.get("/ovelhas/exportar.zip")
def exportar():
    """Todas as tabelas em CSV (abre no Excel / Google Sheets)."""
    buf = io.BytesIO()
    with closing(db()) as con, zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        consultas = {
            "animais": """SELECT a.id, a.brinco, a.nome, a.sexo, a.raca, a.nascimento, p.brinco AS pai, m.brinco AS mae, a.origem, a.entrada,
                                 a.valor_compra, a.desmame, a.status, a.saida, a.valor_saida, a.motivo_saida, a.obs
                          FROM animais a LEFT JOIN animais p ON p.id=a.pai_id LEFT JOIN animais m ON m.id=a.mae_id ORDER BY a.brinco""",
            "montas": """SELECT mo.id, c.brinco AS carneiro, mo.inicio, mo.fim, group_concat(o.brinco, ' ') AS ovelhas, mo.obs
                         FROM montas mo JOIN animais c ON c.id=mo.carneiro_id LEFT JOIN monta_ovelhas x ON x.monta_id=mo.id
                         LEFT JOIN animais o ON o.id=x.ovelha_id GROUP BY mo.id ORDER BY mo.inicio""",
            "paricoes": """SELECT p.id, p.data, m.brinco AS mae, c.brinco AS pai, p.vivos, p.mortos, p.obs FROM paricoes p
                           JOIN animais m ON m.id=p.mae_id LEFT JOIN animais c ON c.id=p.pai_id ORDER BY p.data""",
            "sanidade": """SELECT s.id, s.data, a.brinco, s.tipo, s.produto, s.dose, s.famacha, s.custo, s.proxima, s.obs
                           FROM sanidade s JOIN animais a ON a.id=s.animal_id ORDER BY s.data, s.id""",
            "pesagens": """SELECT p.id, p.data, a.brinco, p.kg, p.obs FROM pesagens p JOIN animais a ON a.id=p.animal_id ORDER BY p.data, p.id""",
            "lancamentos": """SELECT l.id, l.data, l.tipo, l.categoria, l.descricao, l.valor, a.brinco AS animal
                              FROM lancamentos l LEFT JOIN animais a ON a.id=l.animal_id ORDER BY l.data, l.id""",
        }
        for nome, sql in consultas.items():
            rows = con.execute(sql).fetchall()
            s = io.StringIO()
            w = csv.writer(s, delimiter=";")
            if rows:
                w.writerow(rows[0].keys())
                for r in rows:
                    w.writerow([("" if v is None else str(v).replace(".", ",") if isinstance(v, float) else v) for v in r])
            z.writestr(f"{nome}.csv", "﻿" + s.getvalue())
    buf.seek(0)
    nome = f"ovelhas-tafona-{hoje()}.zip"
    return Response(buf.read(), media_type="application/zip", headers={"Content-Disposition": f'attachment; filename="{nome}"'})


# ---------------------------------------------------------------- notificações no celular (Web Push)
# Chaves VAPID geradas na primeira subida e guardadas em /dados (entram no backup junto com o banco).
VAPID_ARQ = DADOS / "ovelhas-vapid.pem"
VAPID_CONTATO = "mailto:tafona@maugrando.com.br"


def _vapid():
    from py_vapid import Vapid02
    if not VAPID_ARQ.exists():
        v = Vapid02()
        v.generate_keys()
        VAPID_ARQ.write_bytes(v.private_pem())
        os.chmod(VAPID_ARQ, 0o600)
    return Vapid02.from_pem(VAPID_ARQ.read_bytes())


def _vapid_publica():
    from cryptography.hazmat.primitives import serialization
    from py_vapid import b64urlencode
    pub = _vapid().public_key.public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
    return b64urlencode(pub)


@router.get("/api/ovelhas/push/chave")
def push_chave():
    with closing(db()) as con:
        n = con.execute("SELECT COUNT(*) FROM push_inscricoes").fetchone()[0]
    return {"chave": _vapid_publica(), "inscritos": n}


@router.post("/api/ovelhas/push/inscrever")
async def push_inscrever(req: Request):
    b = await req.json()
    sub = b.get("inscricao") or {}
    chaves = sub.get("keys") or {}
    if not sub.get("endpoint") or not chaves.get("p256dh") or not chaves.get("auth"):
        raise HTTPException(400, "inscrição incompleta")
    with closing(db()) as con, con:
        con.execute("INSERT OR REPLACE INTO push_inscricoes (endpoint, p256dh, auth, aparelho) VALUES (?,?,?,?)",
                    (sub["endpoint"], chaves["p256dh"], chaves["auth"], texto(b.get("aparelho"), 120)))
    return {"ok": True}


@router.post("/api/ovelhas/push/sair")
async def push_sair(req: Request):
    b = await req.json()
    with closing(db()) as con, con:
        con.execute("DELETE FROM push_inscricoes WHERE endpoint = ?", (str(b.get("endpoint", "")),))
    return {"ok": True}


def _enviar_push(titulo, corpo, pendentes):
    """Manda para todos os aparelhos inscritos. Retorna (enviados, falhas)."""
    from pywebpush import WebPushException, webpush
    carga = json.dumps({"titulo": titulo, "corpo": corpo, "pendentes": pendentes, "url": "/ovelhas"}, ensure_ascii=False)
    with closing(db()) as con:
        inscritos = con.execute("SELECT endpoint, p256dh, auth FROM push_inscricoes").fetchall()
    ok = falha = 0
    vapid = _vapid()
    for i in inscritos:
        try:
            webpush({"endpoint": i["endpoint"], "keys": {"p256dh": i["p256dh"], "auth": i["auth"]}}, carga,
                    vapid_private_key=vapid, vapid_claims={"sub": VAPID_CONTATO}, ttl=12 * 3600, timeout=15)
            ok += 1
        except WebPushException as e:
            falha += 1
            codigo = getattr(e.response, "status_code", None)
            log.warning("push falhou (%s): %s", codigo, e)
            if codigo in (404, 410):   # inscrição morta (app removido / permissão retirada)
                with closing(db()) as con, con:
                    con.execute("DELETE FROM push_inscricoes WHERE endpoint = ?", (i["endpoint"],))
        except Exception as e:      # rede etc.: tenta de novo amanhã
            falha += 1
            log.warning("push falhou: %s", e)
    return ok, falha


def _resumo_push():
    with closing(db()) as con:
        av = _alertas(con)
    importantes = [a for a in av if a["nivel"] in ("alto", "medio")]
    if not importantes:
        return None
    linhas = [("🔴 " if a["nivel"] == "alto" else "🟠 ") + a["texto"] for a in importantes[:4]]
    if len(importantes) > 4:
        linhas.append(f"+{len(importantes) - 4} outro(s)")
    titulo = f"{len(importantes)} tarefa(s) no rebanho"
    return titulo, "\n".join(linhas), len(importantes)


@router.post("/api/ovelhas/push/teste")
def push_teste():
    r = _resumo_push()
    titulo, corpo, n = r if r else ("Notificações ligadas", "Tudo em dia no rebanho. Os avisos chegam aqui às 7h.", 0)
    ok, falha = _enviar_push(titulo, corpo, n)
    if not ok and not falha:
        raise HTTPException(400, "nenhum aparelho inscrito")
    return {"enviados": ok, "falhas": falha}


def _laco_push():
    """Uma vez por dia, a partir das 7h (Brasília): se houver tarefa vermelha/laranja, avisa o celular."""
    while True:
        try:
            agora = datetime.now(FUSO)
            if agora.hour >= HORA_PUSH:
                with closing(db()) as con:
                    ultimo = con.execute("SELECT valor FROM config WHERE chave='push_ultimo_dia'").fetchone()
                if not ultimo or ultimo[0] != agora.date().isoformat():
                    r = _resumo_push()
                    if r:
                        _enviar_push(*r)
                    with closing(db()) as con, con:
                        con.execute("INSERT OR REPLACE INTO config (chave, valor) VALUES ('push_ultimo_dia', ?)", (agora.date().isoformat(),))
        except Exception:
            log.exception("laço de push")
        time.sleep(600)


def iniciar_push():
    if os.environ.get("TAFONA_SEM_PUSH"):
        return
    try:
        _vapid()
    except Exception:
        log.exception("não consegui criar as chaves de push")
        return
    threading.Thread(target=_laco_push, name="push-ovelhas", daemon=True).start()


@router.get("/ovelhas/sw.js")
def service_worker():
    return FileResponse(BASE / "static" / "ovelhas-sw.js", media_type="application/javascript",
                        headers={"Cache-Control": "no-cache", "Service-Worker-Allowed": "/ovelhas"})


# ---------------------------------------------------------------- página e PWA
@router.get("/ovelhas")
def pagina():
    return FileResponse(BASE / "ovelhas.html", headers={"Cache-Control": "no-cache"})


@router.get("/ovelhas/manifest.json")
def manifesto():
    return FileResponse(BASE / "static" / "ovelhas-manifest.json", media_type="application/manifest+json")


@router.get("/ovelhas/{arquivo}")
def estatico(arquivo: str):
    permitidos = {"ovelha.png", "ovelha-512.png"}
    if arquivo not in permitidos:
        raise HTTPException(404)
    # no-cache: o navegador sempre confere (ETag) e pega o ícone novo quando ele muda
    return FileResponse(BASE / "static" / arquivo, headers={"Cache-Control": "no-cache"})
