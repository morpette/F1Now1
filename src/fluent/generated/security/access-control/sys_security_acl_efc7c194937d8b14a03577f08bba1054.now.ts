import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['efc7c194937d8b14a03577f08bba1054'],
    description: 'Allow read for records in x_1912467_f1now1_driver, for users with role x_1912467_f1now1.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1912467_f1now1.user'],
    table: 'x_1912467_f1now1_driver',
})
