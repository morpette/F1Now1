import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Teams from JSON — parses a f1api.dev teams response body
 * ({ teams: [...] }) and creates/updates matching rows in the Team table
 * (x_1912467_f1now1_team), keyed on team_id.
 */
export const f1UpsertTeams = Action(
    {
        $id: Now.ID['f1-action-upsert-teams'],
        name: 'F1: Upsert Teams from JSON',
        internalName: 'f1_upsert_teams',
        description: 'Parse a f1api.dev teams JSON body and create/update rows in the Team table, keyed on team_id.',
        category: 'f1_data',
        inputs: {
            teams_json: StringColumn({ label: 'Teams JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from an F1 team-fetch action (top-level "teams" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_teams = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-teams'], label: 'Upsert Team records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-teams.js'),
                inputVariables: {
                    teams_json: { label: 'Teams JSON', value: wfa.dataPill(params.inputs.teams_json, 'string') },
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
            created_count: wfa.dataPill(upsert_teams.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_teams.updated_count, 'integer'),
            error_message: wfa.dataPill(upsert_teams.error_message, 'string'),
        })
    }
)
