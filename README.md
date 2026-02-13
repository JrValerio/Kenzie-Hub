# Kenzie Hub

![CI](https://github.com/JrValerio/Kenzie-Hub/actions/workflows/ci.yml/badge.svg)
![Kenzie Hub](./src/assets/KenzieHub.png)

Aplicacao fullstack com frontend React (Vite) e API propria (Express + JWT + Prisma/Postgres), configurada por ambiente, CORS por allowlist e dominio validado/normalizado. O CI roda lint/build no frontend e testes de API com Supertest.

## Links Importantes

- Aplicacao: https://kenzie-hub-seven-blue.vercel.app/
- Codigo-fonte: https://github.com/JrValerio/Kenzie-Hub

## Quick Start

```bash
# instalar dependencias do frontend (raiz)
npm ci

# instalar dependencias da API
npm --prefix api ci

# rodar frontend + API juntos
npm run dev:all
```

Para rodar em terminais separados:

```bash
npm run dev:api
npm run dev
```

Testes da API:

```bash
npm --prefix api run test
```

## Funcionalidades

- Cadastro de usuario
- Login e logout
- Autologin com token
- Dashboard privada
- CRUD de tecnologias

## Destaques

- Integracao de frontend React com API REST.
- API incluida (Express + JWT + Prisma/Postgres) para rodar sem depender de endpoints externos.
- Config segura via ambiente: `JWT_SECRET` obrigatorio em producao e CORS por allowlist (`FRONTEND_URL`).

## Estrutura

- `src/components`: componentes reutilizaveis
- `src/pages`: paginas da aplicacao
- `src/providers`: contextos de estado
- `src/routers`: rotas publicas e privadas
- `src/services`: camada de API do frontend
- `src/styles`: estilos (SCSS)
- `api`: backend (Express + Prisma + PostgreSQL)

## Arquitetura

```text
Frontend (Vercel / React)
        |
        v
API (Railway / Express + JWT + Prisma)
        |
        v
PostgreSQL (Railway)
```

## Configuracao (Frontend)

O frontend usa `VITE_API_URL` para apontar para a API.
Em desenvolvimento, se `VITE_API_URL` nao estiver definida, o fallback e `http://localhost:3333`.

1. Crie `.env` na raiz:

```bash
VITE_API_URL=http://localhost:3333
```

Voce tambem pode copiar de `.env.example`:

```bash
cp .env.example .env
```

2. Rode tudo:

```bash
npm run dev:all
```

## API Local

A API local esta em `api/` e expoe:

- `POST /sessions`
- `POST /users`
- `GET /profile`
- `POST /users/techs`
- `PUT /users/techs/:techId`
- `DELETE /users/techs/:techId`

Instalacao da API:

```bash
cd api
npm install
```

Configure `api/.env` com base em `api/.env.example`.
Rode migrations antes de iniciar a API pela primeira vez:

```bash
cd api
npm run migrate:dev
npm run seed
```

## Deployment (Vercel + Railway)

Este projeto roda em producao com:

- Frontend: Vercel (React + Vite)
- API: Railway (Express + JWT + Prisma)
- Banco: Railway PostgreSQL

### Deploy da API no Railway (monorepo)

1. Crie um projeto no Railway e conecte este repositorio.
2. Adicione um PostgreSQL no mesmo projeto.
3. Configure o servico da API:

- Root Directory: `api`
- Build Command: `npm install`
- Start Command: `npm run start:prod`

4. Configure variaveis de ambiente no servico da API:

```bash
NODE_ENV=production
JWT_SECRET=um-segredo-forte
FRONTEND_URL=https://kenzie-hub-seven-blue.vercel.app
DATABASE_URL=postgresql://...
```

Em `NODE_ENV=production`, `FRONTEND_URL` e obrigatorio para CORS por allowlist.

5. Apos o primeiro deploy, aplique as migrations:

```bash
npm run migrate:deploy
```

Opcional (conta demo):

```bash
npm run seed
```

Healthcheck:

- `GET /health` -> `{ "status": "ok" }`

### Deploy do Frontend no Vercel

1. Configure a variavel de ambiente:

```bash
VITE_API_URL=https://SUA-API.railway.app
```

2. Rode um redeploy.

### Production URLs

- Frontend: `https://SEU-FRONT.vercel.app`
- API: `https://SUA-API.railway.app`

### Security Notes

- `JWT_SECRET` deve ser forte e exclusivo por ambiente.
- `FRONTEND_URL` deve apontar apenas para o dominio do frontend em producao.

### Checklist de validacao (producao)

- Registrar usuario (`POST /users`) -> `201`
- Login (`POST /sessions`) -> `200` + token
- Perfil (`GET /profile`) -> `200`
- Criar tech (`POST /users/techs`) -> `201`
- Editar tech (status acentuado/ascii) -> `200`
- Status invalido -> `400`
- Delete tech -> `204`

## Case Study - Evolucao para Mini-Produto

Este projeto comecou como uma aplicacao academica dependente de API externa instavel.
A evolucao tecnica incluiu:

### Arquitetura

- Remocao de dependencia externa.
- Criacao de API propria (`Express + JWT`).
- Migracao de persistencia em arquivo para Postgres com Prisma.

### Seguranca

- `JWT_SECRET` obrigatorio em producao.
- CORS restrito por `FRONTEND_URL` (allowlist).
- `.env` isolado e ignorado no versionamento.

### Dominio consistente

- Validacao e normalizacao de status de tecnologia.
- Compatibilidade com entradas acentuadas e variacoes de encoding.
- Fonte unica de verdade para regras de dominio (front + backend).

### Engenharia e Qualidade

- Script unico `dev:all` (frontend + backend).
- Testes de API com Supertest (auth + CRUD + rotas protegidas).
- CI automatico com lint/build/test em push e pull request.

## Decisoes Tecnicas

- CORS por allowlist: API aceita apenas o dominio oficial do frontend em producao.
- Separacao `app` e `server`: facilita testes sem subir listener HTTP.
- Prisma + Postgres: persistencia transacional e schema versionado por migration.
- Status de tecnologia normalizado: evita inconsistencias de acento/encoding.
- CI obrigatorio: valida frontend e API em todo push para `main`.
