import { CatalogItem } from '@servicenow/sdk/core'
import { f1AdminsOnlyCriteria } from './f1-populate-all-drivers-catalog-item.now'

const TECHNICAL_CATALOG = '742ce428d7211100f2d224837e61036d'
const TECHNICAL_CATALOG_SERVICES_CATEGORY = 'd67c446ec0a80165000335aa37eafbc1'

export const f1PopulateAllDriverStandingsCatalogItem = CatalogItem({
    $id: Now.ID['f1-catalog-populate-all-driver-standings'],
    name: 'F1Now1: Populate All Driver Standings',
    shortDescription: 'Fetch every season\'s driver championship standings from f1api.dev and load them into the Driver Standing table.',
    description:
        'Admin tool for F1Now1. Ordering this item runs a flow that fetches each season\'s driver championship standings from f1api.dev and creates/updates the corresponding rows in the Driver Standing table. Takes no input. Run "Populate All Championships", "Populate All Drivers", and "Populate All Teams" first — entries whose driver or team can\'t be resolved yet are skipped rather than errored.',

    catalogs: [TECHNICAL_CATALOG],
    categories: [TECHNICAL_CATALOG_SERVICES_CATEGORY],
    availableFor: [f1AdminsOnlyCriteria],

    flow: Now.ref('sys_hub_flow', 'f1-flow-populate-all-driver-standings'),

    ignorePrice: true,
    hideQuantitySelector: true,
})
