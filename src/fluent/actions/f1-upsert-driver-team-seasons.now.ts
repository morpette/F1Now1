import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Driver Team Seasons from JSON — parses a f1api.dev
 * /api/{year}/drivers response body ({ championshipId, drivers: [...] }) and
 * creates/updates matching rows in the Driver Team Season table
 * (x_1912467_f1now1_driver_season), keyed on the (championship, team,
 * driver) unique index. Entries whose championship, driver, or team can't be
 * resolved by business id are skipped and counted, not errored.
 */
export const f1UpsertDriverTeamSeasons = Action(
    {
        $id: Now.ID['f1-action-upsert-driver-team-seasons'],
        name: 'F1: Upsert Driver Team Seasons from JSON',
        internalName: 'f1_upsert_driver_team_seasons',
        description: 'Parse a f1api.dev /api/{year}/drivers JSON body and create/update rows in the Driver Team Season table, keyed on (championship, team, driver).',
        category: 'f1_data',
        inputs: {
            driver_seasons_json: StringColumn({ label: 'Driver Seasons JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from F1: Get Drivers by Season (top-level "championshipId" and "drivers" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            skipped_count: IntegerColumn({ label: 'Skipped Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_driver_team_seasons = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-driver-team-seasons'], label: 'Upsert Driver Team Season records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-driver-team-seasons.js'),
                inputVariables: {
                    driver_seasons_json: { label: 'Driver Seasons JSON', value: wfa.dataPill(params.inputs.driver_seasons_json, 'string') },
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
            created_count: wfa.dataPill(upsert_driver_team_seasons.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_driver_team_seasons.updated_count, 'integer'),
            skipped_count: wfa.dataPill(upsert_driver_team_seasons.skipped_count, 'integer'),
            error_message: wfa.dataPill(upsert_driver_team_seasons.error_message, 'string'),
        })
    }
)
