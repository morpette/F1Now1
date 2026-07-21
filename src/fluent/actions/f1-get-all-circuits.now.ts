import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get All Circuits — GET /api/circuits
 *
 * Building-block action for future flows/subflows. Invokes the declarative
 * 'F1 API Circuit Endpoints' REST Message function `getAllCircuits` via a
 * thin script step and returns the raw JSON body, HTTP status code, and any
 * error.
 */
export const f1GetAllCircuits = Action(
    {
        $id: Now.ID['f1-action-get-all-circuits'],
        name: 'F1: Get All Circuits',
        internalName: 'f1_get_all_circuits',
        description: 'Fetch all F1 circuits from f1api.dev (GET /api/circuits).',
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
    },
    (params) => {
        const invoke_f1_api_getallcircuits = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-get-all-circuits'], label: 'Invoke F1 API getAllCircuits' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-all-circuits.js'),
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
            response_body: wfa.dataPill(invoke_f1_api_getallcircuits.response_body, 'string'),
            status_code: wfa.dataPill(invoke_f1_api_getallcircuits.status_code, 'integer'),
            error_message: wfa.dataPill(invoke_f1_api_getallcircuits.error_message, 'string'),
        })
    }
)
