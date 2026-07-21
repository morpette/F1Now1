import { CatalogItem } from '@servicenow/sdk/core'
import { f1AdminsOnlyCriteria } from './f1-populate-all-drivers-catalog-item.now'

const TECHNICAL_CATALOG = '742ce428d7211100f2d224837e61036d'
const TECHNICAL_CATALOG_SERVICES_CATEGORY = 'd67c446ec0a80165000335aa37eafbc1'

export const f1PopulateAllTeamsCatalogItem = CatalogItem({
    $id: Now.ID['f1-catalog-populate-all-teams'],
    name: 'F1Now1: Populate All Teams',
    shortDescription: 'Fetch every F1 team from f1api.dev and load them into the Team table.',
    description:
        'Admin tool for F1Now1. Ordering this item runs a flow that fetches all F1 teams from f1api.dev and creates/updates the corresponding rows in the Team table. Takes no input.',

    catalogs: [TECHNICAL_CATALOG],
    categories: [TECHNICAL_CATALOG_SERVICES_CATEGORY],
    availableFor: [f1AdminsOnlyCriteria],

    flow: Now.ref('sys_hub_flow', 'f1-flow-populate-all-teams'),

    ignorePrice: true,
    hideQuantitySelector: true,
})
