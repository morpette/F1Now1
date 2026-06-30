import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Search Drivers — GET /api/drivers/search?q=...
 *
 * Invokes the 'F1 API' REST Message function `searchDrivers` via a thin
 * script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1SearchDrivers = Action(
    {
        $id: Now.ID['f1-action-search-drivers'],
        name: 'F1: Search Drivers',
        internalName: 'f1_search_drivers',
        description: 'Search F1 drivers by name or surname from f1api.dev (GET /api/drivers/search).',
        category: 'f1_data',
        inputs: {
            query: StringColumn({ label: 'Search Term', mandatory: true, hint: 'Name or surname, e.g. hamilton' }),
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
            { $id: Now.ID['f1-step-search-drivers'], label: 'Invoke F1 API searchDrivers' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-search-drivers.js'),
                inputVariables: {
                    query: { label: 'Search Term', value: wfa.dataPill(params.inputs.query, 'string') },
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
