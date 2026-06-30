import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get Current Season Driver Results" action. Invokes the
 * action via the scriptable Flow runner and validates a 200 JSON response with a
 * top-level "driver" element.
 */
export const f1TestGetCurrentDriverResults = Test(
    {
        $id: Now.ID['f1-test-get-current-driver-results'],
        name: 'F1 Action: Get Current Season Driver Results',
        description: 'Invokes the F1: Get Current Season Driver Results action via FlowAPI and asserts a 200 JSON response with a "driver" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-current-driver-results'],
            script: Now.include('./scripts/f1-get-current-driver-results.test.js'),
        })
    },
)
