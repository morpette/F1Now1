import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Get Team Drivers by Season" action. Invokes the action
 * via the scriptable Flow runner and validates a 200 JSON response with a
 * top-level "drivers" element.
 */
export const f1TestGetTeamDriversBySeason = Test(
    {
        $id: Now.ID['f1-test-get-team-drivers-by-season'],
        name: 'F1 Action: Get Team Drivers by Season',
        description: 'Invokes the F1: Get Team Drivers by Season action via FlowAPI and asserts a 200 JSON response with a "drivers" element.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-team-drivers-by-season'],
            script: Now.include('./scripts/f1-get-team-drivers-by-season.test.js'),
        })
    },
)
