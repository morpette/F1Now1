# F1Now1

A Formula 1 tracking app built on ServiceNow using the [ServiceNow Fluent SDK](https://developer.servicenow.com). This is a playground and portfolio project for hands-on ServiceNow development.

App scope: `x_1912467_f1now1`

## Prerequisites

- Node.js
- ServiceNow Fluent SDK: `npm install -g @servicenow/sdk`
- Access to a ServiceNow developer instance

## Setup

```bash
npm install
now-sdk auth        # Authenticate against your ServiceNow instance
npm run types       # Download dependency type definitions
```

## Development

```bash
npm run build       # Compile Fluent sources into an installable package
npm run deploy      # Install/update the app on the connected instance
npm run transform   # Download XML records from instance and convert to Fluent source
```

## Architecture

Artifacts are defined as TypeScript files using the Fluent DSL and compiled by `now-sdk build` into a ServiceNow-installable package. Source files live under `src/fluent/generated/`, organized by artifact type:

| Directory | Artifact type |
|-----------|---------------|
| `data/table/` | Table definitions |
| `data/form-section/` | Form layouts |
| `security/access-control/` | ACL rules |
| `security/role/` | Application roles |
| `user-interface/list/` | List view configurations |

Outbound HTTP calls (e.g. to `f1api.dev`) use a `RestMessage` + thin script-step `Action` pattern — see [`docs/rest-message-action-pattern.md`](docs/rest-message-action-pattern.md).

## Data Model

### Driver (`x_1912467_f1now1_driver`)

| Column | Type | Notes |
|--------|------|-------|
| `name` | String | Max 40 chars |
| `surname` | String | Max 40 chars |
| `driver_id` | String | API slug, e.g. `max_verstappen` |
| `abbreviation` | String | 3-letter code, e.g. `VER` |
| `number` | Integer | Race number |
| `nationality` | String | Country name |
| `date_of_birth` | Date | ISO date |

Data is sourced from [f1api.dev](https://f1api.dev). See [`docs/F1api.dev/openapi.yaml`](docs/F1api.dev/openapi.yaml) for available endpoints.

## Roles

| Role | Label | Access |
|------|-------|--------|
| `x_1912467_f1now1.admin` | Admin | Create, read, update records |
| `x_1912467_f1now1.user` | User | Read-only (default) |

## Docs

- [`docs/schema.md`](docs/schema.md) — Full table and column definitions
- [`docs/rest-message-action-pattern.md`](docs/rest-message-action-pattern.md) — Outbound REST pattern
- [`docs/deleting-fluent-artifacts.md`](docs/deleting-fluent-artifacts.md) — Cleanup playbook

# Acknowledgements
The fundamental building block for my project is the API endpoints that Rafa Canosa has developed and is still maintaining. Please check out his projects over at https://github.com/Rafacv23
