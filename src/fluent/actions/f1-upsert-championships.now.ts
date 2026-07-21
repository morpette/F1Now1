import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Championships from JSON — parses a f1api.dev seasons response
 * body ({ championships: [...] }) and creates/updates matching rows in the
 * Championship table (x_1912467_f1now1_championship), keyed on
 * championship_id.
 */
export const f1UpsertChampionships = Action(
    {
        $id: Now.ID['f1-action-upsert-championships'],
        name: 'F1: Upsert Championships from JSON',
        internalName: 'f1_upsert_championships',
        description: 'Parse a f1api.dev seasons JSON body and create/update rows in the Championship table, keyed on championship_id.',
        category: 'f1_data',
        inputs: {
            championships_json: StringColumn({ label: 'Championships JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from an F1 championship-fetch action (top-level "championships" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_championships = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-championships'], label: 'Upsert Championship records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-championships.js'),
                inputVariables: {
                    championships_json: { label: 'Championships JSON', value: wfa.dataPill(params.inputs.championships_json, 'string') },
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
            created_count: wfa.dataPill(upsert_championships.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_championships.updated_count, 'integer'),
            error_message: wfa.dataPill(upsert_championships.error_message, 'string'),
        })
    }
)
