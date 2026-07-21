import { CatalogItem, Record } from '@servicenow/sdk/core'

const TECHNICAL_CATALOG = '742ce428d7211100f2d224837e61036d'
const TECHNICAL_CATALOG_SERVICES_CATEGORY = 'd67c446ec0a80165000335aa37eafbc1'
const F1NOW1_ADMIN_ROLE = '7737cd14937d8b14a03577f08bba104c'

/**
 * Restricts the "Populate All Drivers" catalog item to F1Now1 admins —
 * it's a data-maintenance tool, not something regular users should see or order.
 */
export const f1AdminsOnlyCriteria = Record({
    $id: Now.ID['f1-uc-admins-only'],
    table: 'user_criteria',
    data: {
        name: 'F1Now1 Admins',
        short_description: 'Users with the F1Now1 admin role.',
        active: true,
        role: F1NOW1_ADMIN_ROLE,
    },
})

export const f1PopulateAllDriversCatalogItem = CatalogItem({
    $id: Now.ID['f1-catalog-populate-all-drivers'],
    name: 'F1Now1: Populate All Drivers',
    shortDescription: 'Fetch every F1 driver from f1api.dev and load them into the Driver table.',
    description:
        'Admin tool for F1Now1. Ordering this item runs a flow that fetches all F1 drivers from f1api.dev and creates/updates the corresponding rows in the Driver table. Takes no input.',

    catalogs: [TECHNICAL_CATALOG],
    categories: [TECHNICAL_CATALOG_SERVICES_CATEGORY],
    availableFor: [f1AdminsOnlyCriteria],

    flow: Now.ref('sys_hub_flow', 'f1-flow-populate-all-drivers'),

    ignorePrice: true,
    hideQuantitySelector: true,
})
