import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'
import { f1GetAllDrivers } from '../actions/f1-get-all-drivers.now'
import { f1UpsertDrivers } from '../actions/f1-upsert-drivers.now'

/**
 * F1: Populate All Drivers — fulfillment flow for the "Populate All Drivers"
 * catalog item. Fetches every driver from f1api.dev and upserts them into
 * the Driver table. Triggered by ordering the catalog item; no user input.
 */
export const f1PopulateAllDrivers = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-drivers'],
        name: 'F1: Populate All Drivers',
        description: 'Fetches all F1 drivers from f1api.dev and upserts them into the Driver table.',
    },
    wfa.trigger(
        trigger.application.serviceCatalog,
        { $id: Now.ID['f1-trigger-populate-all-drivers'] },
        { run_flow_in: 'background' }
    ),
    (_params) => {
        const fetch_all_drivers = wfa.action(
            f1GetAllDrivers,
            { $id: Now.ID['f1-flowstep-fetch-all-drivers'], annotation: 'Fetch all drivers from f1api.dev' },
            { limit: 1000, offset: 0 }
        )

        wfa.flowLogic.if(
            {
                $id: Now.ID['f1-flowlogic-fetch-succeeded'],
                condition: `${wfa.dataPill(fetch_all_drivers.status_code, 'integer')}=200`,
                annotation: 'Only upsert if the fetch succeeded',
            },
            () => {
                wfa.action(
                    f1UpsertDrivers,
                    { $id: Now.ID['f1-flowstep-upsert-all-drivers'], annotation: 'Upsert fetched drivers into the Driver table' },
                    { drivers_json: wfa.dataPill(fetch_all_drivers.response_body, 'string') }
                )
            }
        )

        wfa.flowLogic.else(
            { $id: Now.ID['f1-flowlogic-fetch-failed'], annotation: 'Log the fetch failure' },
            () => {
                wfa.action(
                    action.core.log,
                    { $id: Now.ID['f1-flowstep-log-fetch-failure'] },
                    {
                        log_level: 'error',
                        log_message: `F1 Populate All Drivers: fetch failed, status=${wfa.dataPill(fetch_all_drivers.status_code, 'integer')} error=${wfa.dataPill(fetch_all_drivers.error_message, 'string')}`,
                    }
                )
            }
        )
    }
)
