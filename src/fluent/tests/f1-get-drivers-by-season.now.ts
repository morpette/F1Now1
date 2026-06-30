import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get Drivers by Season" action. Invokes the action via
 * the scriptable Flow runner and validates a 200 JSON response with a top-level
 * "drivers" element.
 */
export const f1TestGetDriversBySeason = Test(
    {
        $id: Now.ID['f1-test-get-drivers-by-season'],
        name: 'F1 Action: Get Drivers by Season',
        description: 'Invokes the F1: Get Drivers by Season action via FlowAPI and asserts a 200 JSON response with a "drivers" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-drivers-by-season'],
            script: Now.include('./scripts/f1-get-drivers-by-season.test.js'),
        })
    },
)
