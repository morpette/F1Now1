import { Table, ReferenceColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_driver_season = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    index: [{ unique: true, element: ['championship', 'team', 'driver'] }],
    label: 'Driver Team Season',
    name: 'x_1912467_f1now1_driver_season',
    schema: {
        championship: ReferenceColumn({ label: 'Championship', referenceTable: 'x_1912467_f1now1_championship', mandatory: true }),
        team: ReferenceColumn({ label: 'Team', referenceTable: 'x_1912467_f1now1_team', mandatory: true }),
        driver: ReferenceColumn({ label: 'Driver', referenceTable: 'x_1912467_f1now1_driver', mandatory: true }),
    },
})
