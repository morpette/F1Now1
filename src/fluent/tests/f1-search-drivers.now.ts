import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Search Drivers" action. Invokes the action via the
 * scriptable Flow runner and validates a 200 JSON response with a top-level
 * "drivers" element.
 */
export const f1TestSearchDrivers = Test(
    {
        $id: Now.ID['f1-test-search-drivers'],
        name: 'F1 Action: Search Drivers',
        description: 'Invokes the F1: Search Drivers action via FlowAPI and asserts a 200 JSON response with a "drivers" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-search-drivers'],
            script: Now.include('./scripts/f1-search-drivers.test.js'),
        })
    },
)
