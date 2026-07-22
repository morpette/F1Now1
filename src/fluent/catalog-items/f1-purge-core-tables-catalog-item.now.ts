import { CatalogItem, CheckboxVariable } from '@servicenow/sdk/core'
import { f1AdminsOnlyCriteria } from './f1-populate-all-drivers-catalog-item.now'

const TECHNICAL_CATALOG = '742ce428d7211100f2d224837e61036d'
const TECHNICAL_CATALOG_SERVICES_CATEGORY = 'd67c446ec0a80165000335aa37eafbc1'

export const f1PurgeCoreTablesCatalogItem = CatalogItem({
    $id: Now.ID['f1-catalog-purge-core-tables'],
    name: 'F1Now1: Purge Core Tables',
    shortDescription: 'Permanently delete all records from selected F1Now1 core tables.',
    description:
        'Admin tool for F1Now1. Ordering this item runs a flow that permanently deletes every record in each checked core table (Championship, Circuit, Driver, Team). Dependent tables (Race, Session, Session Result, Driver Standing, Constructor Standing, Driver Team Season) are not touched. This action cannot be undone.',

    catalogs: [TECHNICAL_CATALOG],
    categories: [TECHNICAL_CATALOG_SERVICES_CATEGORY],
    availableFor: [f1AdminsOnlyCriteria],

    variables: {
        purge_championships: CheckboxVariable({ question: 'Purge Championships', order: 100 }),
        purge_circuits: CheckboxVariable({ question: 'Purge Circuits', order: 200 }),
        purge_drivers: CheckboxVariable({ question: 'Purge Drivers', order: 300 }),
        purge_teams: CheckboxVariable({ question: 'Purge Teams', order: 400 }),
    },

    flow: Now.ref('sys_hub_flow', 'f1-flow-purge-core-tables'),

    ignorePrice: true,
    hideQuantitySelector: true,
})
