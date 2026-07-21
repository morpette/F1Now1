import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_driver',
    view: default_view,
    columns: ['driver_id', 'name', 'number', 'sys_updated_on', 'sys_updated_by', 'sys_mod_count'],
})
