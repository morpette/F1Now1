import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_session_res',
    view: default_view,
    columns: ['session', 'position', 'driver', 'team', 'grid', 'points', 'time', 'retired'],
})
