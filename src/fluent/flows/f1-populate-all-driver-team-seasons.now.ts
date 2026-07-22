import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'
import { f1GetDriversBySeason } from '../actions/f1-get-drivers-by-season.now'
import { f1UpsertDriverTeamSeasons } from '../actions/f1-upsert-driver-team-seasons.now'

// f1api.dev's largest season on record (1950) has 81 drivers, well within the
// getDriversBySeason limit of 100 — so unlike the Circuit/Driver/Team/
// Championship flows, no offset-paging loop is needed here: a single call
// per season already covers it. The outer loop instead walks every
// Championship record already in the table (one lookUpRecords call), since
// each season needs its own fetch by year.
const MAX_RESULTS = 200
const PAGE_SIZE = 100

/**
 * F1: Populate All Driver Team Seasons — fulfillment flow for the "Populate
 * All Driver Team Seasons" catalog item. For every Championship record,
 * fetches that season's drivers (each already carrying its teamId) from
 * f1api.dev and upserts the (championship, team, driver) triples into the
 * Driver Team Season table. Triggered by ordering the catalog item; no user
 * input. Assumes Championship, Driver, and Team are already populated.
 */
export const f1PopulateAllDriverTeamSeasons = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-driver-team-seasons'],
        name: 'F1: Populate All Driver Team Seasons',
        description:
            'For every Championship, fetches that season\'s drivers (with team) from f1api.dev and upserts the (championship, team, driver) triples into the Driver Team Season table.',
    },
    wfa.trigger(
        trigger.application.serviceCatalog,
        { $id: Now.ID['f1-trigger-populate-all-driver-team-seasons'] },
        { run_flow_in: 'background' }
    ),
    () => {
        const found = wfa.action(
            action.core.lookUpRecords,
            { $id: Now.ID['f1-flowstep-lookup-championships-for-driver-team-seasons'], annotation: 'Look up every Championship to fetch that season\'s driver/team pairings' },
            { table: 'x_1912467_f1now1_championship', max_results: MAX_RESULTS }
        )

        wfa.flowLogic.forEach(
            wfa.dataPill(found.Records, 'array.object'),
            { $id: Now.ID['f1-flowlogic-for-each-championship-driver-team-season'], annotation: 'Fetch and upsert one season\'s driver/team pairings at a time' },
            (champ) => {
                const fetch_season = wfa.action(
                    f1GetDriversBySeason,
                    { $id: Now.ID['f1-flowstep-fetch-drivers-for-season'], annotation: 'Fetch this season\'s drivers (with team) from f1api.dev' },
                    { year: wfa.dataPill(champ.year, 'integer'), limit: PAGE_SIZE, offset: 0 }
                )

                wfa.flowLogic.if(
                    {
                        $id: Now.ID['f1-flowlogic-driver-season-fetch-succeeded'],
                        condition: `${wfa.dataPill(fetch_season.status_code, 'integer')}=200`,
                        annotation: 'Only upsert if the fetch succeeded',
                    },
                    () => {
                        wfa.action(
                            f1UpsertDriverTeamSeasons,
                            { $id: Now.ID['f1-flowstep-upsert-driver-team-seasons-for-season'], annotation: 'Upsert this season\'s driver/team pairings into the Driver Team Season table' },
                            { driver_seasons_json: wfa.dataPill(fetch_season.response_body, 'string') }
                        )
                    }
                )

                wfa.flowLogic.else(
                    { $id: Now.ID['f1-flowlogic-driver-season-fetch-failed'], annotation: 'Log the fetch failure and move on to the next season' },
                    () => {
                        wfa.action(
                            action.core.log,
                            { $id: Now.ID['f1-flowstep-log-driver-season-fetch-failure'] },
                            {
                                log_level: 'error',
                                log_message: `F1 Populate All Driver Team Seasons: fetch failed for year ${wfa.dataPill(champ.year, 'integer')}, status=${wfa.dataPill(fetch_season.status_code, 'integer')} error=${wfa.dataPill(fetch_season.error_message, 'string')}`,
                            }
                        )
                    }
                )
            }
        )
    }
)
