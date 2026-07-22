import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * F1 API Standings Endpoints — outbound REST message for f1api.dev (https://f1api.dev).
 *
 * Dedicated to the standings endpoints in the OpenAPI spec
 * (docs/F1api.dev/openapi.yaml, tag: standings) — one function per endpoint.
 * Each function is the declarative "REST building block" invoked from the thin
 * F1 standings Actions via
 * sn_ws.RESTMessageV2('F1 API Standings Endpoints', '<functionName>').
 *
 * Pagination (limit/offset) is declared as query params. Public,
 * unauthenticated API — no auth profile required.
 */
RestMessage({
    $id: Now.ID['f1-api-standings-msg'],
    name: 'F1 API Standings Endpoints',
    endpoint: 'https://f1api.dev',
    description: 'Outbound REST integration with the public f1api.dev Formula 1 API — driver/constructor standings endpoints.',
    authenticationType: 'noAuthentication',
    headers: [{ $id: Now.ID['f1-api-standings-header-accept'], name: 'Accept', value: 'application/json' }],
    functions: [
        // GET /api/{year}/drivers-championship — driver standings for a season
        {
            name: 'getDriverStandingsBySeason',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/${year}/drivers-championship',
            variables: [
                { $id: Now.ID['f1-fn-driver-standings-var-year'], name: 'year' },
                { $id: Now.ID['f1-fn-driver-standings-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-driver-standings-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-driver-standings-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-driver-standings-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/{year}/constructors-championship — constructor standings for a season
        // (404 for years before 1958, the first constructors' championship)
        {
            name: 'getConstructorStandingsBySeason',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/${year}/constructors-championship',
            variables: [
                { $id: Now.ID['f1-fn-constructor-standings-var-year'], name: 'year' },
                { $id: Now.ID['f1-fn-constructor-standings-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-constructor-standings-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-constructor-standings-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-constructor-standings-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
    ],
})
