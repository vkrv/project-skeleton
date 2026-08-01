# Environment variables

Document **names only** here. Never commit secrets. Use `.env` locally (gitignored); keep `.env.example` as empty placeholders.

## Conventions

- Server / API secrets stay on the server
- Public client vars use the platform prefix (`EXPO_PUBLIC_*`, `VITE_*`, etc.)
- Parse and validate with Zod at process startup where applicable

## Variables

| Name | Used by | Required | Description |
|------|---------|----------|-------------|
| `DATABASE_URL` | server / db | when using Postgres | Postgres connection string |
| `AUTH_JWT_SECRET` | server | when using JWT auth | Signing secret for app-issued tokens |

Add rows as apps introduce new config. Do not put values in this doc.
