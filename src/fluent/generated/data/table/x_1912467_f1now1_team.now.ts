import { Table, StringColumn, IntegerColumn, UrlColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_team = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    display: 'name',
    label: 'Team',
    name: 'x_1912467_f1now1_team',
    schema: {
        team_id: StringColumn({ label: 'Team ID', maxLength: 60, mandatory: true, unique: true }),
        name: StringColumn({ label: 'Name', maxLength: 100 }),
        nationality: StringColumn({ label: 'Nationality', maxLength: 50 }),
        first_appearance: IntegerColumn({ label: 'First Appearance', attributes: { format: 'none' } }),
        constructors_championships: IntegerColumn({ label: 'Constructors Championships' }),
        drivers_championships: IntegerColumn({ label: 'Drivers Championships' }),
        url: UrlColumn({ label: 'URL' }),
    },
})
