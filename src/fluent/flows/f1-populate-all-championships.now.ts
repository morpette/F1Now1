import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action, FlowArray, FlowObject } from '@servicenow/sdk/automation'
import { IntegerColumn } from '@servicenow/sdk/core'
import { f1GetAllChampionships } from '../actions/f1-get-all-championships.now'
import { f1UpsertChampionships } from '../actions/f1-upsert-championships.now'

// f1api.dev caps `limit` at 100 regardless of what's requested. There are
// currently only 77 championships/seasons (one per year since 1950), so a
// single page already covers them all, but this pages the same way as the
// Driver/Team flows for consistency and headroom. The 20 offsets seeded below
// are a generous upper bound (2000 seasons) — the loop always stops as soon
// as a page comes back empty. Fluent source files only allow static literals
// passed directly to appendToFlowVariables (no local variable references),
// so the list is spelled out inline rather than generated or extracted to a
// constant.
const PAGE_SIZE = 100

/**
 * F1: Populate All Championships — fulfillment flow for the "Populate All
 * Championships" catalog item. Pages through every season from f1api.dev
 * (100 per request, the API's hard limit) and upserts them into the
 * Championship table. Triggered by ordering the catalog item; no user input.
 */
export const f1PopulateAllChampionships = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-championships'],
        name: 'F1: Populate All Championships',
        description: 'Fetches all F1 championships/seasons from f1api.dev, paging through the full list, and upserts them into the Championship table.',
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
        { $id: Now.ID['f1-trigger-populate-all-championships'] },
        { run_flow_in: 'background' }
    ),
    (params) => {
        wfa.flowLogic.appendToFlowVariables(
            { $id: Now.ID['f1-flowlogic-seed-championship-page-offsets'], annotation: 'Seed the page offsets to walk (0, 100, 200, ...)' },
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
            { $id: Now.ID['f1-flowlogic-for-each-championship-page'], annotation: 'Fetch and upsert one page of championships at a time' },
            (page) => {
                const fetch_page = wfa.action(
                    f1GetAllChampionships,
                    { $id: Now.ID['f1-flowstep-fetch-championships-page'], annotation: 'Fetch one page of championships from f1api.dev' },
                    { limit: PAGE_SIZE, offset: wfa.dataPill(page.offset, 'integer') }
                )

                wfa.flowLogic.if(
                    {
                        $id: Now.ID['f1-flowlogic-championship-page-fetch-succeeded'],
                        condition: `${wfa.dataPill(fetch_page.status_code, 'integer')}=200`,
                        annotation: 'Only upsert if the fetch succeeded',
                    },
                    () => {
                        const upsert_page = wfa.action(
                            f1UpsertChampionships,
                            { $id: Now.ID['f1-flowstep-upsert-championships-page'], annotation: 'Upsert this page of championships into the Championship table' },
                            { championships_json: wfa.dataPill(fetch_page.response_body, 'string') }
                        )

                        wfa.flowLogic.if(
                            {
                                $id: Now.ID['f1-flowlogic-championship-page-empty'],
                                condition: `${wfa.dataPill(upsert_page.created_count, 'integer')}=0^${wfa.dataPill(upsert_page.updated_count, 'integer')}=0`,
                                annotation: 'Stop once a page comes back with no championships — the previous page was the last one',
                            },
                            () => {
                                wfa.flowLogic.exitLoop({
                                    $id: Now.ID['f1-flowlogic-exit-loop-championship-empty-page'],
                                    annotation: 'Reached the end of the championship list',
                                })
                            }
                        )
                    }
                )

                wfa.flowLogic.else(
                    { $id: Now.ID['f1-flowlogic-championship-page-fetch-failed'], annotation: 'Log the fetch failure and stop paging' },
                    () => {
                        wfa.action(
                            action.core.log,
                            { $id: Now.ID['f1-flowstep-log-championship-page-fetch-failure'] },
                            {
                                log_level: 'error',
                                log_message: `F1 Populate All Championships: page fetch failed at offset ${wfa.dataPill(page.offset, 'integer')}, status=${wfa.dataPill(fetch_page.status_code, 'integer')} error=${wfa.dataPill(fetch_page.error_message, 'string')}`,
                            }
                        )

                        wfa.flowLogic.exitLoop({
                            $id: Now.ID['f1-flowlogic-exit-loop-championship-fetch-failed'],
                            annotation: 'Stop paging after a fetch failure',
                        })
                    }
                )
            }
        )
    }
)
