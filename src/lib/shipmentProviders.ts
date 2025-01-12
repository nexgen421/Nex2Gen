type ShipmentProvider = {
    id: number 
    title: string
    code: string
}

export const ShippingProviders: ShipmentProvider[] = [
    {
        id: 1, 
        title: "Delhivery", 
        code: "delhivery"
    },
    {
        id: 2, 
        title: "EcomExpress", 
        code: "ecom-express"
    },
    {
        id: 3, 
        title: "ShadowFax", 
        code: "shadowfax"
    },
    {
        id: 4, 
        title: "XpressBees", 
        code: "xpressbees"
    },
]