import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f1now1-driver_season-acl-read-admin'],
    description: 'Allow read for records in x_1912467_f1now1_driver_season, for users with role x_1912467_f1now1.admin.',
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: ['x_1912467_f1now1.admin'],
    table: 'x_1912467_f1now1_driver_season',
})
