"""PBT · Projeto Borrego Tafona — controle do rebanho ovino da fazenda.

Rebanho, genealogia (quem pode cruzar com quem), monta a campo, parições,
sanidade, pesagens, custos e painel. Banco SQLite próprio em /dados/ovelhas.db.

Sem login no app: o controle de acesso é feito pela infraestrutura, na frente do app.
"""
import csv
import io
import os
import sqlite3
import zipfile
from contextlib import closing
from datetime import date, datetime, timedelta
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, Response

BASE = Path(__file__).parent
DADOS = Path(os.environ.get("TAFONA_DADOS", "/dados"))
DB = DADOS / "ovelhas.db"

router = APIRouter()

GESTACAO_DIAS = 150          # ovelha: 147–152 dias
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
            CREATE INDEX IF NOT EXISTS ix_san_animal ON sanidade(animal_id, data);
            CREATE INDEX IF NOT EXISTS ix_pes_animal ON pesagens(animal_id, data);
            CREATE INDEX IF NOT EXISTS ix_lan_data ON lancamentos(data);
            """
        )
        for chave, valor in [("raca_padrao", "Hampshire Down"), ("nome_rebanho", "PBT · Projeto Borrego Tafona")]:
            con.execute("INSERT OR IGNORE INTO config (chave, valor) VALUES (?, ?)", (chave, valor))
        # nome antigo de fábrica -> nome do projeto (não mexe se o Mau já tiver trocado)
        con.execute("UPDATE config SET valor = 'PBT · Projeto Borrego Tafona' WHERE chave = 'nome_rebanho' AND valor = 'Ovelhas · Tafona'")


# ---------------------------------------------------------------- utilidades
def hoje():
    return date.today().isoformat()


def d(s):
    """'AAAA-MM-DD' -> date (ou None)."""
    if not s:
        return None
    return date.fromisoformat(str(s)[:10])


def idade_meses(nasc, ref=None):
    n = d(nasc)
    if not n:
        return None
    r = d(ref) or date.today()
    return (r.year - n.year) * 12 + (r.month - n.month) - (1 if r.day < n.day else 0)


def idade_txt(nasc):
    m = idade_meses(nasc)
    if m is None:
        return ""
    if m < 1:
        return f"{(date.today() - d(nasc)).days} dias"
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
    """Sugere o próximo brinco no padrão AA-NNN (ano com 2 dígitos + sequência)."""
    ano = date.today().strftime("%y")
    with closing(db()) as con:
        usados = [r["brinco"] for r in con.execute("SELECT brinco FROM animais WHERE brinco LIKE ?", (f"{ano}-%",))]
    seq = 0
    for b in usados:
        try:
            seq = max(seq, int(b.split("-", 1)[1]))
        except (IndexError, ValueError):
            pass
    return {"brinco": f"{ano}-{seq + 1:03d}"}


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
        ini, fim = d(m["inicio"]), d(m["fim"]) or date.today()
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
def _alertas(con):
    alertas = []
    hj = date.today()
    # sanidade atrasada: última 'proxima' por animal e tipo, já vencida e sem aplicação posterior
    rows = con.execute("""SELECT s.animal_id, a.brinco, s.tipo, MAX(s.proxima) AS proxima, MAX(s.data) AS ultima
                          FROM sanidade s JOIN animais a ON a.id = s.animal_id
                          WHERE a.status='ativo' AND s.proxima IS NOT NULL GROUP BY s.animal_id, s.tipo""").fetchall()
    for r in rows:
        ultima_do_tipo = con.execute("SELECT MAX(data) FROM sanidade WHERE animal_id=? AND tipo=?", (r["animal_id"], r["tipo"])).fetchone()[0]
        if r["proxima"] and d(r["proxima"]) <= hj and ultima_do_tipo < r["proxima"]:
            atraso = (hj - d(r["proxima"])).days
            alertas.append({"nivel": "alto" if atraso > 15 else "medio", "tipo": "sanidade", "animal_id": r["animal_id"],
                            "texto": f"{r['brinco']}: {r['tipo']} vencido há {atraso} dia(s)" if atraso else f"{r['brinco']}: {r['tipo']} vence hoje"})
        elif r["proxima"] and 0 < (d(r["proxima"]) - hj).days <= 7 and ultima_do_tipo < r["proxima"]:
            alertas.append({"nivel": "baixo", "tipo": "sanidade", "animal_id": r["animal_id"],
                            "texto": f"{r['brinco']}: {r['tipo']} em {(d(r['proxima']) - hj).days} dia(s)"})
    # famacha 4 ou 5 na última avaliação
    for r in con.execute("""SELECT a.brinco, s.animal_id, s.famacha, s.data FROM sanidade s JOIN animais a ON a.id=s.animal_id
                            WHERE s.tipo='Famacha' AND a.status='ativo' AND s.id = (SELECT id FROM sanidade WHERE animal_id=s.animal_id AND tipo='Famacha' ORDER BY data DESC, id DESC LIMIT 1)
                            AND s.famacha >= 4"""):
        alertas.append({"nivel": "alto", "tipo": "famacha", "animal_id": r["animal_id"], "texto": f"{r['brinco']}: Famacha {r['famacha']} em {fmt_data(r['data'])} — vermifugar"})
    # parições previstas
    for m in _montas(con):
        for o in m["ovelhas"]:
            if o["pariu"]:
                continue
            de, ate = d(m["paricao_de"]), d(m["paricao_ate"])
            if de - timedelta(days=14) <= hj <= ate:
                alertas.append({"nivel": "medio", "tipo": "paricao", "animal_id": o["id"],
                                "texto": f"{o['brinco']}: parição prevista entre {fmt_data(m['paricao_de'])} e {fmt_data(m['paricao_ate'])}"})
            elif hj > ate:
                alertas.append({"nivel": "baixo", "tipo": "paricao", "animal_id": o["id"],
                                "texto": f"{o['brinco']}: passou da data prevista e não há parição registrada (vazia?)"})
    # carneiro: filhas chegando à idade de cruzar
    pais = _pais(con)
    for c in con.execute("SELECT id, brinco FROM animais WHERE sexo='M' AND status='ativo'"):
        filhas = [f for f in con.execute("SELECT id, brinco, nascimento FROM animais WHERE sexo='F' AND status='ativo' AND pai_id=?", (c["id"],))
                  if (idade_meses(f["nascimento"]) or 0) >= IDADE_PUBERDADE_MESES - 1]
        if filhas:
            alertas.append({"nivel": "medio", "tipo": "genetica", "animal_id": c["id"],
                            "texto": f"Carneiro {c['brinco']} tem {len(filhas)} filha(s) em idade de cruzar: hora de outro carneiro ou de separar"})
    # sem pesagem há mais de 60 dias
    for r in con.execute("""SELECT a.id, a.brinco, (SELECT MAX(data) FROM pesagens WHERE animal_id=a.id) AS ult FROM animais a WHERE a.status='ativo'"""):
        if r["ult"] is None or (hj - d(r["ult"])).days > 60:
            alertas.append({"nivel": "baixo", "tipo": "pesagem", "animal_id": r["id"],
                            "texto": f"{r['brinco']}: " + ("nunca foi pesado" if r["ult"] is None else f"sem pesagem desde {fmt_data(r['ult'])}")})
    ordem = {"alto": 0, "medio": 1, "baixo": 2}
    return sorted(alertas, key=lambda x: ordem[x["nivel"]])


def fmt_data(s):
    return f"{s[8:10]}/{s[5:7]}/{s[0:4]}" if s else ""


@router.get("/api/ovelhas/painel")
def painel():
    with closing(db()) as con:
        hj = date.today()
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
            "alertas": _alertas(con),
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
                                 a.valor_compra, a.status, a.saida, a.valor_saida, a.motivo_saida, a.obs
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
