import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get Current Season Driver Results — GET /api/current/drivers/{driverId}
 *
 * Invokes the 'F1 API' REST Message function `getCurrentDriverResults` via a
 * thin script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1GetCurrentDriverResults = Action(
    {
        $id: Now.ID['f1-action-get-current-driver-results'],
        name: 'F1: Get Current Season Driver Results',
        internalName: 'f1_get_current_driver_results',
        description:
            "Fetch a driver's results for the current season from f1api.dev (GET /api/current/drivers/{driverId}).",
        category: 'f1_data',
        inputs: {
            driver_id: StringColumn({ label: 'Driver ID', mandatory: true, hint: 'e.g. max_verstappen' }),
            limit: IntegerColumn({ label: 'Limit', hint: 'Records to return (1-100).', default: 30, min: 1, max: 100 }),
            offset: IntegerColumn({ label: 'Offset', hint: 'Records to skip.', default: 0, min: 0, max: 10000 }),
        },
        outputs: {
            response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
            status_code: IntegerColumn({ label: 'Status Code' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const call = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-get-current-driver-results'], label: 'Invoke F1 API getCurrentDriverResults' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-current-driver-results.js'),
                inputVariables: {
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
            },
        )

        wfa.assignActionOutputs(params.outputs, {
            response_body: wfa.dataPill(call.response_body, 'string'),
            status_code: wfa.dataPill(call.status_code, 'integer'),
            error_message: wfa.dataPill(call.error_message, 'string'),
        })
    },
)
