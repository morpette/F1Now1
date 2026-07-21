import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f1now1-session-acl-read-user'],
    description: 'Allow read for records in x_1912467_f1now1_session, for users with role x_1912467_f1now1.user.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1912467_f1now1.user'],
    table: 'x_1912467_f1now1_session',
})
