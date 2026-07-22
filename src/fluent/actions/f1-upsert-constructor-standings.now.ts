import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Constructor Standings from JSON — parses a f1api.dev
 * /api/{year}/constructors-championship response body ({ championshipId,
 * constructors_championship: [...] }) and creates/updates matching rows in
 * the Constructor Standing table (x_1912467_f1now1_team_standing), keyed on
 * the (championship, team) unique index. Entries whose championship or team
 * can't be resolved by business id are skipped and counted, not errored.
 */
export const f1UpsertConstructorStandings = Action(
    {
        $id: Now.ID['f1-action-upsert-constructor-standings'],
        name: 'F1: Upsert Constructor Standings from JSON',
        internalName: 'f1_upsert_constructor_standings',
        description: 'Parse a f1api.dev /api/{year}/constructors-championship JSON body and create/update rows in the Constructor Standing table, keyed on (championship, team).',
        category: 'f1_data',
        inputs: {
            constructor_standings_json: StringColumn({ label: 'Constructor Standings JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from F1: Get Constructor Standings by Season (top-level "championshipId" and "constructors_championship" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            skipped_count: IntegerColumn({ label: 'Skipped Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_constructor_standings = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-constructor-standings'], label: 'Upsert Constructor Standing records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-constructor-standings.js'),
                inputVariables: {
                    constructor_standings_json: { label: 'Constructor Standings JSON', value: wfa.dataPill(params.inputs.constructor_standings_json, 'string') },
                },
                outputVariables: {
                    created_count: IntegerColumn({ label: 'Created Count' }),
                    updated_count: IntegerColumn({ label: 'Updated Count' }),
                    skipped_count: IntegerColumn({ label: 'Skipped Count' }),
                    error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
                },
                errorHandlingType: 'dont_stop_the_action',
            }
        )

        wfa.assignActionOutputs(params.outputs, {
            created_count: wfa.dataPill(upsert_constructor_standings.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_constructor_standings.updated_count, 'integer'),
            skipped_count: wfa.dataPill(upsert_constructor_standings.skipped_count, 'integer'),
            error_message: wfa.dataPill(upsert_constructor_standings.error_message, 'string'),
        })
    }
)
