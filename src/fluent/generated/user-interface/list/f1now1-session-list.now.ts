import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_session',
    view: default_view,
    columns: ['race', 'session_type', 'date', 'time'],
})
