import { Table, ReferenceColumn, StringColumn, IntegerColumn, DecimalColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_session_res = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    index: [{ unique: true, element: ['session', 'driver'] }],
    label: 'Session Result',
    name: 'x_1912467_f1now1_session_res',
    schema: {
        session: ReferenceColumn({ label: 'Session', referenceTable: 'x_1912467_f1now1_session', mandatory: true }),
        driver: ReferenceColumn({ label: 'Driver', referenceTable: 'x_1912467_f1now1_driver', mandatory: true }),
        team: ReferenceColumn({ label: 'Team', referenceTable: 'x_1912467_f1now1_team', mandatory: true }),
        source_result_id: StringColumn({ label: 'Source Result ID', maxLength: 60 }),
        position: IntegerColumn({ label: 'Position' }),
        grid: IntegerColumn({ label: 'Grid' }),
        points: DecimalColumn({ label: 'Points', scale: 2 }),
        time: StringColumn({ label: 'Time', maxLength: 20 }),
        q1: StringColumn({ label: 'Q1', maxLength: 20 }),
        q2: StringColumn({ label: 'Q2', maxLength: 20 }),
        q3: StringColumn({ label: 'Q3', maxLength: 20 }),
        laps: IntegerColumn({ label: 'Laps' }),
        retired: StringColumn({ label: 'Retired', maxLength: 60 }),
    },
})
