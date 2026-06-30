import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2fc7c194937d8b14a03577f08bba1003'],
    description: 'Allow create for records in x_1912467_f1now1_driver, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_driver',
})
