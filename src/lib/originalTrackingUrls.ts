export const OriginalTrackingUrls = {
    "amazon": (awbNumber: string) => {
        return `https://track.amazon.in/tracking/${awbNumber}?trackingId=${awbNumber}`
    },
    "xpressbees": (awbNumber: string) => {
        return `https://www.xpressbees.com/shipment/tracking?awbNo=${awbNumber}`
    },
    "shadowfax": () => {
        return `https://www.shadowfax.in/track-order`
    },
    "ecomexpress": (awbNumber: string) => {
        return `https://www.ecomexpress.in/tracking/?awb_field=${awbNumber}`
    },
    "delhivery": (awbNumber: string) => {
        return `https://www.delhivery.com/track/package/${awbNumber}`
    },
    "dhl": (awbNumber: string) => {
        return `https://www.dhl.com/in-en/home/tracking.html?tracking-id=${awbNumber}`
    },
    "ekart": (awbNumber: string) => {
        return `https://ekartlogistics.com/shipmenttrack/${awbNumber}`;
    }
}