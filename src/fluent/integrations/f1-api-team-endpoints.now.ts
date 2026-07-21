import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * F1 API Team Endpoints — outbound REST message for f1api.dev (https://f1api.dev).
 *
 * Dedicated to the team-related endpoints in the OpenAPI spec
 * (docs/F1api.dev/openapi.yaml, tag: teams) — one function per endpoint.
 * Team-driver relationship endpoints (getTeamDriversBySeason, getCurrentTeamDrivers)
 * already live on 'F1 API Driver Endpoints' since they return driver data.
 * Each function is the declarative "REST building block" invoked from the thin
 * F1 team Actions via sn_ws.RESTMessageV2('F1 API Team Endpoints', '<functionName>').
 *
 * Pagination (limit/offset) is declared as query params. Public,
 * unauthenticated API — no auth profile required.
 */
RestMessage({
    $id: Now.ID['f1-api-team-msg'],
    name: 'F1 API Team Endpoints',
    endpoint: 'https://f1api.dev',
    description: 'Outbound REST integration with the public f1api.dev Formula 1 API — team endpoints.',
    authenticationType: 'noAuthentication',
    headers: [{ $id: Now.ID['f1-api-team-header-accept'], name: 'Accept', value: 'application/json' }],
    functions: [
        // GET /api/teams — all teams that have participated in F1 races
        {
            name: 'getAllTeams',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/teams',
            variables: [
                { $id: Now.ID['f1-fn-teams-all-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-teams-all-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-teams-all-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-teams-all-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
    ],
})
