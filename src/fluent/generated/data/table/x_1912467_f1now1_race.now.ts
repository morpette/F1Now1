import { Table, StringColumn, ReferenceColumn, IntegerColumn, UrlColumn } from '@servicenow/sdk/core'

export const x_1912467_f1now1_race = Table({
    actions: ['read', 'update', 'create'],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
    allowWebServiceAccess: true,
    attributes: {
        enforce_dot_walk_cross_scope_access: true,
    },
    display: 'name',
    label: 'Race',
    name: 'x_1912467_f1now1_race',
    schema: {
        race_id: StringColumn({ label: 'Race ID', maxLength: 60, mandatory: true, unique: true }),
        championship: ReferenceColumn({ label: 'Championship', referenceTable: 'x_1912467_f1now1_championship', mandatory: true }),
        circuit: ReferenceColumn({ label: 'Circuit', referenceTable: 'x_1912467_f1now1_circuit', mandatory: true }),
        round: IntegerColumn({ label: 'Round' }),
        name: StringColumn({ label: 'Name', maxLength: 100 }),
        laps: IntegerColumn({ label: 'Laps' }),
        fastest_lap_time: StringColumn({ label: 'Fastest Lap Time', maxLength: 20 }),
        fastest_lap_driver: ReferenceColumn({ label: 'Fastest Lap Driver', referenceTable: 'x_1912467_f1now1_driver' }),
        fastest_lap_team: ReferenceColumn({ label: 'Fastest Lap Team', referenceTable: 'x_1912467_f1now1_team' }),
        url: UrlColumn({ label: 'URL' }),
    },
})
