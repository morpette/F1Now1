import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get Driver by ID" action. Invokes the action via the
 * scriptable Flow runner and validates a 200 JSON response with a top-level
 * "driver" element.
 */
export const f1TestGetDriverById = Test(
    {
        $id: Now.ID['f1-test-get-driver-by-id'],
        name: 'F1 Action: Get Driver by ID',
        description: 'Invokes the F1: Get Driver by ID action via FlowAPI and asserts a 200 JSON response with a "driver" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-driver-by-id'],
            script: Now.include('./scripts/f1-get-driver-by-id.test.js'),
        })
    },
)
