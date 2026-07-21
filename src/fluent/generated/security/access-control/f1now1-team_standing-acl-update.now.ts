import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f1now1-team_standing-acl-update'],
    description: 'Allow update for records in x_1912467_f1now1_team_standing, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'update',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_team_standing',
})
