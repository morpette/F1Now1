# Checking Instance vs. Local Source with `now-sdk transform`

A playbook for **Claude Code** working in this repo (`x_1912467_f1now1`). It captures the process
used to answer "are there updates on the instance that aren't in my local source?" by running
`now-sdk transform` and reading the resulting `git diff`.

Read this whenever the task is "check for drift/updates between the instance and local source,"
or `now-sdk transform` is failing and it's unclear why.

## Key facts to load first

- Scope: `x_1912467_f1now1` — scopeId / `sys_scope` = `6f37cd14937d8b14a03577f08bba1032`.
- The app is installed on the instance saved as **`Proton`** (`dev387048.service-now.com`) — **not**
  `IT Attendant Morten` (`dev388568.service-now.com`), which doesn't have this scope at all. Check
  the current default with `now-sdk auth --list` (the default alias is marked `*`).
- Command: `npm run transform` (wraps `now-sdk transform`). There is **no separate transform output
  directory** — see below.

## Step-by-step: what was actually done

1. **Confirm the default auth alias points at the instance the app is installed on.**
   - Symptom of a wrong instance: `now-sdk transform` fails with
     `ERROR: No valid scope found for the given scopeName: <scopeId>`. This reads like a corrupted
     `now.config.json`, but it's actually just "this instance doesn't have that app."
   - Diagnose by querying each saved alias directly:
     ```bash
     now-sdk query sys_app -q "scope=x_1912467_f1now1" -f "sys_id,name,scope,version" --auth "<alias>"
     ```
     The alias that returns 1 record (not 0) is the right one.
   - Fix: `now-sdk auth --use "<correct alias>"`.

2. **Make sure `src/` is clean before transforming**, so the diff afterward is meaningful and not
   mixed with unrelated in-progress edits:
   ```bash
   git status --porcelain src/
   ```

3. **Run the transform:**
   ```bash
   npm run transform
   ```
   Internally this:
   - Downloads the installed package for the scope from the instance.
   - Type-checks the *current local source* against the SDK's type definitions before converting
     anything — a pre-existing invalid property in a tracked `.now.ts` file can abort the whole
     command with a TypeScript error that has nothing to do with instance connectivity.
   - On success, rewrites the affected `.now.ts` / `.js` / `keys.ts` files **directly in place**
     under `src/fluent/...`.

4. **See what changed:**
   ```bash
   git status --porcelain src/
   git diff --stat src/
   git diff src/<specific-file>     # per file, to classify the change
   ```

5. **Classify each diff before committing:**
   - *Runtime/publish metadata* — `masterSnapshot` ids appearing on Actions, new
     `sys_hub_step_ext_input`/`sys_hub_step_ext_output` rows, `sys_ui_form_section` /
     `sys_scope_privilege` records, large `keys.ts` growth. This is normal residue from
     Flow Designer publishing/activating Actions on the instance — expected, safe to accept.
   - *Genuine instance-side edits* — e.g. a role gaining a `federatedId`, a column's `label`
     changing from a plain string to a translated-label array. Worth a second look, but still
     usually fine to accept as the new source of truth.

6. **Stage only the relevant paths and commit** — don't sweep up unrelated pending work:
   ```bash
   git add src/fluent/
   git commit -m "..."
   ```

## Where transform puts its output — there is no separate location

Unlike `now-sdk build` (which writes compiled output to `dist/`), `now-sdk transform` has **no
separate output directory**. It writes straight back into the existing Fluent source tree,
overwriting tracked files in place, organized by artifact type under `src/fluent/generated/` (plus
`src/fluent/actions/` and `src/fluent/tests/` for custom Actions):

| Path | Contents |
|---|---|
| `src/fluent/generated/data/table/` | Table defs (`sys_db_object`) |
| `src/fluent/generated/data/form-section/` | Form sections (`Record()` against `sys_ui_section`) |
| `src/fluent/generated/security/role/` | `Role()` |
| `src/fluent/generated/security/access-control/` | `Acl()` |
| `src/fluent/generated/user-interface/list/` | `List()` column configs |
| `src/fluent/generated/user-interface/form/` | `sys_ui_form_section` records |
| `src/fluent/generated/other/sys-scope-privilege/` | `sys_scope_privilege` records |
| `src/fluent/generated/keys.ts` | Composite key registry — rewritten wholesale, not diffed line-by-line by the tool |
| `src/fluent/actions/` + `src/fluent/actions/scripts/` | Custom Action definitions and their inline scripts |
| `src/fluent/tests/scripts/` | Associated generated test scripts |

If the instance has artifact types not yet represented locally (e.g. this run introduced
`user-interface/form/` and `other/sys-scope-privilege/` as new, previously-absent subdirectories),
transform creates the matching subdirectory under `generated/` automatically — nothing needs to be
scaffolded by hand first.

## Gotchas

- ⚠️ A confusing **"invalid scopeId" / "No valid scope found" error is usually the wrong default
  auth alias**, not a broken `now.config.json`. Check `now-sdk auth --list` first.
- ⚠️ **A single invalid property in a tracked `.now.ts` file** (one the SDK's type definitions no
  longer recognize — e.g. `sys_domain_path` where only `sys_domain` exists on
  `Data<"sys_ui_section">`) **aborts the entire transform** with a TS diagnostic before it even
  gets to comparing instance data. Fix the type error in source, don't assume the instance is
  unreachable.
- ⚠️ `keys.ts` diffs can run into the thousands of lines purely from Flow Designer publish
  snapshots (`sys_hub_step_ext_input/output`, `sys_documentation`, `sys_ui_form_section`
  fragments). Don't be alarmed by the line count — read `git diff` to see which tables the new
  entries belong to.
- ⚠️ Formatting-only churn (trailing commas, property re-ordering) rides along with real changes
  in the same file — check the diff content, not just whether a file shows as modified.

## Quick reference: order of operations

1. `now-sdk auth --list` → confirm the default alias matches the instance the app is installed on.
2. `git status --porcelain src/` → confirm clean before transforming.
3. `npm run transform` (== `now-sdk transform`).
4. `git status --porcelain src/` + `git diff --stat src/` → see what changed.
5. `git diff src/<file>` per file → classify (publish noise vs. real edit).
6. `git add src/fluent/` (only the relevant paths) → `git commit`.
