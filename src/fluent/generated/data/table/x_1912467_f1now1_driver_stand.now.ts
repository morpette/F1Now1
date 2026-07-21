import { Table, ReferenceColumn, IntegerColumn, DecimalColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_driver_stand = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    index: [{ unique: true, element: ['championship', 'driver'] }],
    label: 'Driver Standing',
    name: 'x_1912467_f1now1_driver_stand',
    schema: {
        championship: ReferenceColumn({ label: 'Championship', referenceTable: 'x_1912467_f1now1_championship', mandatory: true }),
        driver: ReferenceColumn({ label: 'Driver', referenceTable: 'x_1912467_f1now1_driver', mandatory: true }),
        team: ReferenceColumn({ label: 'Team', referenceTable: 'x_1912467_f1now1_team', mandatory: true }),
        position: IntegerColumn({ label: 'Position' }),
        points: DecimalColumn({ label: 'Points', scale: 2 }),
        wins: IntegerColumn({ label: 'Wins' }),
    },
})
