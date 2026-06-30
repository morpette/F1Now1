import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * ATF negative-path test for the "F1: Get Driver by ID" action. Invokes the
 * action with an unknown driver id and asserts the action surfaces the upstream
 * HTTP 404 gracefully (non-200 status, no thrown exception / empty error_message).
 */
export const f1TestGetDriverByIdNotFound = Test(
    {
        $id: Now.ID['f1-test-get-driver-by-id-not-found'],
        name: 'F1 Action: Get Driver by ID — Not Found',
        description: 'Invokes the F1: Get Driver by ID action with a bogus id and asserts graceful handling of the upstream 404.',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['f1-teststep-get-driver-by-id-not-found'],
            script: Now.include('./scripts/f1-get-driver-by-id-not-found.test.js'),
        })
    },
)
