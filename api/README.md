# Kenzie Hub API (Local)

API REST local para suportar o frontend do Kenzie Hub sem depender da API antiga.

## Variaveis de ambiente

Crie um arquivo `.env` na pasta `api/` com base em `.env.example`:

```bash
PORT=3333
JWT_SECRET=troque-este-segredo-em-producao
FRONTEND_URL=http://localhost:5173
```

- `JWT_SECRET`: obrigatorio em producao.
- `FRONTEND_URL`: lista de origens permitidas no CORS (separadas por virgula).
- Em `NODE_ENV=production`, `FRONTEND_URL` e obrigatorio.

## Rodando

```bash
cd api
npm install
npm run dev
```

Base URL local:

```text
http://localhost:3333
```

## Endpoints

- `POST /users`
- `POST /sessions`
- `GET /profile` (Bearer token)
- `POST /users/techs` (Bearer token)
- `PUT /users/techs/:techId` (Bearer token)
- `DELETE /users/techs/:techId` (Bearer token)
