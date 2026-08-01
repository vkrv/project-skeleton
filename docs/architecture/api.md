# HTTP API conventions

Generic API shape notes. Product routes belong in feature docs, not here.

## Pagination

Prefer **offset** pagination unless a feature needs cursors:

| Query | Type | Default | Notes |
|-------|------|---------|-------|
| `limit` | integer | 20 | Cap at a documented max (e.g. 100) |
| `offset` | integer | 0 | Zero-based |

Response envelope (example):

```json
{
  "items": [],
  "total": 0,
  "limit": 20,
  "offset": 0
}
```

## Errors

- Use consistent HTTP status codes
- Return a structured body (`code`, `message`) validated with Zod where practical
- Do not leak internal stack traces to clients

## Auth

- Prefer app-issued JWTs verified in middleware
- Clients never hold database credentials
