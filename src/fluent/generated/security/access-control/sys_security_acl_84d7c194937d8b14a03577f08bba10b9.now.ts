import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['84d7c194937d8b14a03577f08bba10b9'],
    description: 'Allow read for records in x_1912467_f1now1_driver, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_driver',
})
