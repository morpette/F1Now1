import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get All Drivers" action. Invokes the action via the
 * scriptable Flow runner (sn_fd.FlowAPI) and validates a 200 JSON response with
 * a top-level "drivers" element. Tests the action's perspective, not the
 * underlying REST Message function directly.
 */
export const f1TestGetAllDrivers = Test(
    {
        $id: Now.ID['f1-test-get-all-drivers'],
        name: 'F1 Action: Get All Drivers',
        description: 'Invokes the F1: Get All Drivers action via FlowAPI and asserts a 200 JSON response with a "drivers" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-all-drivers'],
            script: Now.include('./scripts/f1-get-all-drivers.test.js'),
        })
    },
)
