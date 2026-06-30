import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get Current Season Team Drivers" action. Invokes the
 * action via the scriptable Flow runner and validates a 200 JSON response with a
 * top-level "drivers" element.
 */
export const f1TestGetCurrentTeamDrivers = Test(
    {
        $id: Now.ID['f1-test-get-current-team-drivers'],
        name: 'F1 Action: Get Current Season Team Drivers',
        description: 'Invokes the F1: Get Current Season Team Drivers action via FlowAPI and asserts a 200 JSON response with a "drivers" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-current-team-drivers'],
            script: Now.include('./scripts/f1-get-current-team-drivers.test.js'),
        })
    },
)
