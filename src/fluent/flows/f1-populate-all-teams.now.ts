import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action, FlowArray, FlowObject } from '@servicenow/sdk/automation'
import { IntegerColumn } from '@servicenow/sdk/core'
import { f1GetAllTeams } from '../actions/f1-get-all-teams.now'
import { f1UpsertTeams } from '../actions/f1-upsert-teams.now'

// f1api.dev caps `limit` at 100 regardless of what's requested, so a single
// fetch can never return the full (~214 and growing) team roster. The 20
// offsets seeded below are a generous upper bound (2000 teams) on how far
// pagination will go — the loop always stops as soon as a page comes back
// empty, well before reaching the end of that list. Fluent source files only
// allow static literals passed directly to appendToFlowVariables (no local
// variable references), so the list is spelled out inline rather than
// generated or extracted to a constant.
const PAGE_SIZE = 100

/**
 * F1: Populate All Teams — fulfillment flow for the "Populate All Teams"
 * catalog item. Pages through every team from f1api.dev (100 per request,
 * the API's hard limit) and upserts them into the Team table. Triggered by
 * ordering the catalog item; no user input.
 */
export const f1PopulateAllTeams = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-teams'],
        name: 'F1: Populate All Teams',
        description: 'Fetches all F1 teams from f1api.dev, paging through the full roster, and upserts them into the Team table.',
        flowVariables: {
            offsets: FlowArray({
                label: 'Page Offsets',
                mandatory: false,
                childName: 'item',
                elementType: FlowObject({
                    label: 'Page Offset',
                    mandatory: false,
                    fields: { offset: IntegerColumn({ label: 'Offset' }) },
                }),
            }),
        },
    },
    wfa.trigger(
        trigger.application.serviceCatalog,
        { $id: Now.ID['f1-trigger-populate-all-teams'] },
        { run_flow_in: 'background' }
    ),
    (params) => {
        wfa.flowLogic.appendToFlowVariables(
            { $id: Now.ID['f1-flowlogic-seed-team-page-offsets'], annotation: 'Seed the page offsets to walk (0, 100, 200, ...)' },
            params.flowVariables,
            {
                offsets: [
                    { offset: 0 }, { offset: 100 }, { offset: 200 }, { offset: 300 }, { offset: 400 },
                    { offset: 500 }, { offset: 600 }, { offset: 700 }, { offset: 800 }, { offset: 900 },
                    { offset: 1000 }, { offset: 1100 }, { offset: 1200 }, { offset: 1300 }, { offset: 1400 },
                    { offset: 1500 }, { offset: 1600 }, { offset: 1700 }, { offset: 1800 }, { offset: 1900 },
                ],
            }
        )

        wfa.flowLogic.forEach(
            wfa.dataPill(params.flowVariables.offsets, 'array.object'),
            { $id: Now.ID['f1-flowlogic-for-each-team-page'], annotation: 'Fetch and upsert one page of teams at a time' },
            (page) => {
                const fetch_page = wfa.action(
                    f1GetAllTeams,
                    { $id: Now.ID['f1-flowstep-fetch-teams-page'], annotation: 'Fetch one page of teams from f1api.dev' },
                    { limit: PAGE_SIZE, offset: wfa.dataPill(page.offset, 'integer') }
                )

                wfa.flowLogic.if(
                    {
                        $id: Now.ID['f1-flowlogic-team-page-fetch-succeeded'],
                        condition: `${wfa.dataPill(fetch_page.status_code, 'integer')}=200`,
                        annotation: 'Only upsert if the fetch succeeded',
                    },
                    () => {
                        const upsert_page = wfa.action(
                            f1UpsertTeams,
                            { $id: Now.ID['f1-flowstep-upsert-teams-page'], annotation: 'Upsert this page of teams into the Team table' },
                            { teams_json: wfa.dataPill(fetch_page.response_body, 'string') }
                        )

                        wfa.flowLogic.if(
                            {
                                $id: Now.ID['f1-flowlogic-team-page-empty'],
                                condition: `${wfa.dataPill(upsert_page.created_count, 'integer')}=0^${wfa.dataPill(upsert_page.updated_count, 'integer')}=0`,
                                annotation: 'Stop once a page comes back with no teams — the previous page was the last one',
                            },
                            () => {
                                wfa.flowLogic.exitLoop({
                                    $id: Now.ID['f1-flowlogic-exit-loop-team-empty-page'],
                                    annotation: 'Reached the end of the team roster',
                                })
                            }
                        )
                    }
                )

                wfa.flowLogic.else(
                    { $id: Now.ID['f1-flowlogic-team-page-fetch-failed'], annotation: 'Log the fetch failure and stop paging' },
                    () => {
                        wfa.action(
                            action.core.log,
                            { $id: Now.ID['f1-flowstep-log-team-page-fetch-failure'] },
                            {
                                log_level: 'error',
                                log_message: `F1 Populate All Teams: page fetch failed at offset ${wfa.dataPill(page.offset, 'integer')}, status=${wfa.dataPill(fetch_page.status_code, 'integer')} error=${wfa.dataPill(fetch_page.error_message, 'string')}`,
                            }
                        )

                        wfa.flowLogic.exitLoop({
                            $id: Now.ID['f1-flowlogic-exit-loop-team-fetch-failed'],
                            annotation: 'Stop paging after a fetch failure',
                        })
                    }
                )
            }
        )
    }
)
