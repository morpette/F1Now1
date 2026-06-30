import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['58d70594937d8b14a03577f08bba101b'],
    description: 'Allow delete for records in x_1912467_f1now1_driver, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_driver',
})
