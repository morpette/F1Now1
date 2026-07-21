import { Table, ReferenceColumn, StringColumn, DateColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_session = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    label: 'Session',
    name: 'x_1912467_f1now1_session',
    schema: {
        race: ReferenceColumn({ label: 'Race', referenceTable: 'x_1912467_f1now1_race', mandatory: true }),
        session_type: StringColumn({ label: 'Session Type', maxLength: 20, mandatory: true, choices: { RACE: 'Race', QUALY: 'Qualifying', FP1: 'Practice 1', FP2: 'Practice 2', FP3: 'Practice 3', SPRINT_QUALY: 'Sprint Qualifying', SPRINT_RACE: 'Sprint Race' } }),
        date: DateColumn({ label: 'Date' }),
        time: StringColumn({ label: 'Time', maxLength: 20 }),
    },
})
