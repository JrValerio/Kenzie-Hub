# Kenzie Hub API (Postgres + Prisma)

API REST do Kenzie Hub com Express + JWT + Prisma (PostgreSQL).

## Variaveis de ambiente

Crie um arquivo `.env` na pasta `api/` com base em `.env.example`:

```bash
PORT=3333
JWT_SECRET=troque-este-segredo-em-producao
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kenziehub?schema=public
```

- `JWT_SECRET`: obrigatorio em producao.
- `FRONTEND_URL`: lista de origens permitidas no CORS (separadas por virgula).
- `DATABASE_URL`: conexao do Postgres usada pelo Prisma.
- Em `NODE_ENV=production`, `FRONTEND_URL` e obrigatorio.

## Setup local

```bash
cd api
npm install
npm run migrate:dev
npm run seed
npm run dev
```

Base URL local:

```text
http://localhost:3333
```

## Scripts

- `npm run dev`: inicia API com watch.
- `npm run start`: inicia API sem watch.
- `npm run generate`: gera Prisma Client.
- `npm run migrate:dev`: cria/aplica migration em dev.
- `npm run migrate:deploy`: espera DB e aplica migrations em producao.
- `npm run seed`: popula usuario demo.

## Endpoints

- `POST /users`
- `POST /sessions`
- `GET /profile` (Bearer token)
- `POST /users/techs` (Bearer token)
- `PUT /users/techs/:techId` (Bearer token)
- `DELETE /users/techs/:techId` (Bearer token)

## Railway (monorepo)

No servico da API:

- Root Directory: `api`
- Build Command: `npm install`
- Start Command: `npm run start:prod`

Variaveis no servico:

- `NODE_ENV=production`
- `JWT_SECRET=<valor-forte>`
- `FRONTEND_URL=https://seu-front.vercel.app`
- `DATABASE_URL=<fornecida pelo Postgres no Railway>`

Depois do primeiro deploy, rode migration:

```bash
npm run migrate:deploy
```

Opcional (conta demo):

```bash
npm run seed
```

O `start:prod` executa `db:wait` antes de subir a API.

Healthcheck:

```text
GET /health
```
