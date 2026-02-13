# Kenzie Hub

![CI](https://github.com/JrValerio/Kenzie-Hub/actions/workflows/ci.yml/badge.svg)
![Kenzie Hub](./src/assets/KenzieHub.png)

Production-ready fullstack application built with React (Vite) and a custom Express API secured with JWT and backed by PostgreSQL (Prisma ORM). The project uses environment-safe configuration, CORS allowlist, and automated CI checks for frontend and API.

## Important Links

- Application: https://kenzie-hub-seven-blue.vercel.app/
- Source code: https://github.com/JrValerio/Kenzie-Hub

## Tech Stack

**Frontend**

- React + Vite
- React Router
- Axios
- SCSS
- Context API

**Backend**

- Express
- JWT authentication
- Prisma ORM
- PostgreSQL

**DevOps and Quality**

- Vercel (frontend hosting)
- Railway (API + database)
- GitHub Actions (CI)
- Supertest + Vitest (API testing)

## Architecture

```text
Frontend (Vercel / React)
        |
        v
API (Railway / Express + JWT)
        |
        v
PostgreSQL (Railway)
```

## Quick Start

```bash
# install frontend dependencies (root)
npm ci

# install API dependencies
npm --prefix api ci

# run frontend + API together
npm run dev:all
```

Run in separate terminals:

```bash
npm run dev:api
npm run dev
```

API tests:

```bash
npm --prefix api run test
```

## Features

- User registration
- Login and logout
- JWT session persistence
- Private dashboard
- Technology CRUD

## Why This Project

This project demonstrates:

- End-to-end authentication flow with protected routes.
- Domain validation and normalization across frontend and backend.
- Environment-safe configuration for local and production.
- Production deployment with CI gates for lint, build, and tests.
- Secure CORS strategy based on allowlist.

## Highlights

- React frontend integrated with a dedicated REST API.
- Monorepo includes its own backend, removing reliance on unstable third-party endpoints.
- Production guardrails: required `JWT_SECRET` and restricted CORS via `FRONTEND_URL`.

## Project Structure

- `src/components`: reusable UI components
- `src/pages`: application pages
- `src/providers`: app state contexts
- `src/routers`: public and private routing
- `src/services`: frontend API layer
- `src/styles`: SCSS styles
- `api`: backend (Express + Prisma + PostgreSQL)

## Frontend Configuration

The frontend uses `VITE_API_URL` to target the API.
In development, if `VITE_API_URL` is not defined, fallback is `http://localhost:3333`.

1. Create `.env` at the project root:

```bash
VITE_API_URL=http://localhost:3333
```

You can also copy from `.env.example`:

```bash
cp .env.example .env
```

2. Start everything:

```bash
npm run dev:all
```

## Local API

The local API lives in `api/` and exposes:

- `POST /sessions`
- `POST /users`
- `GET /profile`
- `POST /users/techs`
- `PUT /users/techs/:techId`
- `DELETE /users/techs/:techId`

API setup:

```bash
cd api
npm ci
```

Configure `api/.env` based on `api/.env.example`.
Run migrations before starting the API for the first time:

```bash
cd api
npm run migrate:dev
npm run seed
```

## Deployment (Vercel + Railway)

This project runs in production with:

- Frontend: Vercel (React + Vite)
- API: Railway (Express + JWT + Prisma)
- Database: Railway PostgreSQL

### Deploy API on Railway (Monorepo)

1. Create a Railway project and connect this repository.
2. Add a PostgreSQL service in the same Railway project.
3. Configure API service settings:

- Root Directory: `api`
- Build Command: `npm install`
- Start Command: `npm run start:prod`

4. Configure API environment variables:

```bash
NODE_ENV=production
JWT_SECRET=your-strong-secret
FRONTEND_URL=https://kenzie-hub-seven-blue.vercel.app
DATABASE_URL=postgresql://...
```

In `NODE_ENV=production`, `FRONTEND_URL` is required for CORS allowlist.

5. After first deploy, apply migrations:

```bash
npm run migrate:deploy
```

Optional (demo account):

```bash
npm run seed
```

Healthcheck:

- `GET /health` -> `{ "status": "ok" }`

### Deploy Frontend on Vercel

1. Configure environment variable:

```bash
VITE_API_URL=https://YOUR-API.railway.app
```

2. Trigger a new deploy.

### Production URLs

- Frontend: `https://YOUR-FRONT.vercel.app`
- API: `https://YOUR-API.railway.app`

## Security Model

- JWT issued on login (`POST /sessions`)
- Stateless authentication via bearer token
- Protected routes enforced by middleware
- CORS restricted to production frontend domain (`FRONTEND_URL`)
- Secrets and connection strings managed through environment variables

## Security Notes

- `JWT_SECRET` must be strong and unique per environment.
- `FRONTEND_URL` must point only to the official frontend domain in production.
- `.env` files must stay out of version control.

### Production Validation Checklist

- Register user (`POST /users`) -> `201`
- Login (`POST /sessions`) -> `200` + token
- Profile (`GET /profile`) -> `200`
- Create tech (`POST /users/techs`) -> `201`
- Update tech (accented or ASCII status) -> `200`
- Invalid status -> `400`
- Delete tech -> `204`

## Case Study - From Academic Project to Mini-Product

Originally built as an academic project, this application was redesigned into a production-ready mini-product with its own backend, secure authentication, and CI pipeline.

### Architecture Evolution

- Removed external API dependency.
- Built dedicated backend (`Express + JWT`).
- Migrated persistence from file storage to PostgreSQL with Prisma.

### Security Hardening

- `JWT_SECRET` required in production.
- CORS restricted by `FRONTEND_URL` (allowlist).
- `.env` isolated and ignored in version control.

### Domain Consistency

- Technology status validation and normalization.
- Compatibility with accented and ASCII input variants.
- Single source of truth for domain rules across frontend and backend.

### Engineering and Quality

- Single `dev:all` script (frontend + backend).
- API tests with Supertest (auth + CRUD + protected routes).
- Automatic CI with lint/build/test on push and pull request.

## Technical Decisions

- CORS allowlist: API only accepts the official frontend domain in production.
- `app` and `server` separation: enables testing without starting HTTP listener.
- Prisma + PostgreSQL: transactional persistence and migration-based schema versioning.
- Normalized technology status: prevents accent/encoding inconsistencies.
- Mandatory CI: validates frontend and API on every push to `main`.
