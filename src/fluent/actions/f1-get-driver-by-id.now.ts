import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get Driver by ID — GET /api/drivers/{driverId}
 *
 * Invokes the 'F1 API' REST Message function `getDriverById` via a thin
 * script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1GetDriverById = Action(
    {
        $id: Now.ID['f1-action-get-driver-by-id'],
        name: 'F1: Get Driver by ID',
        internalName: 'f1_get_driver_by_id',
        description: 'Fetch a single F1 driver profile from f1api.dev by driver ID (GET /api/drivers/{driverId}).',
        category: 'f1_data',
        inputs: {
            driver_id: StringColumn({ label: 'Driver ID', mandatory: true, hint: 'e.g. max_verstappen' }),
        },
        outputs: {
            response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
            status_code: IntegerColumn({ label: 'Status Code' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
        masterSnapshot: '9d53d778937dcf14a03577f08bba1055',
    },
    (params) => {
        const invoke_f1_api_getdriverbyid = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-get-driver-by-id'], label: 'Invoke F1 API getDriverById' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-driver-by-id.js'),
                inputVariables: {
                    driver_id: { label: 'Driver ID', value: wfa.dataPill(params.inputs.driver_id, 'string') },
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
            response_body: wfa.dataPill(invoke_f1_api_getdriverbyid.response_body, 'string'),
            status_code: wfa.dataPill(invoke_f1_api_getdriverbyid.status_code, 'integer'),
            error_message: wfa.dataPill(invoke_f1_api_getdriverbyid.error_message, 'string'),
        })
    }
)
