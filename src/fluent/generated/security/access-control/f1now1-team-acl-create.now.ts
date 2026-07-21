import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f1now1-team-acl-create'],
    description: 'Allow create for records in x_1912467_f1now1_team, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_team',
})
