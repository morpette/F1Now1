import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_circuit',
    view: default_view,
    columns: ['name', 'country', 'city', 'circuit_length', 'number_of_corners', 'lap_record'],
})
