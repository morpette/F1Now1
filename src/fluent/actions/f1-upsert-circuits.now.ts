import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Circuits from JSON — parses a f1api.dev circuits response body
 * ({ circuits: [...] }) and creates/updates matching rows in the Circuit
 * table (x_1912467_f1now1_circuit), keyed on circuit_id. Resolves
 * fastestLapDriverId/fastestLapTeamId against the Driver/Team tables.
 */
export const f1UpsertCircuits = Action(
    {
        $id: Now.ID['f1-action-upsert-circuits'],
        name: 'F1: Upsert Circuits from JSON',
        internalName: 'f1_upsert_circuits',
        description: 'Parse a f1api.dev circuits JSON body and create/update rows in the Circuit table, keyed on circuit_id.',
        category: 'f1_data',
        inputs: {
            circuits_json: StringColumn({ label: 'Circuits JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from an F1 circuit-fetch action (top-level "circuits" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_circuits = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-circuits'], label: 'Upsert Circuit records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-circuits.js'),
                inputVariables: {
                    circuits_json: { label: 'Circuits JSON', value: wfa.dataPill(params.inputs.circuits_json, 'string') },
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
            created_count: wfa.dataPill(upsert_circuits.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_circuits.updated_count, 'integer'),
            error_message: wfa.dataPill(upsert_circuits.error_message, 'string'),
        })
    }
)
