import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'
import { f1GetConstructorStandingsBySeason } from '../actions/f1-get-constructor-standings-by-season.now'
import { f1UpsertConstructorStandings } from '../actions/f1-upsert-constructor-standings.now'

// Same reasoning as the Driver Standings flow: a single call per season
// (limit 100) covers every season's constructor standings in one page, so
// the outer loop walks every Championship record rather than paging.
// f1api.dev returns HTTP 404 (not an empty list) for years before 1958, the
// first constructors' championship -- those years simply fall into the
// "fetch failed" branch below and are logged, not treated as fatal.
const MAX_RESULTS = 200
const PAGE_SIZE = 100

/**
 * F1: Populate All Constructor Standings — fulfillment flow for the
 * "Populate All Constructor Standings" catalog item. For every Championship
 * record, fetches that season's constructor championship standings from
 * f1api.dev and upserts them into the Constructor Standing table. Triggered
 * by ordering the catalog item; no user input. Assumes Championship and
 * Team are already populated.
 */
export const f1PopulateAllConstructorStandings = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-constructor-standings'],
        name: 'F1: Populate All Constructor Standings',
        description:
            'For every Championship, fetches that season\'s constructor championship standings from f1api.dev and upserts them into the Constructor Standing table.',
    },
    wfa.trigger(
        trigger.application.serviceCatalog,
        { $id: Now.ID['f1-trigger-populate-all-constructor-standings'] },
        { run_flow_in: 'background' }
    ),
    () => {
        const found = wfa.action(
            action.core.lookUpRecords,
            { $id: Now.ID['f1-flowstep-lookup-championships-for-constructor-standings'], annotation: 'Look up every Championship to fetch that season\'s constructor standings' },
            { table: 'x_1912467_f1now1_championship', max_results: MAX_RESULTS }
        )

        wfa.flowLogic.forEach(
            wfa.dataPill(found.Records, 'array.object'),
            { $id: Now.ID['f1-flowlogic-for-each-championship-constructor-standing'], annotation: 'Fetch and upsert one season\'s constructor standings at a time' },
            (champ) => {
                const fetch_season = wfa.action(
                    f1GetConstructorStandingsBySeason,
                    { $id: Now.ID['f1-flowstep-fetch-constructor-standings-for-season'], annotation: 'Fetch this season\'s constructor standings from f1api.dev' },
                    { year: wfa.dataPill(champ.year, 'integer'), limit: PAGE_SIZE, offset: 0 }
                )

                wfa.flowLogic.if(
                    {
                        $id: Now.ID['f1-flowlogic-constructor-standing-fetch-succeeded'],
                        condition: `${wfa.dataPill(fetch_season.status_code, 'integer')}=200`,
                        annotation: 'Only upsert if the fetch succeeded',
                    },
                    () => {
                        wfa.action(
                            f1UpsertConstructorStandings,
                            { $id: Now.ID['f1-flowstep-upsert-constructor-standings-for-season'], annotation: 'Upsert this season\'s constructor standings into the Constructor Standing table' },
                            { constructor_standings_json: wfa.dataPill(fetch_season.response_body, 'string') }
                        )
                    }
                )

                wfa.flowLogic.else(
                    { $id: Now.ID['f1-flowlogic-constructor-standing-fetch-failed'], annotation: 'Log the fetch outcome (expected for years before 1958) and move on to the next season' },
                    () => {
                        wfa.action(
                            action.core.log,
                            { $id: Now.ID['f1-flowstep-log-constructor-standing-fetch-failure'] },
                            {
                                log_level: 'warn',
                                log_message: `F1 Populate All Constructor Standings: no data for year ${wfa.dataPill(champ.year, 'integer')}, status=${wfa.dataPill(fetch_season.status_code, 'integer')} error=${wfa.dataPill(fetch_season.error_message, 'string')}`,
                            }
                        )
                    }
                )
            }
        )
    }
)
