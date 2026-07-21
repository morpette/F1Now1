import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get Current Season Drivers — GET /api/current/drivers
 *
 * Invokes the 'F1 API' REST Message function `getCurrentDrivers` via a thin
 * script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1GetCurrentDrivers = Action(
    {
        $id: Now.ID['f1-action-get-current-drivers'],
        name: 'F1: Get Current Season Drivers',
        internalName: 'f1_get_current_drivers',
        description: 'Fetch the list of F1 drivers for the current season from f1api.dev (GET /api/current/drivers).',
        category: 'f1_data',
        inputs: {
            limit: IntegerColumn({ label: 'Limit', hint: 'Records to return (1-100).', default: 30 }),
            offset: IntegerColumn({ label: 'Offset', hint: 'Records to skip.', default: 0 }),
        },
        outputs: {
            response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
            status_code: IntegerColumn({ label: 'Status Code' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
        masterSnapshot: '0743d378937dcf14a03577f08bba10c8',
    },
    (params) => {
        const invoke_f1_api_getcurrentdrivers = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-get-current-drivers'], label: 'Invoke F1 API getCurrentDrivers' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-current-drivers.js'),
                inputVariables: {
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
            response_body: wfa.dataPill(invoke_f1_api_getcurrentdrivers.response_body, 'string'),
            status_code: wfa.dataPill(invoke_f1_api_getcurrentdrivers.status_code, 'integer'),
            error_message: wfa.dataPill(invoke_f1_api_getcurrentdrivers.error_message, 'string'),
        })
    }
)
