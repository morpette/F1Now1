import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'
import { f1GetDriverStandingsBySeason } from '../actions/f1-get-driver-standings-by-season.now'
import { f1UpsertDriverStandings } from '../actions/f1-upsert-driver-standings.now'

// f1api.dev's largest season on record (1950) has 81 driver standings
// entries, well within the getDriverStandingsBySeason limit of 100 -- so, as
// with the Driver Team Season flow, no offset-paging loop is needed: a
// single call per season already covers it. The outer loop instead walks
// every Championship record already in the table, since each season needs
// its own fetch by year.
const MAX_RESULTS = 200
const PAGE_SIZE = 100

/**
 * F1: Populate All Driver Standings — fulfillment flow for the "Populate All
 * Driver Standings" catalog item. For every Championship record, fetches
 * that season's driver championship standings from f1api.dev and upserts
 * them into the Driver Standing table. Triggered by ordering the catalog
 * item; no user input. Assumes Championship, Driver, and Team are already
 * populated.
 */
export const f1PopulateAllDriverStandings = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-driver-standings'],
        name: 'F1: Populate All Driver Standings',
        description:
            'For every Championship, fetches that season\'s driver championship standings from f1api.dev and upserts them into the Driver Standing table.',
    },
    wfa.trigger(
        trigger.application.serviceCatalog,
        { $id: Now.ID['f1-trigger-populate-all-driver-standings'] },
        { run_flow_in: 'background' }
    ),
    () => {
        const found = wfa.action(
            action.core.lookUpRecords,
            { $id: Now.ID['f1-flowstep-lookup-championships-for-driver-standings'], annotation: 'Look up every Championship to fetch that season\'s driver standings' },
            { table: 'x_1912467_f1now1_championship', max_results: MAX_RESULTS }
        )

        wfa.flowLogic.forEach(
            wfa.dataPill(found.Records, 'array.object'),
            { $id: Now.ID['f1-flowlogic-for-each-championship-driver-standing'], annotation: 'Fetch and upsert one season\'s driver standings at a time' },
            (champ) => {
                const fetch_season = wfa.action(
                    f1GetDriverStandingsBySeason,
                    { $id: Now.ID['f1-flowstep-fetch-driver-standings-for-season'], annotation: 'Fetch this season\'s driver standings from f1api.dev' },
                    { year: wfa.dataPill(champ.year, 'integer'), limit: PAGE_SIZE, offset: 0 }
                )

                wfa.flowLogic.if(
                    {
                        $id: Now.ID['f1-flowlogic-driver-standing-fetch-succeeded'],
                        condition: `${wfa.dataPill(fetch_season.status_code, 'integer')}=200`,
                        annotation: 'Only upsert if the fetch succeeded',
                    },
                    () => {
                        wfa.action(
                            f1UpsertDriverStandings,
                            { $id: Now.ID['f1-flowstep-upsert-driver-standings-for-season'], annotation: 'Upsert this season\'s driver standings into the Driver Standing table' },
                            { driver_standings_json: wfa.dataPill(fetch_season.response_body, 'string') }
                        )
                    }
                )

                wfa.flowLogic.else(
                    { $id: Now.ID['f1-flowlogic-driver-standing-fetch-failed'], annotation: 'Log the fetch failure and move on to the next season' },
                    () => {
                        wfa.action(
                            action.core.log,
                            { $id: Now.ID['f1-flowstep-log-driver-standing-fetch-failure'] },
                            {
                                log_level: 'error',
                                log_message: `F1 Populate All Driver Standings: fetch failed for year ${wfa.dataPill(champ.year, 'integer')}, status=${wfa.dataPill(fetch_season.status_code, 'integer')} error=${wfa.dataPill(fetch_season.error_message, 'string')}`,
                            }
                        )
                    }
                )
            }
        )
    }
)
