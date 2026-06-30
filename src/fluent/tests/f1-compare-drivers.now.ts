import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF test for the "F1: Compare Two Drivers" action. Invokes the action via the
 * scriptable Flow runner and validates a 200 valid-JSON response.
 *
 * Set active:false because the upstream f1api.dev /compare endpoint currently
 * returns HTTP 500 ("Server error") for every input. Re-enable once the endpoint
 * is fixed (and tighten the script's assertion with a response-key check).
 */
export const f1TestCompareDrivers = Test(
    {
        $id: Now.ID['f1-test-compare-drivers'],
        name: 'F1 Action: Compare Two Drivers',
        description: 'Invokes the F1: Compare Two Drivers action via FlowAPI and asserts a 200 JSON response. Inactive while upstream /compare returns HTTP 500.',
        active: false,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-compare-drivers'],
            script: Now.include('./scripts/f1-compare-drivers.test.js'),
        })
    },
)
