# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

F1Now1 (`x_1912467_f1now1`) is a Formula 1 tracking app built on ServiceNow using the ServiceNow Fluent SDK. It is a playground and portfolio project for hands-on ServiceNow development training.

## Commands

```bash
npm run build          # Compile Fluent sources into installable package (now-sdk build)
npm run deploy         # Install/update the app on the connected instance (now-sdk install)
npm run transform      # Download XML records from instance and convert to Fluent source
npm run types          # Download dependency type definitions (now-sdk dependencies)
```

Additional SDK commands (not in package.json scripts):

```bash
now-sdk auth                     # Configure authentication to a ServiceNow instance
now-sdk download <directory>     # Download app metadata from instance
now-sdk query <table>            # Query records from a ServiceNow table on the instance
now-sdk clean                    # Clean build output directory
now-sdk explain [topic]          # Read Fluent SDK documentation in the terminal
now-sdk explain --list           # List all available SDK documentation topics
now-sdk explain --list <filter>  # Filter topics by keyword (e.g. --list table)
```

## Architecture

This project uses the **ServiceNow Fluent DSL** — a TypeScript-based, source-driven approach to defining ServiceNow application artifacts as code.

### How it works

Each `.now.ts` file exports a single artifact using a Fluent API builder function (`Table()`, `Acl()`, `Role()`, `List()`, `Record()`, etc.). `now-sdk build` compiles these TypeScript files into a ServiceNow-installable package. `now-sdk install` pushes that package to the configured instance.

### Source layout

`src/fluent/generated/` contains all Fluent DSL source files, organized by artifact type:

- `data/table/` — Table definitions (`Table()`)
- `data/form-section/` — Form section layout (`Record()` against `sys_ui_section`)
- `security/access-control/` — ACL rules (`Acl()`)
- `security/role/` — Application roles (`Role()`)
- `user-interface/list/` — List view column configurations (`List()`)
- `keys.ts` — Composite key registry (`Now.Internal.Keys`) used to resolve sys_ids for generated records

File names are prefixed with the ServiceNow sys_id of the artifact they represent.

### Application scope

The app scope is `x_1912467_f1now1`. All custom tables, roles, and ACLs are prefixed with this scope (e.g. `x_1912467_f1now1_driver`, `x_1912467_f1now1.admin`).

See [`docs/schema.md`](docs/schema.md) for the full table and column definitions, and role descriptions.

### Calling external REST APIs (REST Message + thin Action)

The Fluent SDK has **no REST step** for custom Actions. The standard approach for
outbound HTTP (e.g. f1api.dev) is a declarative `RestMessage` (one function per
endpoint) invoked from a thin custom `Action` whose single Script Step calls
`sn_ws.RESTMessageV2(...)`. Follow [`docs/rest-message-action-pattern.md`](docs/rest-message-action-pattern.md)
— it covers the file layout, templates for all three pieces, naming conventions,
and the build/deploy/verify workflow. The driver endpoints are the reference
implementation (`src/fluent/integrations/f1-api-driver-endpoints.now.ts` +
`src/fluent/actions/f1-*.now.ts`).

### Deleting artifacts & cleanup

When removing Fluent artifacts (and making sure they're gone from the instance), cleaning up
orphaned runtime records (e.g. action-type snapshots), or pruning `keys.ts`, follow
[`docs/deleting-fluent-artifacts.md`](docs/deleting-fluent-artifacts.md) — a step-by-step playbook
covering source removal, `Now.del` cleanup, and the gotchas (query row caps, shared peripheral tables).

### SDK documentation

Use `now-sdk explain <topic>` for API references and guides. Key topics:
- `table-api` — Table and column definitions
- `acl-api` — Access control rules
- `business-rule-guide` — Server-side automation
- `client-script-guide` — Client-side form scripts
- `developing-apps-guide` — Full project workflow
- `ci-integration` — Headless auth and CI/CD env vars

### Data sources

The main source of data will be the various API endpoints provided by f1api.dev. See the [`docs/f1api.dev/openapi.yaml`] (docs/f1api.dev/openapi.yaml) for a full description of these endpoints.
