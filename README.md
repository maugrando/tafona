# Tafona · Rótulos

App web de etiquetas de carneação da fazenda Tafona, impressas na NIIMBOT B1 (rolo 50×30 cortado em duas metades:
nome do corte + data de abate). Endereço: **https://tafona.maugrando.com.br**.

O servidor **não** fala com a impressora: quem imprime é o Chrome do Android por Web Bluetooth.
O servidor só serve a página, o cadastro de cortes e o histórico de impressões.

- 1 container Python (FastAPI + Uvicorn), banco **SQLite** em `./dados/tafona.db` (cortes + histórico).
- Escuta só em `127.0.0.1:8090`; o Nginx do servidor faz o HTTPS (obrigatório para o Bluetooth).
- **Sem login no app.** O controle de acesso fica na infraestrutura, na frente do app.
  Se uma chamada à API voltar 401/403, a página recarrega para passar de novo pelo controle de acesso.
- Sem variáveis de ambiente obrigatórias.
- Biblioteca da impressora `@mmote/niimbluelib` 0.48.0 (MIT) copiada em `app/static/`.
- `app/cortes_iniciais.json`: cortes carregados só na primeira subida, com o banco vazio.

## Rotas

| Rota | O quê |
|---|---|
| `GET /` | redireciona para `/rotulos` |
| `GET /saude` | healthcheck |
| `GET /rotulos` | a página (HTML+CSS+JS num arquivo só) |
| `GET /rotulos/manifest.json`, `/rotulos/icone.png`, `/rotulos/icone-512.png`, `/rotulos/niimbluelib.js` | PWA e biblioteca |
| `GET /api/rotulos` | lista de cortes |
| `POST /api/rotulos` | grava no histórico o que foi impresso |
| `GET /api/historico` | últimas 60 impressões |
| `POST /api/cortes`, `POST /api/cortes/mover` | cadastro e ordem dos cortes |

## Banco (criado sozinho)

```sql
cortes(id, nome, por_boi, ordem, ativo, criado_em)
impressoes(id, em, modo 'boi'|'avulsa', data_abate, bois, etiquetas, folhas, itens JSON)
```

## Rodar

`docker compose up -d --build` → `curl http://127.0.0.1:8090/saude` → `{"ok":true}`.
O backup precisa incluir `dados/`.
