import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_team_standing',
    view: default_view,
    columns: ['sys_created_on', 'sys_created_by', 'sys_updated_on', 'sys_updated_by', 'sys_mod_count'],
})
