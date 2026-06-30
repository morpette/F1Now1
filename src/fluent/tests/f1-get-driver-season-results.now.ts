import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get Driver Season Results" action. Invokes the action
 * via the scriptable Flow runner and validates a 200 JSON response with a
 * top-level "driver" element.
 */
export const f1TestGetDriverSeasonResults = Test(
    {
        $id: Now.ID['f1-test-get-driver-season-results'],
        name: 'F1 Action: Get Driver Season Results',
        description: 'Invokes the F1: Get Driver Season Results action via FlowAPI and asserts a 200 JSON response with a "driver" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-driver-season-results'],
            script: Now.include('./scripts/f1-get-driver-season-results.test.js'),
        })
    },
)
