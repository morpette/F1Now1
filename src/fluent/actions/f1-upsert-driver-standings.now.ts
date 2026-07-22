import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { IntegerColumn, StringColumn } from '@servicenow/sdk/core'

/**
 * F1: Upsert Driver Standings from JSON — parses a f1api.dev
 * /api/{year}/drivers-championship response body ({ championshipId,
 * drivers_championship: [...] }) and creates/updates matching rows in the
 * Driver Standing table (x_1912467_f1now1_driver_stand), keyed on the
 * (championship, driver) unique index. Entries whose championship, driver,
 * or team can't be resolved by business id are skipped and counted, not
 * errored.
 */
export const f1UpsertDriverStandings = Action(
    {
        $id: Now.ID['f1-action-upsert-driver-standings'],
        name: 'F1: Upsert Driver Standings from JSON',
        internalName: 'f1_upsert_driver_standings',
        description: 'Parse a f1api.dev /api/{year}/drivers-championship JSON body and create/update rows in the Driver Standing table, keyed on (championship, driver).',
        category: 'f1_data',
        inputs: {
            driver_standings_json: StringColumn({ label: 'Driver Standings JSON', mandatory: true, maxLength: 65536, hint: 'Raw response_body from F1: Get Driver Standings by Season (top-level "championshipId" and "drivers_championship" array).' }),
        },
        outputs: {
            created_count: IntegerColumn({ label: 'Created Count' }),
            updated_count: IntegerColumn({ label: 'Updated Count' }),
            skipped_count: IntegerColumn({ label: 'Skipped Count' }),
            error_message: StringColumn({ label: 'Error Message', maxLength: 1000 }),
        },
    },
    (params) => {
        const upsert_driver_standings = wfa.actionStep(
            actionStep.script,
            { $id: Now.ID['f1-step-upsert-driver-standings'], label: 'Upsert Driver Standing records from JSON' },
            {
                required_run_time: 'instance',
                script: Now.include('./scripts/f1-upsert-driver-standings.js'),
                inputVariables: {
                    driver_standings_json: { label: 'Driver Standings JSON', value: wfa.dataPill(params.inputs.driver_standings_json, 'string') },
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
            created_count: wfa.dataPill(upsert_driver_standings.created_count, 'integer'),
            updated_count: wfa.dataPill(upsert_driver_standings.updated_count, 'integer'),
            skipped_count: wfa.dataPill(upsert_driver_standings.skipped_count, 'integer'),
            error_message: wfa.dataPill(upsert_driver_standings.error_message, 'string'),
        })
    }
)
