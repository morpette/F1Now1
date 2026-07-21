# Application Schema

## Tables

### Driver (`x_1912467_f1now1_driver`)

Source: `src/fluent/generated/data/table/sys_db_object_1ec74194937d8b14a03577f08bba10ad.now.ts`

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `name` | StringColumn | Name | Max 40 chars |
| `surname` | StringColumn | Surname | Max 40 chars |
| `driver_id` | StringColumn | Driver ID | API slug, e.g. "max_verstappen". Max 60 chars |
| `abbreviation` | StringColumn | Abbreviation | 3-letter code, e.g. "VER". Max 3 chars |
| `number` | IntegerColumn | Number | Driver's race number |
| `nationality` | StringColumn | Nationality | Country name, e.g. "Dutch". Max 50 chars |
| `date_of_birth` | DateColumn | Date of Birth | ISO date, e.g. "1997-09-30" |
| `url` | UrlColumn | URL | Driver's f1api.dev/Wikipedia reference URL |

### Championship (`x_1912467_f1now1_championship`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_championship.now.ts`

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `championship_id` | StringColumn | Championship ID | API slug. Mandatory, unique. Max 60 chars |
| `year` | IntegerColumn | Year | |
| `name` | StringColumn | Name | Max 100 chars. Display column |
| `url` | UrlColumn | URL | |

### Circuit (`x_1912467_f1now1_circuit`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_circuit.now.ts`

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `circuit_id` | StringColumn | Circuit ID | API slug. Mandatory, unique. Max 60 chars |
| `name` | StringColumn | Name | Max 100 chars. Display column |
| `country` | StringColumn | Country | Max 60 chars |
| `city` | StringColumn | City | Max 60 chars |
| `circuit_length` | StringColumn | Circuit Length | Kept as string — inconsistent (unit vs bare number) across f1api.dev endpoints |
| `number_of_corners` | IntegerColumn | Number of Corners | Field name varies (`corners`/`numberOfCorners`) at the source |
| `lap_record` | StringColumn | Lap Record | Max 40 chars |
| `first_participation_year` | IntegerColumn | First Participation Year | |
| `fastest_lap_driver` | ReferenceColumn → Driver | Fastest Lap Driver | |
| `fastest_lap_team` | ReferenceColumn → Team | Fastest Lap Team | |
| `fastest_lap_year` | IntegerColumn | Fastest Lap Year | |
| `url` | UrlColumn | URL | |

### Race (`x_1912467_f1now1_race`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_race.now.ts`

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `race_id` | StringColumn | Race ID | API slug. Mandatory, unique. Max 60 chars |
| `championship` | ReferenceColumn → Championship | Championship | Mandatory |
| `circuit` | ReferenceColumn → Circuit | Circuit | Mandatory |
| `round` | IntegerColumn | Round | |
| `name` | StringColumn | Name | Max 100 chars. Display column |
| `laps` | IntegerColumn | Laps | |
| `fastest_lap_time` | StringColumn | Fastest Lap Time | Max 20 chars |
| `fastest_lap_driver` | ReferenceColumn → Driver | Fastest Lap Driver | |
| `fastest_lap_team` | ReferenceColumn → Team | Fastest Lap Team | |
| `url` | UrlColumn | URL | |

### Session (`x_1912467_f1now1_session`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_session.now.ts`

No external API id — the ER model marks `session_id` synthetic, so `sys_id` alone identifies the record.

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `race` | ReferenceColumn → Race | Race | Mandatory |
| `session_type` | StringColumn (choice) | Session Type | Mandatory. One of `RACE`, `QUALY`, `FP1`, `FP2`, `FP3`, `SPRINT_QUALY`, `SPRINT_RACE`. Max 20 chars |
| `date` | DateColumn | Date | |
| `time` | StringColumn | Time | Max 20 chars |

### Session Result (`x_1912467_f1now1_session_res`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_session_res.now.ts`

Synthetic PK; unique index on (`session`, `driver`) stands in for the ER's composite key.

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `session` | ReferenceColumn → Session | Session | Mandatory |
| `driver` | ReferenceColumn → Driver | Driver | Mandatory |
| `team` | ReferenceColumn → Team | Team | Mandatory |
| `source_result_id` | StringColumn | Source Result ID | Raw id from source; field name varies by session type. Max 60 chars |
| `position` | IntegerColumn | Position | Null on practice sessions |
| `grid` | IntegerColumn | Grid | Null on practice sessions |
| `points` | DecimalColumn (scale 2) | Points | Null on quali/practice |
| `time` | StringColumn | Time | Max 20 chars |
| `q1` / `q2` / `q3` | StringColumn | Q1 / Q2 / Q3 | Qualifying only. Max 20 chars each |
| `laps` | IntegerColumn | Laps | Race/sprint only |
| `retired` | StringColumn | Retired | Race/sprint only. Max 60 chars |

### Team (`x_1912467_f1now1_team`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_team.now.ts`

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `team_id` | StringColumn | Team ID | API slug. Mandatory, unique. Max 60 chars |
| `name` | StringColumn | Name | Max 100 chars. Display column |
| `nationality` | StringColumn | Nationality | Max 50 chars |
| `first_appearance` | IntegerColumn | First Appearance | Source field has typo variants (`firstAppareance`/`firstAppeareance`) |
| `constructors_championships` | IntegerColumn | Constructors Championships | |
| `drivers_championships` | IntegerColumn | Drivers Championships | |
| `url` | UrlColumn | URL | |

### Driver Standing (`x_1912467_f1now1_driver_stand`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_driver_stand.now.ts`

Synthetic PK; unique index on (`championship`, `driver`).

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `championship` | ReferenceColumn → Championship | Championship | Mandatory |
| `driver` | ReferenceColumn → Driver | Driver | Mandatory |
| `team` | ReferenceColumn → Team | Team | Mandatory |
| `position` | IntegerColumn | Position | |
| `points` | DecimalColumn (scale 2) | Points | |
| `wins` | IntegerColumn | Wins | |

### Constructor Standing (`x_1912467_f1now1_team_standing`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_team_standing.now.ts`

Synthetic PK; unique index on (`championship`, `team`).

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `championship` | ReferenceColumn → Championship | Championship | Mandatory |
| `team` | ReferenceColumn → Team | Team | Mandatory |
| `position` | IntegerColumn | Position | |
| `points` | DecimalColumn (scale 2) | Points | |
| `wins` | IntegerColumn | Wins | |

### Driver Team Season (`x_1912467_f1now1_driver_season`)

Source: `src/fluent/generated/data/table/x_1912467_f1now1_driver_season.now.ts`

Junction table between Driver, Team, and Championship. Synthetic PK; unique index on
(`championship`, `team`, `driver`) stands in for the ER's composite key.

| Column | Type | Label | Notes |
|--------|------|-------|-------|
| `championship` | ReferenceColumn → Championship | Championship | Mandatory |
| `team` | ReferenceColumn → Team | Team | Mandatory |
| `driver` | ReferenceColumn → Driver | Driver | Mandatory |

Data for all tables above is sourced from the F1 API (`f1api.dev`). See
`docs/F1api.dev/openapi.yaml` for available endpoints.

## Roles

Every new table's ACLs reuse these two existing roles (admin: full CRUD, user: read-only) —
no new roles were created.

| Role | Label | Access |
|------|-------|--------|
| `x_1912467_f1now1.admin` | Admin | Create, read, update records |
| `x_1912467_f1now1.user` | User | Read access (default user role) |
