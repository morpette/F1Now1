import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * F1 API Driver Endpoints — outbound REST message for f1api.dev (https://f1api.dev).
 *
 * Dedicated to the driver-related endpoints in the OpenAPI spec
 * (docs/F1api.dev/openapi.yaml, tag: drivers) — one function per endpoint.
 * Other endpoint groups (races, standings, etc.) get their own RestMessage.
 * Each function is the declarative "REST building block" invoked from the thin
 * F1 driver Actions via sn_ws.RESTMessageV2('F1 API Driver Endpoints', '<functionName>').
 *
 * Path identifiers are ${var} substitutions in the endpoint; pagination
 * (limit/offset) and the search term (q) are declared as query params.
 * Public, unauthenticated API — no auth profile required.
 */
RestMessage({
    $id: Now.ID['f1-api-msg'],
    name: 'F1 API Driver Endpoints',
    endpoint: 'https://f1api.dev',
    description: 'Outbound REST integration with the public f1api.dev Formula 1 API — driver endpoints.',
    authenticationType: 'noAuthentication',
    headers: [{ $id: Now.ID['f1-api-header-accept'], name: 'Accept', value: 'application/json' }],
    functions: [
        // GET /api/drivers — all drivers who raced at least one F1 race
        {
            name: 'getAllDrivers',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/drivers',
            variables: [
                { $id: Now.ID['f1-fn-all-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-all-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-all-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-all-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/drivers/{driverId} — a driver by id
        {
            name: 'getDriverById',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/drivers/${driverId}',
            variables: [{ $id: Now.ID['f1-fn-byid-var-driverid'], name: 'driverId' }],
        },
        // GET /api/drivers/search — search drivers by name/surname
        {
            name: 'searchDrivers',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/drivers/search',
            variables: [
                { $id: Now.ID['f1-fn-search-var-q'], name: 'q' },
                { $id: Now.ID['f1-fn-search-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-search-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-search-qp-q'], name: 'q', value: '${q}', order: 1 },
                { $id: Now.ID['f1-fn-search-qp-limit'], name: 'limit', value: '${limit}', order: 2 },
                { $id: Now.ID['f1-fn-search-qp-offset'], name: 'offset', value: '${offset}', order: 3 },
            ],
        },
        // GET /api/{year}/drivers — drivers of a season
        {
            name: 'getDriversBySeason',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/${year}/drivers',
            variables: [
                { $id: Now.ID['f1-fn-season-var-year'], name: 'year' },
                { $id: Now.ID['f1-fn-season-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-season-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-season-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-season-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/{year}/drivers/{driverId} — a driver's results in a season
        {
            name: 'getDriverSeasonResults',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/${year}/drivers/${driverId}',
            variables: [
                { $id: Now.ID['f1-fn-seasonres-var-year'], name: 'year' },
                { $id: Now.ID['f1-fn-seasonres-var-driverid'], name: 'driverId' },
                { $id: Now.ID['f1-fn-seasonres-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-seasonres-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-seasonres-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-seasonres-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/current/drivers — drivers of the current season
        {
            name: 'getCurrentDrivers',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/current/drivers',
            variables: [
                { $id: Now.ID['f1-fn-curr-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-curr-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-curr-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-curr-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/current/drivers/{driverId} — a driver's results in the current season
        {
            name: 'getCurrentDriverResults',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/current/drivers/${driverId}',
            variables: [
                { $id: Now.ID['f1-fn-currres-var-driverid'], name: 'driverId' },
                { $id: Now.ID['f1-fn-currres-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-currres-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-currres-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-currres-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/{year}/teams/{teamId}/drivers — drivers of a team in a season
        {
            name: 'getTeamDriversBySeason',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/${year}/teams/${teamId}/drivers',
            variables: [
                { $id: Now.ID['f1-fn-teamseason-var-year'], name: 'year' },
                { $id: Now.ID['f1-fn-teamseason-var-teamid'], name: 'teamId' },
                { $id: Now.ID['f1-fn-teamseason-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-teamseason-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-teamseason-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-teamseason-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/current/teams/{teamId}/drivers — drivers of a team in the current season
        {
            name: 'getCurrentTeamDrivers',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/current/teams/${teamId}/drivers',
            variables: [
                { $id: Now.ID['f1-fn-currteam-var-teamid'], name: 'teamId' },
                { $id: Now.ID['f1-fn-currteam-var-limit'], name: 'limit' },
                { $id: Now.ID['f1-fn-currteam-var-offset'], name: 'offset' },
            ],
            queryParams: [
                { $id: Now.ID['f1-fn-currteam-qp-limit'], name: 'limit', value: '${limit}', order: 1 },
                { $id: Now.ID['f1-fn-currteam-qp-offset'], name: 'offset', value: '${offset}', order: 2 },
            ],
        },
        // GET /api/{year}/compare/{driverId1}/{driverId2} — head-to-head comparison
        {
            name: 'compareDrivers',
            httpMethod: 'GET',
            endpoint: 'https://f1api.dev/api/${year}/compare/${driverId1}/${driverId2}',
            variables: [
                { $id: Now.ID['f1-fn-compare-var-year'], name: 'year' },
                { $id: Now.ID['f1-fn-compare-var-driverid1'], name: 'driverId1' },
                { $id: Now.ID['f1-fn-compare-var-driverid2'], name: 'driverId2' },
            ],
        },
    ],
})
