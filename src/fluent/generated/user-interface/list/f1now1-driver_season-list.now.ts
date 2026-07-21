import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_driver_season',
    view: default_view,
    columns: ['championship', 'driver', 'team'],
})
