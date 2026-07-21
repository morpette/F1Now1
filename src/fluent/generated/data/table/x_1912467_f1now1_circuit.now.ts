import { Table, StringColumn, IntegerColumn, ReferenceColumn, UrlColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_circuit = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    display: 'name',
    label: 'Circuit',
    name: 'x_1912467_f1now1_circuit',
    schema: {
        circuit_id: StringColumn({ label: 'Circuit ID', maxLength: 60, mandatory: true, unique: true }),
        name: StringColumn({ label: 'Name', maxLength: 100 }),
        country: StringColumn({ label: 'Country', maxLength: 60 }),
        city: StringColumn({ label: 'City', maxLength: 60 }),
        circuit_length: StringColumn({ label: 'Circuit Length', maxLength: 40 }),
        number_of_corners: IntegerColumn({ label: 'Number of Corners' }),
        lap_record: StringColumn({ label: 'Lap Record', maxLength: 40 }),
        first_participation_year: IntegerColumn({ label: 'First Participation Year', attributes: { format: 'none' } }),
        fastest_lap_driver: ReferenceColumn({ label: 'Fastest Lap Driver', referenceTable: 'x_1912467_f1now1_driver' }),
        fastest_lap_team: ReferenceColumn({ label: 'Fastest Lap Team', referenceTable: 'x_1912467_f1now1_team' }),
        fastest_lap_year: IntegerColumn({ label: 'Fastest Lap Year', attributes: { format: 'none' } }),
        url: UrlColumn({ label: 'URL' }),
    },
})
