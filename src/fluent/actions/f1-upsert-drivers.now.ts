import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Drivers from JSON — parses a f1api.dev drivers response body
 * ({ drivers: [...] }) and creates/updates matching rows in the Driver table
 * (x_1912467_f1now1_driver), keyed on driver_id.
 */
export const f1UpsertDrivers = Action(
    {
        $id: Now.ID['f1-action-upsert-drivers'],
        name: 'F1: Upsert Drivers from JSON',
        internalName: 'f1_upsert_drivers',
        description: 'Parse a f1api.dev drivers JSON body and create/update rows in the Driver table, keyed on driver_id.',
        category: 'f1_data',
        inputs: {
            drivers_json: StringColumn({ label: 'Drivers JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from an F1 driver-fetch action (top-level "drivers" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_drivers = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-drivers'], label: 'Upsert Driver records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-drivers.js'),
                inputVariables: {
                    drivers_json: { label: 'Drivers JSON', value: wfa.dataPill(params.inputs.drivers_json, 'string') },
                },
                outputVariables: {
                    created_count: IntegerColumn({ label: 'Created Count' }),
                    updated_count: IntegerColumn({ label: 'Updated Count' }),
                    error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
                },
                errorHandlingType: 'dont_stop_the_action',
            }
        )

        wfa.assignActionOutputs(params.outputs, {
            created_count: wfa.dataPill(upsert_drivers.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_drivers.updated_count, 'integer'),
            error_message: wfa.dataPill(upsert_drivers.error_message, 'string'),
        })
    }
)
