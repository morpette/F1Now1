import { Table, StringColumn, IntegerColumn, UrlColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_championship = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    display: 'name',
    label: 'Championship',
    name: 'x_1912467_f1now1_championship',
    schema: {
        championship_id: StringColumn({ label: 'Championship ID', maxLength: 60, mandatory: true, unique: true }),
        year: IntegerColumn({ label: 'Year' }),
        name: StringColumn({ label: 'Name', maxLength: 100 }),
        url: UrlColumn({ label: 'URL' }),
    },
})
