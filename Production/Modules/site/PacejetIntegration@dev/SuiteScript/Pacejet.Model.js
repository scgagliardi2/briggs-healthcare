define('Pacejet.Model', [
    'SC.Model',
    'Pacejet.Configuration',
    'underscore'
], function PacejetModel(
    SCModel,
    pacejetConfig,
    _
) {
    'use strict';

    var pacejetHelper = (function () {

        var logResponse = function (pacejetResponse) {

                if (pacejetResponse && pacejetResponse.indexOf('<RatingResultsList>') !== -1) {
                    var textRatingResults = pacejetResponse.split('<RatingResultsList>')[1];
                    textRatingResults = '<RatingResultsList>' + textRatingResults.split('</RatingResultsList>')[0] + '</RatingResultsList>';

                    var textRatingLogArray = splitTextToLog(textRatingResults).reverse();
                    var arrayLength = textRatingLogArray.length;
                    _.each(textRatingLogArray, function (text, index) {
                        console.log('PaceJet Response (' + (arrayLength - index)  + '/' + arrayLength + ')', prepareXMLToLog(text));
                    });
                }

                console.log('Last XML Part', prepareXMLToLog(pacejetResponse.substring(Math.max(pacejetResponse.length - 1500, 0))));
            },

            validateResponse = function(pacejetResponse) {
                if (pacejetResponse && pacejetResponse.indexOf('<RatingResultsList>') !== -1) {

                }
                else {
                    if (pacejetResponse) {
                        var xmldoc = nlapiStringToXML(pacejetResponse),
                            resultsNode = nlapiSelectNodes(xmldoc, "//*[name()='ErrorDetails']");

                        for (var i = 0; i < resultsNode.length; i++) {
                            var node = resultsNode[i],
                                severity = nlapiSelectValue(node, 'Severity');

                            if (severity == 'FAILURE') {
                                throw (nlapiSelectValue(node, 'Message') || 'Unknown error') + ". See error log.";
                            }
                        }
                    }

                    throw 'Unexpected error. No PaceJet Response. ' + ". See error log.";
                }
            },

            buildXMLRequest = function (pTotalWeight, pCustomer, pProductDetailsXML) {

                if (!pacejetConfig.location ||
                    !pacejetConfig.origin ||
                    !pacejetConfig.upsLicenseId ||
                    !pacejetConfig.origin.stateOrProvinceCode ||
                    !pacejetConfig.origin.postalCode ||
                    !pacejetConfig.origin.countryCode ||
                    !pacejetConfig.origin.city) {

                    throw "Some Pacejet configuration options are missing.";
                }

                var missings = [];
                var required_customer_values = ['state', 'zip', 'phone', 'email', 'addr1', 'city'];
                _.each(required_customer_values, function (attr) {
                    if (!pCustomer[attr]) {
                        missings.push(attr);
                    }
                });

                if (missings.length > 0) {
                    throw "Shipping could not be estimated, the following information is missing: " + missings.join(', ');
                }

                var xml =
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<RatingImportEntity>' +

                    (pacejetConfig.showTrace ? '<ShowTrace>' + pacejetConfig.showTrace + '</ShowTrace>' : '') +

                    '<Location>' + pacejetConfig.location + '</Location>' +
                    '<LicenseID>' + pacejetConfig.licenseId + '</LicenseID>' +
                    '<UPSLicenseID>' + (pacejetConfig.upsLicenseId || '') + '</UPSLicenseID>' +
                    '<TransactionID>1</TransactionID>' +
                    '<Origin>' +
                    "<LocationSite>"+ pacejetConfig.origin.locationSite +"</LocationSite>" +
                    "<LocationCode>"+ pacejetConfig.origin.locationCode +"</LocationCode>" +
                    "<address>"+ pacejetConfig.origin.address+"</address>" +
                    '<StateOrProvinceCode>' + pacejetConfig.origin.stateOrProvinceCode + '</StateOrProvinceCode>' +
                    '<PostalCode>' + pacejetConfig.origin.postalCode + '</PostalCode>' +
                    '<CountryCode>' + pacejetConfig.origin.countryCode + '</CountryCode>' +
                    '<City>' + pacejetConfig.origin.city + '</City>' +
                    '</Origin>' +
                    '<Destination>' +
                    '<StateOrProvinceCode>' + (pCustomer.state || 'NY') + '</StateOrProvinceCode>' +
                    '<PostalCode>' + (pCustomer.zip || '11000') + '</PostalCode>' +
                    '<CountryCode>US</CountryCode>' +
                    '<Phone>' + (pCustomer.phone || '5551231234') + '</Phone>' +
                    '<Email>' + (pCustomer.email || 'test@test.com') + '</Email>' +
                    '<Address1>' + (pCustomer.addr1 || 'NO STREET PROVIDED') + '</Address1>' +
                    '<Address2>' + (pCustomer.addr2 || '') + '</Address2>' +
                    '<Address3>' + (pCustomer.addr3 || '') + '</Address3>' +
                    '<City>' + (pCustomer.city || 'NO CITY PROVIDED') + '</City>' +
                    '<CompanyName>' + (pCustomer.companyName || 'Company Name') + '</CompanyName>' +
                    '<ContactName>' + (pCustomer.contactName || 'Contact Name') + '</ContactName>' +
                    '</Destination>' +
                    '<ShipmentDetail>' +
                    '<WeightUOM>' + pacejetConfig.WeightUOM + '</WeightUOM>' +
                    '<PackingListEnclosed>false</PackingListEnclosed>' +
                    '</ShipmentDetail>' +
                    '<PackageDetailsList>' + //pProductDetailsXML + '</PackageDetailsList>' +
                    '<PackageDetails>' +
                    '<ProductDetailsList>' + pProductDetailsXML + '</ProductDetailsList>' +
                    '</PackageDetails>' +
                    '</PackageDetailsList>' +
                    '</RatingImportEntity>';

                return xml;
            },

            buildXMLProducts = function (products) {

                var itemAttr = pacejetConfig.itemAttr;

                var xmlProducts = '';

                _.each(products, function (product) {

                    if (product[itemAttr['weight']] == null) {

                        throw "Item '" + product[itemAttr['id']] + "' could not be shipped.";
                    }

                    xmlProducts +=
                        '<ProductDetails>' +
                            // Product or Item Number
                        '<Number>' + product[itemAttr['id']] + '</Number>' +
//                        '<ExternalID>3582</ExternalID>' +
                        '<Description>' + product[itemAttr['description']]  + '</Description>' +
                        '<Weight>' + product[itemAttr['weight']] + '</Weight>' +
                        '<Quantity>' +
                        '<Units>EA</Units>' +
                        '<Value>' + product.quantity + '</Value>' +
                        '</Quantity>' +
                        (pacejetConfig.autoPack ? '<AutoPack>True</AutoPack>' : '') +
                        '</ProductDetails>';

                    console.log('Current Product', JSON.stringify(product));
                });

                return xmlProducts;
            },

            getCustomerData = function(APIOrder, shoppingSession) {
                var order = APIOrder.getFieldValues(['shipaddress']);
                var orderAddress = order.shipaddress;
                var customer = shoppingSession.getCustomer().getFieldValues(['email']);

                var customerData = {};

                if (orderAddress) {
                    _.extend(customerData, orderAddress, {email: customer.email});
                }

                return customerData;
            },

            getItemsData = function(APIOrder) {
                var itemAttr = pacejetConfig.itemAttr;

                var order = APIOrder.getFieldValues({
                    items: [
                        'quantity',
                        'internalid',
                        itemAttr['id'],
                        itemAttr['description'],
                        itemAttr['weight']
                    ]
                });

                //TODO: Filter out non-shippable items

                return order.items;
            },

            getOrderWeight = function(items) {
                var weightArray = _.pluck(items, 'weight');
                var totalWeight = _.reduce(weightArray, function (memo, weight) {
                        return memo + weight;
                    }) || 0;

                return totalWeight;
            },

            makeHTTPCall = function(xmlRequest) {

                var httpResp = nlapiRequestURL(pacejetConfig.serviceURL, { pRateXML: xmlRequest },
                    { "Content-Type": 'application/x-www-form-urlencoded' }, 'POST');

                var body = httpResp.getBody()
                    .replace(/<\?xml version\="1\.0" encoding\="utf\-\d+"\?\>/ig, '');

                return body;
            },

            makeRequest = function (test, nocache, send) {
                var response = {};

                var shoppingSession = nlapiGetWebContainer().getShoppingSession();

                if (!shoppingSession.isLoggedIn()) {
                    console.log('Not logged in.');
                    return {success: false, error: "Not logged in"};
                }

                var order = shoppingSession.getOrder();

                var items = getItemsData(order);
                var customerData = getCustomerData(order, shoppingSession);
                var totalWeight = getOrderWeight(items);

                if (test) {
                    response.items = items;
                }

                var requestHash = nlapiEncrypt(JSON.stringify([totalWeight, items, customerData]), 'sha1');

                if (!nocache) {
                    var cacheObj = nlapiGetContext().getSessionObject('PacejetCache');
                    if (cacheObj) {
                        var cache = JSON.parse(cacheObj);
                        if (cache.hash == requestHash) {
                            return _.extend({}, cache.response, {cached: true});
                        }
                    }
                }

                var productDetailsXML = buildXMLProducts(items);
                var xmlRequest = buildXMLRequest(totalWeight, customerData, productDetailsXML);

                console.log('Xml sent to pacejet', prepareXMLToLog(xmlRequest));

                if (!test || send) {

                    var body = makeHTTPCall(xmlRequest);

                    logResponse(body);

                    validateResponse(body);

                    _.extend(response, { success: true, response: processResponse(body)});

                    if (test) {
                        _.extend(response, {testing: true, sentXML: xmlRequest, receivedXML: body})
                    }
                }
                else {
                    _.extend(response, {success: true, testing: true, sentXML: xmlRequest, response: [], receivedXML: "REQ. NOT SENT"});
                }

                nlapiGetContext().setSessionObject('PacejetCache', JSON.stringify({hash: requestHash, response: response}));

                return response;
            },

            processResponse = function (bodyResponse) {

                var xmldoc = nlapiStringToXML(bodyResponse),
                    resultsNode = nlapiSelectNodes(xmldoc, "//*[name()='RatingResults']"),
                    carriersData = [];

                for (var i = 0; i < resultsNode.length; i++) {
                    var node = resultsNode[i],
                        yourRate = parseFloat(nlapiSelectValue(node, pacejetConfig.yourRateXMLName)).toFixed(2),
                        recipientRate = parseFloat(nlapiSelectValue(node, pacejetConfig.recipientRateXMLName)).toFixed(2),
                        listPrice = parseFloat(nlapiSelectValue(node, pacejetConfig.stdRateXMLName)).toFixed(2),
                        name = nlapiSelectValue(node, pacejetConfig.shippingXMLName).replace(/®/g, '');


                    carriersData.push({
                        name: name,
                        netsuiteName: pacejetConfig.shipping_map[name] ? pacejetConfig.shipping_map[name].label : false,
                        netsuiteId: pacejetConfig.shipping_map[name] ? pacejetConfig.shipping_map[name].id : false,
                        yourRate: yourRate,
                        recipientRate: recipientRate,
                        listPrice: listPrice
                    });
                }

                console.log('Shipping Methods', JSON.stringify(carriersData));

                return carriersData;
            },



            prepareXMLToLog = function (xml) {
                return xml.replace(/</ig, '&lt;').replace(/>/ig, '&gt;');
            },

            splitTextToLog = function (text) {
                var len = text.length,
                // Netsuite limit to log msg length
                    limit = 2000,
                    result = [],
                    count,
                    i;
                if (len > limit) {
                    count = Math.ceil(len / limit);
                    for (i = 0; i < count; i++) {
                        result.push(text.substring((i * limit), limit + (i * limit)));
                    }
                } else {
                    result.push(text);
                }
                return result;
            },

            makeTestRequest = function(customer, items, weight) {
                var productDetailsXML = buildXMLProducts(items);
                var xmlRequest = buildXMLRequest(weight, customer, productDetailsXML);

                return xmlRequest;
            };

        return {
            makeRequest: makeRequest,
            makeTestRequest: makeTestRequest
        };

    })();

    return SCModel.extend({
        name: 'Pacejet',
        get: function (nocache) {
            var response;

            try {
                response = pacejetHelper.makeRequest(false, nocache);
            } catch (ex) {
                console.error(JSON.stringify(ex));
                response = {success: false, error: ex};
            }

            return response;
        },

        doTestRequest: function(nocache, notry, send) {
            if (notry) {
                return pacejetHelper.makeRequest(true, nocache, send);
            }
            else {
                var response = {};
                try {
                    response = pacejetHelper.makeRequest(true, nocache, send);
                }
                catch (ex) {
                    response = {success: false, error: ex};
                }
                return response;
            }
        },

        getTestXML: function(customer, items) {
            var testData = {
                customer: {
                    phone: '5551231234',
                    addr1: '555 Test Address',
                    addr2: '',
                    addr3: '',
                    state: 'FL',
                    city:  'Miami',
                    zip: 33181,
                    contactName: 'Mr Test',
                    companyName: 'Company Ltd',
                    email: 'test@test.com'
                },
                items: [
                    {
                        'internalid': '64313',
                        'quantity': 1,
                        'itemid': '01550667 ADV MED',
                        'storedisplayname': 'Blister Medic',
                        'weight': '2'
                    },
                    {
                        'internalid': '64314',
                        'quantity': 2,
                        'itemid': '01550668 ADV MED',
                        'storedisplayname': 'Test Item',
                        'weight': '1'
                    }
                ]
            };


            return pacejetHelper.makeTestRequest(testData.customer, testData.items, 4);
        }
    })

});