import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Get Drivers by Season — GET /api/{year}/drivers
 *
 * Invokes the 'F1 API' REST Message function `getDriversBySeason` via a thin
 * script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1GetDriversBySeason = Action(
    {
        $id: Now.ID['f1-action-get-drivers-by-season'],
        name: 'F1: Get Drivers by Season',
        internalName: 'f1_get_drivers_by_season',
        description: 'Fetch the list of F1 drivers for a given season from f1api.dev (GET /api/{year}/drivers).',
        category: 'f1_data',
        inputs: {
            year: IntegerColumn({ label: 'Season Year', mandatory: true, hint: 'e.g. 2024' }),
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
            { $id: Now.ID['f1-step-get-drivers-by-season'], label: 'Invoke F1 API getDriversBySeason' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-get-drivers-by-season.js'),
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
            },
        )

        wfa.assignActionOutputs(params.outputs, {
            response_body: wfa.dataPill(call.response_body, 'string'),
            status_code: wfa.dataPill(call.status_code, 'integer'),
            error_message: wfa.dataPill(call.error_message, 'string'),
        })
    },
)
