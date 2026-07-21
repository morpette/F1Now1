import { DateColumn, IntegerColumn, StringColumn, Table, UrlColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_driver = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    label: 'Driver',
    name: 'x_1912467_f1now1_driver',
    schema: {
        name: StringColumn({
            label: [
                {
                    label: 'Name',
                },
            ],
            maxLength: 40,
        }),
        surname: StringColumn({ label: 'Surname', maxLength: 40 }),
        driver_id: StringColumn({ label: 'Driver ID', maxLength: 60 }),
        abbreviation: StringColumn({ label: 'Abbreviation', maxLength: 3 }),
        number: IntegerColumn({ label: 'Number' }),
        nationality: StringColumn({ label: 'Nationality', maxLength: 50 }),
        date_of_birth: DateColumn({ label: 'Date of Birth' }),
        url: UrlColumn({ label: 'URL' }),
    },
})
