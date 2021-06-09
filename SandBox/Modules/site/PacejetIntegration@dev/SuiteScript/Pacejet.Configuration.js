define('Pacejet.Configuration', function() {
     return {
//
//         // BRIGGS INFO
//         // API LICENSE = 940a4283-535a-81a8-074d-a2577912400a
//         // RATING LICENSE = 14551a71-8768-e4a7-4f71-d63d79a115df
//         // UPSRATING = 29a1fea2-0e77-c56d-6d86-f927e51a3b26
        // location: 'BriggsHealthCare',
        // licenseId: '14551a71-8768-e4a7-4f71-d63d79a115df',
        // upsLicenseId: '29a1fea2-0e77-c56d-6d86-f927e51a3b26',
        // serviceURL: 'https://api.pacejet.cc/Rates',
        // licenseKey: '940a4283-535a-81a8-074d-a2577912400a',

        serviceURL: 'https://api.pacejet.cc/Rates',
        headers: {
            'PacejetLocation': 'BriggsHealthcare',
            'PacejetLicenseKey': '2d02dc7e-b693-456b-9659-7fd5b92015bd'
        },

        location: "BriggsHealthcare",
        licenseID: "603d8f97-312a-ff90-b686-230f1f1a6151",
        licenseKey: '2d02dc7e-b693-456b-9659-7fd5b92015bd',
        upsLicenseID: "ab638e00-bf18-74e5-db76-1207c54696d0",
        BillingDetails: {
            "Subsidiary":"2"
        },

        showTrace: 1,

        WeightUOM: 'lb',
        LengthUOM: 'IN',

        autoPack: 'custitem_pacejet_item_autopack',

        origin: {
            locationType: 'Facility',
            locationSite: 'MAIN',
            locationCode: '4',
            companyName: 'Briggs Healthcare',
            contactName: 'Carlos Wakely',
            address1: '7887 University Blvd',
            stateOrProvinceCode: 'IA',
            postalCode: '50325',
            countryCode: 'US',
            city: 'Clive',
            phone: '800-247-2343',
            email: 'customersupport@briggscorp.com'
        },

        itemAttr: {
            'id': 'itemid',
            'description': 'storedisplayname',
            'weight': 'weight',
            'length': 'custitem_pacejet_item_length',
            'width': 'custitem_pacejet_item_width',
            'height': 'custitem_pacejet_item_height',
            'commodityName': 'custitem_pacejet_commodity_name',
            'priceLevel': 'pricelevel1',
            'quantity': 'quantity',
            'amount': 'amount',
            'autoPack': 'custitem_pacejet_item_autopack'
        },
        // TODO: verify
        // shippingXMLName: 'CarrierClassOfServiceCodeDescription',
        // recipientRateXMLName: 'ConsigneeFreight',
        // yourRateXMLName : 'ConsignorFreight',
        // stdRateXMLName : 'ListFreight',

        jsonCarrierName: 'carrierClassOfServiceCarrierName',
        jsonCarrierCode: 'carrierClassOfServiceCode',
        jsonCarrierDescription: 'carrierClassOfServiceDescription',
        jsonShipCodeXRef: 'carrierClassOfServiceShipCodeXRef',

        // TODO: complete mappings

        quantityUnit: 'EA',
        packUIRmngItem: 'N',
        priceCurrency: 'USD',

        shipping_map: {
            'First Class': {
                label: "USPS 1st Class"
                //    id:
            },
            'UPS 3 Day Select(SM)': {
                label: "UPS 3 Day"
            },
            '2nd Day Air': {
                label: "UPS 2nd Day"
                //  id:
            },
            'Next Day Air': {
                label: "UPS Next Day"
                //    id:
            },
            'UPS Ground': {
                label: "UPS Standard"
                //    id: 4
            } //4
        }
     }
});
