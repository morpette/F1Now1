import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get Constructor Standings by Season — GET /api/{year}/constructors-championship
 *
 * Invokes the 'F1 API Standings Endpoints' REST Message function
 * `getConstructorStandingsBySeason` via a thin script step and returns the
 * raw JSON body, HTTP status code, and error. Returns HTTP 404 for years
 * before 1958 (the first constructors' championship) — not an error, just
 * no data for that year.
 */
export const f1GetConstructorStandingsBySeason = Action(
    {
        $id: Now.ID['f1-action-get-constructor-standings-by-season'],
        name: 'F1: Get Constructor Standings by Season',
        internalName: 'f1_get_constructor_standings_by_season',
        description: 'Fetch the constructor championship standings for a given season from f1api.dev (GET /api/{year}/constructors-championship). Returns 404 for years before 1958.',
        category: 'f1_data',
        inputs: {
            year: IntegerColumn({ label: 'Season Year', mandatory: true, hint: 'e.g. 2024' }),
            limit: IntegerColumn({ label: 'Limit', hint: 'Records to return (1-100).', default: 30 }),
            offset: IntegerColumn({ label: 'Offset', hint: 'Records to skip.', default: 0 }),
        },
        outputs: {
            response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
            status_code: IntegerColumn({ label: 'Status Code' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const invoke_f1_api_getconstructorstandingsbyseason = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-get-constructor-standings-by-season'], label: 'Invoke F1 API getConstructorStandingsBySeason' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-constructor-standings-by-season.js'),
                inputVariables: {
                    year: { label: 'Season Year', value: wfa.dataPill(params.inputs.year, 'integer') },
                    limit: { label: 'Limit', value: wfa.dataPill(params.inputs.limit, 'integer') },
                    offset: { label: 'Offset', value: wfa.dataPill(params.inputs.offset, 'integer') },
                },
                outputVariables: {
                    response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
                    status_code: IntegerColumn({ label: 'Status Code' }),
                    error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
                },
                errorHandlingType: 'dont_stop_the_action',
            }
        )

        wfa.assignActionOutputs(params.outputs, {
            response_body: wfa.dataPill(invoke_f1_api_getconstructorstandingsbyseason.response_body, 'string'),
            status_code: wfa.dataPill(invoke_f1_api_getconstructorstandingsbyseason.status_code, 'integer'),
            error_message: wfa.dataPill(invoke_f1_api_getconstructorstandingsbyseason.error_message, 'string'),
        })
    }
)
