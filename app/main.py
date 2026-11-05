"""Tafona · Rótulos — app de etiquetas da fazenda (NIIMBOT B1).

O servidor NÃO fala com a impressora: quem imprime é o Chrome do Android
via Web Bluetooth. Aqui só servimos a página, o cadastro de cortes e o
histórico do que foi impresso.

Sem login no app: o controle de acesso (liberação de aparelho com
notificação) é feito pela infraestrutura, na frente do app.
"""
import json
import os
import sqlite3
from contextlib import closing
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse

BASE = Path(__file__).parent
DADOS = Path(os.environ.get("TAFONA_DADOS", "/dados"))
DB = DADOS / "tafona.db"

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


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
            CREATE TABLE IF NOT EXISTS cortes (
                id        INTEGER PRIMARY KEY,
                nome      TEXT NOT NULL,
                por_boi   INTEGER NOT NULL DEFAULT 1,  -- quantas etiquetas esse corte leva por boi
                ordem     INTEGER NOT NULL DEFAULT 0,
                ativo     INTEGER NOT NULL DEFAULT 1,
                criado_em TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS impressoes (
                id          INTEGER PRIMARY KEY,
                em          TEXT NOT NULL DEFAULT (datetime('now')),
                modo        TEXT NOT NULL,          -- 'boi' ou 'avulsa'
                data_abate  TEXT NOT NULL,          -- AAAA-MM-DD
                bois        INTEGER,                -- só no modo 'boi'
                etiquetas   INTEGER NOT NULL,       -- metades impressas (sem contar a repetida)
                folhas      INTEGER NOT NULL,
                itens       TEXT NOT NULL           -- JSON [{"corte": "...", "qtd": n}]
            );
            """
        )
        # cortes iniciais (só se a tabela estiver vazia) — vêm de cortes_iniciais.json
        if con.execute("SELECT COUNT(*) FROM cortes").fetchone()[0] == 0:
            arq = BASE / "cortes_iniciais.json"
            if arq.exists():
                for i, c in enumerate(json.loads(arq.read_text(encoding="utf-8"))):
                    con.execute(
                        "INSERT INTO cortes (nome, por_boi, ordem) VALUES (?, ?, ?)",
                        (c["nome"].strip(), int(c.get("por_boi", 1)), i + 1),
                    )


@app.on_event("startup")
def _inicio():
    criar_banco()


# ---------------------------------------------------------------- páginas e arquivos
@app.get("/")
def raiz():
    return RedirectResponse("/rotulos")


@app.get("/saude")
def saude():
    return {"ok": True}


@app.get("/rotulos")
def pagina():
    return FileResponse(BASE / "rotulos.html", headers={"Cache-Control": "no-cache"})


@app.get("/rotulos/manifest.json")
def manifesto():
    return FileResponse(BASE / "static" / "manifest.json", media_type="application/manifest+json")


@app.get("/rotulos/{arquivo}")
def estatico(arquivo: str):
    permitidos = {"niimbluelib.js", "icone.png", "icone-512.png"}
    if arquivo not in permitidos:
        raise HTTPException(404)
    return FileResponse(BASE / "static" / arquivo, headers={"Cache-Control": "public, max-age=86400"})


# ---------------------------------------------------------------- API
def _cortes(con, todos=False):
    sql = "SELECT id, nome, por_boi, ordem, ativo FROM cortes"
    if not todos:
        sql += " WHERE ativo = 1"
    return [dict(r) for r in con.execute(sql + " ORDER BY ordem, nome")]


@app.get("/api/rotulos")
def dados(req: Request):
    with closing(db()) as con:
        return {"cortes": _cortes(con, todos=True)}


@app.post("/api/rotulos")
async def registrar(req: Request):
    """Grava no histórico o que a B1 já imprimiu."""
    b = await req.json()
    if b.get("modo") not in ("boi", "avulsa"):
        raise HTTPException(400, "modo inválido")
    itens = [{"corte": str(i["corte"])[:80], "qtd": int(i["qtd"])} for i in b.get("itens", []) if int(i["qtd"]) > 0]
    with closing(db()) as con, con:
        con.execute(
            "INSERT INTO impressoes (modo, data_abate, bois, etiquetas, folhas, itens) VALUES (?,?,?,?,?,?)",
            (b["modo"], str(b["data_abate"])[:10], b.get("bois"), int(b["etiquetas"]),
             int(b["folhas"]), json.dumps(itens, ensure_ascii=False)),
        )
    return {"ok": True}


@app.get("/api/historico")
def historico(req: Request):
    with closing(db()) as con:
        rows = con.execute(
            "SELECT id, datetime(em, '-3 hours') AS em, modo, data_abate, bois, etiquetas, folhas, itens "
            "FROM impressoes ORDER BY id DESC LIMIT 60"
        ).fetchall()
    return {"impressoes": [dict(r) | {"itens": json.loads(r["itens"])} for r in rows]}


@app.post("/api/cortes")
async def salvar_corte(req: Request):
    """Cria (sem id) ou altera (com id) um corte."""
    b = await req.json()
    nome = str(b.get("nome", "")).strip()[:60]
    por_boi = max(0, min(99, int(b.get("por_boi", 1))))
    with closing(db()) as con, con:
        if b.get("id"):
            campos, vals = [], []
            if nome:
                campos.append("nome = ?"); vals.append(nome)
            if "por_boi" in b:
                campos.append("por_boi = ?"); vals.append(por_boi)
            if "ativo" in b:
                campos.append("ativo = ?"); vals.append(1 if b["ativo"] else 0)
            if campos:
                con.execute(f"UPDATE cortes SET {', '.join(campos)} WHERE id = ?", (*vals, int(b["id"])))
        else:
            if not nome:
                raise HTTPException(400, "nome vazio")
            ordem = con.execute("SELECT COALESCE(MAX(ordem), 0) + 1 FROM cortes").fetchone()[0]
            con.execute("INSERT INTO cortes (nome, por_boi, ordem) VALUES (?,?,?)", (nome, por_boi, ordem))
        return {"cortes": _cortes(con, todos=True)}


@app.post("/api/cortes/mover")
async def mover_corte(req: Request):
    """Sobe ou desce um corte na ordem ({"id": n, "dir": -1 | 1})."""
    b = await req.json()
    with closing(db()) as con, con:
        lista = _cortes(con, todos=True)
        idx = next((i for i, c in enumerate(lista) if c["id"] == int(b["id"])), None)
        alvo = None if idx is None else idx + (1 if int(b["dir"]) > 0 else -1)
        if idx is not None and 0 <= alvo < len(lista):
            lista[idx], lista[alvo] = lista[alvo], lista[idx]
            for i, c in enumerate(lista):
                con.execute("UPDATE cortes SET ordem = ? WHERE id = ?", (i + 1, c["id"]))
        return {"cortes": _cortes(con, todos=True)}


@app.exception_handler(HTTPException)
async def erro_http(req: Request, exc: HTTPException):
    return JSONResponse({"erro": exc.detail}, status_code=exc.status_code)
