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

---

# PBT · Projeto Borrego Tafona (módulo Ovelhas)

Controle do rebanho ovino, no mesmo container, em **https://tafona.maugrando.com.br/ovelhas**.
Banco **SQLite** próprio em `./dados/ovelhas.db` (entra no mesmo backup). Sem login no app, como o Rótulos.

- `app/ovelhas.py`: rotas `/ovelhas*` e `/api/ovelhas/*` (router incluído pelo `main.py`).
- `app/ovelhas.html`: a página (PWA, um arquivo só). Ícone `app/static/ovelha*.png`, manifesto `ovelhas-manifest.json`.
- Tudo por botão; só se digita brinco, peso e valor. Aba **Mais → Como funciona** explica o uso.

## O que faz

| Módulo | O quê |
|---|---|
| Rebanho | Cadastro por brinco (sexo, raça, nascimento, pai, mãe, origem, valor). Compra vira despesa; venda vira receita. Baixa: vendido / abatido / morto |
| Genealogia | Árvore de 3 gerações, filhos. Parentesco pelo coeficiente de Wright: ≥ 0,2 bloqueia (pai×filha, irmãos, meio-irmãos, avô×neta), ≥ 0,1 avisa (primos) |
| Reprodução | Monta a campo (carneiro + ovelhas, entrada/saída do lote); parição prevista em 150 dias; parição registrada já cria os cordeiros com pai e mãe |
| Sanidade | Vacina, vermífugo, Famacha, casco… em lote, custo total rateado, repetição em N dias com aviso de vencimento; Famacha ≥ 4 vira aviso |
| Pesagens | Em lote por data; ganho e g/dia na ficha |
| Custos | Lançamentos manuais + automáticos; despesa sem animal é rateada por animal-dia; custo direto/rateado/total por animal |
| Painel | Contagem por categoria, avisos (sanidade vencida, Famacha, parição prevista, filhas do carneiro em idade de cruzar, sem pesagem há 60 dias), dinheiro no ano |
| Exportar | `/ovelhas/exportar.zip`: todas as tabelas em CSV (`;`, UTF-8 com BOM, decimal com vírgula) |

## Banco (`ovelhas.db`, criado sozinho)

```sql
config(chave, valor)                       -- raca_padrao, nome_rebanho
animais(id, brinco UNIQUE, nome, sexo F|M, raca, nascimento, pai_id, mae_id, origem comprado|nascido, entrada,
        valor_compra, status ativo|vendido|abatido|morto, saida, valor_saida, motivo_saida, obs, criado_em)
montas(id, carneiro_id, inicio, fim, obs) + monta_ovelhas(monta_id, ovelha_id)
paricoes(id, mae_id, pai_id, monta_id, data, vivos, mortos, obs)
sanidade(id, animal_id, data, tipo, produto, dose, famacha, custo, proxima, obs, grupo)
pesagens(id, animal_id, data, kg, obs)
lancamentos(id, data, tipo despesa|receita, categoria, descricao, valor, animal_id NULL=rebanho, origem)
```

`origem` em `lancamentos` marca os automáticos (`animal:<id>`, `saida:<id>`, `sanidade:<grupo>`): não se apagam pela aba Custos.
O banco é só leitura para quem for responder perguntas (Claude): abrir `ovelhas.db` com SQLite.

## Avisos, tarefas e notificações (nov/2026)

- `GET /api/ovelhas/avisos` → `{avisos, pendentes}`; cada aviso tem `chave`, `nivel` (alto/medio/baixo), `acao`, `rotulo`, `manual`.
  `POST /api/ovelhas/avisos/estado` `{chave, acao: feito|adiar, dias}` (tabela `avisos_estado`).
- Tarefas de manejo: tirar carneiro (≥45 dias no lote), vacina pré-parto (40 dias antes), parição, 1ª vacina do cordeiro,
  desmame (`POST /api/ovelhas/animais/{id}/desmame`, coluna `animais.desmame`), separar borrego macho (4 meses),
  Famacha do rebanho (dez–mar, a cada 15 dias), Famacha 4–5, sanidade vencida, genética, pesagem.
- Bolinha vermelha = vermelhos + laranjas: no sino, na aba Painel e no ícone (`navigator.setAppBadge`).
- **Web Push** (sem Pushover): service worker `/ovelhas/sw.js` (scope `/ovelhas`), inscrição em `push_inscricoes`,
  chaves VAPID em `dados/ovelhas-vapid.pem` (criadas na 1ª subida; **entram no backup**). Uma thread manda o resumo
  todo dia a partir das 07h (America/Sao_Paulo) se houver vermelho/laranja (`config.push_ultimo_dia`).
  Precisa de saída HTTPS do container para os serviços de push (fcm.googleapis.com, web.push.apple.com,
  updates.push.services.mozilla.com). `TAFONA_SEM_PUSH=1` desliga a thread.
- Datas no fuso America/Sao_Paulo (o container roda em UTC; `tzdata` no requirements).
