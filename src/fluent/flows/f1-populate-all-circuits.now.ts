import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action, FlowArray, FlowObject } from '@servicenow/sdk/automation'
import { IntegerColumn } from '@servicenow/sdk/core'
import { f1GetAllCircuits } from '../actions/f1-get-all-circuits.now'
import { f1UpsertCircuits } from '../actions/f1-upsert-circuits.now'

// f1api.dev caps `limit` at 100 regardless of what's requested. There are
// currently 84 circuits, so a single page already covers them all, but this
// pages the same way as the Driver/Team/Championship flows for consistency
// and headroom. The 20 offsets seeded below are a generous upper bound (2000
// circuits) — the loop always stops as soon as a page comes back empty.
// Fluent source files only allow static literals passed directly to
// appendToFlowVariables (no local variable references), so the list is
// spelled out inline rather than generated or extracted to a constant.
const PAGE_SIZE = 100

/**
 * F1: Populate All Circuits — fulfillment flow for the "Populate All
 * Circuits" catalog item. Pages through every circuit from f1api.dev (100
 * per request, the API's hard limit) and upserts them into the Circuit
 * table. Triggered by ordering the catalog item; no user input.
 */
export const f1PopulateAllCircuits = Flow(
    {
        $id: Now.ID['f1-flow-populate-all-circuits'],
        name: 'F1: Populate All Circuits',
        description: 'Fetches all F1 circuits from f1api.dev, paging through the full list, and upserts them into the Circuit table.',
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
        { $id: Now.ID['f1-trigger-populate-all-circuits'] },
        { run_flow_in: 'background' }
    ),
    (params) => {
        wfa.flowLogic.appendToFlowVariables(
            { $id: Now.ID['f1-flowlogic-seed-circuit-page-offsets'], annotation: 'Seed the page offsets to walk (0, 100, 200, ...)' },
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
            { $id: Now.ID['f1-flowlogic-for-each-circuit-page'], annotation: 'Fetch and upsert one page of circuits at a time' },
            (page) => {
                const fetch_page = wfa.action(
                    f1GetAllCircuits,
                    { $id: Now.ID['f1-flowstep-fetch-circuits-page'], annotation: 'Fetch one page of circuits from f1api.dev' },
                    { limit: PAGE_SIZE, offset: wfa.dataPill(page.offset, 'integer') }
                )

                wfa.flowLogic.if(
                    {
                        $id: Now.ID['f1-flowlogic-circuit-page-fetch-succeeded'],
                        condition: `${wfa.dataPill(fetch_page.status_code, 'integer')}=200`,
                        annotation: 'Only upsert if the fetch succeeded',
                    },
                    () => {
                        const upsert_page = wfa.action(
                            f1UpsertCircuits,
                            { $id: Now.ID['f1-flowstep-upsert-circuits-page'], annotation: 'Upsert this page of circuits into the Circuit table' },
                            { circuits_json: wfa.dataPill(fetch_page.response_body, 'string') }
                        )

                        wfa.flowLogic.if(
                            {
                                $id: Now.ID['f1-flowlogic-circuit-page-empty'],
                                condition: `${wfa.dataPill(upsert_page.created_count, 'integer')}=0^${wfa.dataPill(upsert_page.updated_count, 'integer')}=0`,
                                annotation: 'Stop once a page comes back with no circuits — the previous page was the last one',
                            },
                            () => {
                                wfa.flowLogic.exitLoop({
                                    $id: Now.ID['f1-flowlogic-exit-loop-circuit-empty-page'],
                                    annotation: 'Reached the end of the circuit list',
                                })
                            }
                        )
                    }
                )

                wfa.flowLogic.else(
                    { $id: Now.ID['f1-flowlogic-circuit-page-fetch-failed'], annotation: 'Log the fetch failure and stop paging' },
                    () => {
                        wfa.action(
                            action.core.log,
                            { $id: Now.ID['f1-flowstep-log-circuit-page-fetch-failure'] },
                            {
                                log_level: 'error',
                                log_message: `F1 Populate All Circuits: page fetch failed at offset ${wfa.dataPill(page.offset, 'integer')}, status=${wfa.dataPill(fetch_page.status_code, 'integer')} error=${wfa.dataPill(fetch_page.error_message, 'string')}`,
                            }
                        )

                        wfa.flowLogic.exitLoop({
                            $id: Now.ID['f1-flowlogic-exit-loop-circuit-fetch-failed'],
                            annotation: 'Stop paging after a fetch failure',
                        })
                    }
                )
            }
        )
    }
)
