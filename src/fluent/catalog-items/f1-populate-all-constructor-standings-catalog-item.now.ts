import { CatalogItem } from '@servicenow/sdk/core'
import { f1AdminsOnlyCriteria } from './f1-populate-all-drivers-catalog-item.now'

const TECHNICAL_CATALOG = '742ce428d7211100f2d224837e61036d'
const TECHNICAL_CATALOG_SERVICES_CATEGORY = 'd67c446ec0a80165000335aa37eafbc1'

export const f1PopulateAllConstructorStandingsCatalogItem = CatalogItem({
    $id: Now.ID['f1-catalog-populate-all-constructor-standings'],
    name: 'F1Now1: Populate All Constructor Standings',
    shortDescription: 'Fetch every season\'s constructor championship standings from f1api.dev and load them into the Constructor Standing table.',
    description:
        'Admin tool for F1Now1. Ordering this item runs a flow that fetches each season\'s constructor championship standings from f1api.dev and creates/updates the corresponding rows in the Constructor Standing table. Takes no input. Run "Populate All Championships" and "Populate All Teams" first — entries whose team can\'t be resolved yet are skipped rather than errored. f1api.dev has no constructor standings before 1958, so those seasons are logged and skipped.',

    catalogs: [TECHNICAL_CATALOG],
    categories: [TECHNICAL_CATALOG_SERVICES_CATEGORY],
    availableFor: [f1AdminsOnlyCriteria],

    flow: Now.ref('sys_hub_flow', 'f1-flow-populate-all-constructor-standings'),

    ignorePrice: true,
    hideQuantitySelector: true,
})
