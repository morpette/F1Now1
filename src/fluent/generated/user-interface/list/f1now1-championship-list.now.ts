import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_championship',
    view: default_view,
    columns: ['name', 'year', 'championship_id', 'url'],
})
