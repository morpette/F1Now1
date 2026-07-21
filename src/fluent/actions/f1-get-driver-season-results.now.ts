import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get Driver Season Results — GET /api/{year}/drivers/{driverId}
 *
 * Invokes the 'F1 API' REST Message function `getDriverSeasonResults` via a
 * thin script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1GetDriverSeasonResults = Action(
    {
        $id: Now.ID['f1-action-get-driver-season-results'],
        name: 'F1: Get Driver Season Results',
        internalName: 'f1_get_driver_season_results',
        description: "Fetch a driver's results for a given season from f1api.dev (GET /api/{year}/drivers/{driverId}).",
        category: 'f1_data',
        inputs: {
            year: IntegerColumn({ label: 'Season Year', mandatory: true, hint: 'e.g. 2024' }),
            driver_id: StringColumn({ label: 'Driver ID', mandatory: true, hint: 'e.g. max_verstappen' }),
            limit: IntegerColumn({ label: 'Limit', hint: 'Records to return (1-100).', default: 30 }),
            offset: IntegerColumn({ label: 'Offset', hint: 'Records to skip.', default: 0 }),
        },
        outputs: {
            response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
            status_code: IntegerColumn({ label: 'Status Code' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
        masterSnapshot: '7b535f78937dcf14a03577f08bba1096',
    },
    (params) => {
        const invoke_f1_api_getdriverseasonresults = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-get-driver-season-results'], label: 'Invoke F1 API getDriverSeasonResults' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-driver-season-results.js'),
                inputVariables: {
                    year: { label: 'Season Year', value: wfa.dataPill(params.inputs.year, 'integer') },
                    driver_id: { label: 'Driver ID', value: wfa.dataPill(params.inputs.driver_id, 'string') },
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
            response_body: wfa.dataPill(invoke_f1_api_getdriverseasonresults.response_body, 'string'),
            status_code: wfa.dataPill(invoke_f1_api_getdriverseasonresults.status_code, 'integer'),
            error_message: wfa.dataPill(invoke_f1_api_getdriverseasonresults.error_message, 'string'),
        })
    }
)
