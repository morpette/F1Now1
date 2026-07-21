import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_team',
    view: default_view,
    columns: ['name', 'nationality', 'first_appearance', 'constructors_championships', 'drivers_championships'],
})
