import '@servicenow/sdk/global'
import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'
import { f1PurgeCoreTablesCatalogItem } from '../catalog-items/f1-purge-core-tables-catalog-item.now'

// Core tables are all modest in size (low thousands at most), so a single
// lookUpRecords per table comfortably covers the full table in one page --
// no need for the offset-paging loop the populate flows use against f1api.dev.
const MAX_RESULTS = 5000

/**
 * F1: Purge Core Tables — fulfillment flow for the "Purge Core Tables"
 * catalog item. Reads the four purge checkboxes off the ordered request item
 * and, for each one checked, permanently deletes every record in that core
 * table (Championship, Circuit, Driver, Team).
 */
export const f1PurgeCoreTables = Flow(
    {
        $id: Now.ID['f1-flow-purge-core-tables'],
        name: 'F1: Purge Core Tables',
        description:
            'Deletes all records from each checked F1Now1 core table (Championship, Circuit, Driver, Team). Fulfillment flow for the "Purge Core Tables" catalog item.',
    },
    wfa.trigger(
        trigger.application.serviceCatalog,
        { $id: Now.ID['f1-trigger-purge-core-tables'] },
        { run_flow_in: 'background' }
    ),
    (params) => {
        const vars = wfa.action(
            action.core.getCatalogVariables,
            {
                $id: Now.ID['f1-action-get-purge-core-tables-vars'],
                annotation: 'Surface the purge checkboxes from the ordered request item',
            },
            {
                requested_item: wfa.dataPill(params.trigger.request_item, 'reference'),
                template_catalog_item: `${f1PurgeCoreTablesCatalogItem}`,
                catalog_variables: [
                    f1PurgeCoreTablesCatalogItem.variables.purge_championships,
                    f1PurgeCoreTablesCatalogItem.variables.purge_circuits,
                    f1PurgeCoreTablesCatalogItem.variables.purge_drivers,
                    f1PurgeCoreTablesCatalogItem.variables.purge_teams,
                ],
            }
        )

        wfa.flowLogic.if(
            {
                $id: Now.ID['f1-flowlogic-purge-championships-selected'],
                condition: `${wfa.dataPill(vars.purge_championships, 'boolean')}=true`,
                annotation: 'Delete every Championship record if the checkbox was selected',
            },
            () => {
                const found = wfa.action(
                    action.core.lookUpRecords,
                    { $id: Now.ID['f1-flowstep-lookup-championships-to-purge'] },
                    { table: 'x_1912467_f1now1_championship', max_results: MAX_RESULTS }
                )

                wfa.flowLogic.forEach(
                    wfa.dataPill(found.Records, 'array.object'),
                    { $id: Now.ID['f1-flowlogic-for-each-championship-to-delete'], annotation: 'Delete each Championship record' },
                    (record) => {
                        wfa.action(
                            action.core.deleteRecord,
                            { $id: Now.ID['f1-flowstep-delete-championship'] },
                            { record: `${wfa.dataPill(record, 'reference')}` }
                        )
                    }
                )
            }
        )

        wfa.flowLogic.if(
            {
                $id: Now.ID['f1-flowlogic-purge-circuits-selected'],
                condition: `${wfa.dataPill(vars.purge_circuits, 'boolean')}=true`,
                annotation: 'Delete every Circuit record if the checkbox was selected',
            },
            () => {
                const found = wfa.action(
                    action.core.lookUpRecords,
                    { $id: Now.ID['f1-flowstep-lookup-circuits-to-purge'] },
                    { table: 'x_1912467_f1now1_circuit', max_results: MAX_RESULTS }
                )

                wfa.flowLogic.forEach(
                    wfa.dataPill(found.Records, 'array.object'),
                    { $id: Now.ID['f1-flowlogic-for-each-circuit-to-delete'], annotation: 'Delete each Circuit record' },
                    (record) => {
                        wfa.action(
                            action.core.deleteRecord,
                            { $id: Now.ID['f1-flowstep-delete-circuit'] },
                            { record: `${wfa.dataPill(record, 'reference')}` }
                        )
                    }
                )
            }
        )

        wfa.flowLogic.if(
            {
                $id: Now.ID['f1-flowlogic-purge-drivers-selected'],
                condition: `${wfa.dataPill(vars.purge_drivers, 'boolean')}=true`,
                annotation: 'Delete every Driver record if the checkbox was selected',
            },
            () => {
                const found = wfa.action(
                    action.core.lookUpRecords,
                    { $id: Now.ID['f1-flowstep-lookup-drivers-to-purge'] },
                    { table: 'x_1912467_f1now1_driver', max_results: MAX_RESULTS }
                )

                wfa.flowLogic.forEach(
                    wfa.dataPill(found.Records, 'array.object'),
                    { $id: Now.ID['f1-flowlogic-for-each-driver-to-delete'], annotation: 'Delete each Driver record' },
                    (record) => {
                        wfa.action(
                            action.core.deleteRecord,
                            { $id: Now.ID['f1-flowstep-delete-driver'] },
                            { record: `${wfa.dataPill(record, 'reference')}` }
                        )
                    }
                )
            }
        )

        wfa.flowLogic.if(
            {
                $id: Now.ID['f1-flowlogic-purge-teams-selected'],
                condition: `${wfa.dataPill(vars.purge_teams, 'boolean')}=true`,
                annotation: 'Delete every Team record if the checkbox was selected',
            },
            () => {
                const found = wfa.action(
                    action.core.lookUpRecords,
                    { $id: Now.ID['f1-flowstep-lookup-teams-to-purge'] },
                    { table: 'x_1912467_f1now1_team', max_results: MAX_RESULTS }
                )

                wfa.flowLogic.forEach(
                    wfa.dataPill(found.Records, 'array.object'),
                    { $id: Now.ID['f1-flowlogic-for-each-team-to-delete'], annotation: 'Delete each Team record' },
                    (record) => {
                        wfa.action(
                            action.core.deleteRecord,
                            { $id: Now.ID['f1-flowstep-delete-team'] },
                            { record: `${wfa.dataPill(record, 'reference')}` }
                        )
                    }
                )
            }
        )
    }
)
