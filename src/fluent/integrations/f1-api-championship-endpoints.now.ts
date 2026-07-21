import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * F1 API Championship Endpoints — outbound REST message for f1api.dev (https://f1api.dev).
 *
 * Dedicated to the season/championship-related endpoints in the OpenAPI spec
 * (docs/F1api.dev/openapi.yaml, tag: seasons) — one function per endpoint.
 * Each function is the declarative "REST building block" invoked from the thin
 * F1 championship Actions via
 * sn_ws.RESTMessageV2('F1 API Championship Endpoints', '<functionName>').
 *
 * Pagination (limit/offset) is declared as query params. Public,
 * unauthenticated API — no auth profile required.
 */
RestMessage({
    $id: Now.ID['f1-api-championship-msg'],
    name: 'F1 API Championship Endpoints',
    endpoint: 'https://f1api.dev',
    description: 'Outbound REST integration with the public f1api.dev Formula 1 API — championship/season endpoints.',
    authenticationType: 'noAuthentication',
    headers: [{ $id: Now.ID['f1-api-championship-header-accept'], name: 'Accept', value: 'application/json' }],
    functions: [
        // GET /api/seasons — all F1 seasons/championships since 1950
        {
            name: 'getAllChampionships',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/seasons',
            variables: [
                { $id: Now.ID['f1-fn-championships-all-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-championships-all-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-championships-all-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-championships-all-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
    ],
})
