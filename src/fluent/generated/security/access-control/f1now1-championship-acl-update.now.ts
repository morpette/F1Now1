import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f1now1-championship-acl-update'],
    description: 'Allow update for records in x_1912467_f1now1_championship, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'update',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_championship',
})
