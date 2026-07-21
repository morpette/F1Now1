import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Compare Two Drivers — GET /api/{year}/compare/{driverId1}/{driverId2}
 *
 * Invokes the 'F1 API' REST Message function `compareDrivers` via a thin
 * script step and returns the raw JSON body, HTTP status code, and error.
 */
export const f1CompareDrivers = Action(
    {
        $id: Now.ID['f1-action-compare-drivers'],
        name: 'F1: Compare Two Drivers',
        internalName: 'f1_compare_drivers',
        description:
            'Compare the head-to-head between two drivers in a season from f1api.dev (GET /api/{year}/compare/{driverId1}/{driverId2}).',
        category: 'f1_data',
        inputs: {
            year: IntegerColumn({ label: 'Season Year', mandatory: true, hint: 'e.g. 2024' }),
            driver_id_1: StringColumn({ label: 'Driver ID 1', mandatory: true, hint: 'e.g. max_verstappen' }),
            driver_id_2: StringColumn({ label: 'Driver ID 2', mandatory: true, hint: 'e.g. lewis_hamilton' }),
        },
        outputs: {
            response_body: StringColumn({ label: 'Response Body', maxLength: 65536 }),
            status_code: IntegerColumn({ label: 'Status Code' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
        masterSnapshot: 'd2335b38937dcf14a03577f08bba10b7',
    },
    (params) => {
        const invoke_f1_api_comparedrivers = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-compare-drivers'], label: 'Invoke F1 API compareDrivers' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-compare-drivers.js'),
                inputVariables: {
                    year: { label: 'Season Year', value: wfa.dataPill(params.inputs.year, 'integer') },
                    driver_id_1: { label: 'Driver ID 1', value: wfa.dataPill(params.inputs.driver_id_1, 'string') },
                    driver_id_2: { label: 'Driver ID 2', value: wfa.dataPill(params.inputs.driver_id_2, 'string') },
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
            response_body: wfa.dataPill(invoke_f1_api_comparedrivers.response_body, 'string'),
            status_code: wfa.dataPill(invoke_f1_api_comparedrivers.status_code, 'integer'),
            error_message: wfa.dataPill(invoke_f1_api_comparedrivers.error_message, 'string'),
        })
    }
)
