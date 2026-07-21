import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * F1 API Circuit Endpoints — outbound REST message for f1api.dev (https://f1api.dev).
 *
 * Dedicated to the circuit-related endpoints in the OpenAPI spec
 * (docs/F1api.dev/openapi.yaml, tag: circuits) — one function per endpoint.
 * Each function is the declarative "REST building block" invoked from the thin
 * F1 circuit Actions via sn_ws.RESTMessageV2('F1 API Circuit Endpoints', '<functionName>').
 *
 * Pagination (limit/offset) is declared as query params. Public,
 * unauthenticated API — no auth profile required.
 */
RestMessage({
    $id: Now.ID['f1-api-circuit-msg'],
    name: 'F1 API Circuit Endpoints',
    endpoint: 'https://f1api.dev',
    description: 'Outbound REST integration with the public f1api.dev Formula 1 API — circuit endpoints.',
    authenticationType: 'noAuthentication',
    headers: [{ $id: Now.ID['f1-api-circuit-header-accept'], name: 'Accept', value: 'application/json' }],
    functions: [
        // GET /api/circuits — all F1 circuits
        {
            name: 'getAllCircuits',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/circuits',
            variables: [
                { $id: Now.ID['f1-fn-circuits-all-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-circuits-all-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-circuits-all-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-circuits-all-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
    ],
})
