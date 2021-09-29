define('Pacejet.JSON.Model', [
    'SC.Model',
    'Pacejet.Configuration',
    'underscore'
], function PacejetJSONModel(
    SCModel,
    pacejetConfig,
    _
) {
    'use strict';

    var pacejetHelper = (function () {


        var logResponse = function (pacejetResponse) {
                //TODO: make JSON version based on response
            },

            validateResponse = function(pacejetResponse) {
                //TODO: JSON version
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
                var items = _.extend(['quantity', 'internalid', pacejetConfig.autoPack], _.values(itemAttr));

                var order = APIOrder.getFieldValues({
                        items: items
                    }
                );

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

            makeHTTPCall = function(jsonRequest) {

                var cacheRequest = context.getSessionObject("PACEJETREQUEST");
                var cacheResponse =  JSON.parse(context.getSessionObject("PACEJETRESPONSE"));
                var stringRequest = JSON.stringify(jsonRequest);
                var body;
                if(cacheRequest !== stringRequest || _.isEmpty(cacheResponse)) {
                    nlapiLogExecution("ERROR", "cacheRequest", cacheRequest);
                    context.setSessionObject("PACEJETREQUEST", JSON.stringify(jsonRequest));

                    // TODO: find out what pRateXML's JSON version is (verify if it is PacejetAPI.Models.RateRequest)
                    // TODO: should we use nlapiRequestURLWithCredentials?

                    var httpResp = nlapiRequestURL(
                        pacejetConfig.serviceURL,
                        JSON.stringify(jsonRequest),
                        {
                            "Content-Type": 'application/json',
                            "PacejetLocation": pacejetConfig.location,
                            "PacejetLicenseKey": pacejetConfig.licenseKey
                        },
                        'POST'
                    );

                    body = JSON.parse(httpResp.getBody());
                    context.setSessionObject("PACEJETRESPONSE", JSON.stringify(JSON.parse(httpResp.getBody())));

                }else{
                    body = cacheResponse;
                }

                return body;
            },

            makeRequest = function (test, nocache, send, shippingMethods, orderSummary) {
                var response = {};

                var shoppingSession = nlapiGetWebContainer().getShoppingSession();

                if (!shoppingSession.isLoggedIn2()) {
                    console.log('Not logged in.');
                    return {success: false, error: "Not logged in"};
                }

                var order = shoppingSession.getOrder();
                var items = getItemsData(order);

                if (items == null) {
                    console.log('No items.');
                    return {success: false, error: "No items."};
                }

                //console.log('items----', JSON.stringify(items));

                var customerData = getCustomerData(order, shoppingSession);
                var totalWeight = getOrderWeight(items);

                var discShip = 0;
                var discShipResult;
                var requestHash = nlapiEncrypt(JSON.stringify([totalWeight, items, customerData]), 'sha1');
                var upsGround = _.where(shippingMethods, {internalid:"30"})

                // check for cache result
                var cacheDiscShip = nlapiGetContext().getSessionObject('cacheDiscShip');
                if(cacheDiscShip) {
                    discShipResult = JSON.parse(cacheDiscShip);
                    discShip = parseFloat(discShipResult[0].columns.custrecordrps_disc_ship_amt);
                } else {

                }

                if (test) {
                    response.items = items;
                }

                if (!nocache) {
                    var cacheObj = nlapiGetContext().getSessionObject('PacejetCache');
                    if (cacheObj) {
                        var cache = JSON.parse(cacheObj);
                        if (cache.hash == requestHash) {
                            return _.extend({}, cache.response, {cached: true});
                        }
                    }
                }

                var itemAttr = pacejetConfig.itemAttr;
                var itemsJSON = _.map(items, function(item)  {

                    // TODO: plug in Items
                    if (item[itemAttr['weight']] == null) {

                        throw "Item '" + item[itemAttr['id']] + "' could not be shipped.";
                    }

                    return {
                        "Number": item[itemAttr['id']],
                        "Description": item[itemAttr['description']],
                        "Weight": item[itemAttr['weight']],
                        "autoPack": item[itemAttr['autoPack']] ? 'True' : 'False',

                        "Dimensions": {
                            "Length": item[itemAttr['length']],
                            "Width": item[itemAttr['width']],
                            "Height": item[itemAttr['height']],
                        },
                        "Price": {
                            "Currency": pacejetConfig.priceCurrency,
                            "Amount": item[itemAttr['priceLevel']]
                        },

                        "PackUIRmngItem": pacejetConfig.packUIRmngItem,

                       "Quantity": {
                            "Units":  pacejetConfig.quantityUnit,
                            "Value": item[itemAttr['quantity']]
                        },
                        "CommodityName": item[itemAttr['commodityName']],

                    };
                });

                // shipment detail
                var shipmentDetail = {
                    'WeightUOM': pacejetConfig.WeightUOM,
                    'UserField12': _.find(shoppingSession.getCustomer().getCustomFieldValues(), function(item){
                        return item.name === 'custentity5';
                    }).value,
                    'UserField10': "5.50"
                };
                // custom fields
                var customFields = [{
                    "Name": "AutoPackShipment",
                    "Value": "True"
                }/*, {
                    "Name": "salesorder.custbodyrps_disc_shipping",
                    "Value": parseFloat(orderSummary.subtotal) >= discShip && upsGround.length > 0 ? 'T' : 'F'
                }, {
                    "Name": "custbody_rps_discshipamt",
                    "Value": discShip.toFixed(2)
                }, {
                    "Name": "salesorder.subtotal",
                    "Value": orderSummary.subtotal.toFixed(2)
                }*/
                ];

                // (Commerce API ID, not Netsuite ID)
                var customerDataJSON = {
                    "CompanyName": customerData.companyName,
                    "Address1": customerData.addr1,
                    "Address2": customerData.addr2,
                    "City": customerData.city,
                    "StateOrProvinceCode": customerData.state,
                    "PostalCode": customerData.zip,
                    "CountryCode": "US",
                    "ContactName": customerData.contactName,
                    "Email": customerData.email,
                    "Phone": customerData.phone,
                    "Residential": "false"
                };

                nlapiLogExecution('DEBUG', 'Pacejet: jsonRequest - send', !test || send);

                if (!test || send) {
                    var jsonRequest = {
                        //TODO: plug from Pacejet.Configuration.js (pacejetConfig.)
                        "Location": pacejetConfig.location,
                        "licenseKey": pacejetConfig.licenseKey,
                        "licenseID": pacejetConfig.licenseID,
                        "upsLicenseID": pacejetConfig.upsLicenseID,
                        "Origin": pacejetConfig.origin,
                        "Destination": customerDataJSON,
                        "ShipmentDetail": shipmentDetail,
                        "PackageDetailsList": [{
                            "ProductDetailsList": itemsJSON
                        }],
                        "CustomFields": customFields,
                        "ShowTrace": 'True',
                        "BillingDetails": {
                            "Subsidiary": '2'
                        }
                    };
                    var body = makeHTTPCall(jsonRequest);

                    //logResponse(body);

                    //validateResponse(body);

                    _.extend(response, { success: true, response: body.ratingResultsList});

                    if (test) {
                        _.extend(response, {
                            testing: true, sentJSON: jsonRequest, receivedJSON: body
                        })
                    }
                }
                else {
                    _.extend(response, {
                        success: true,
                        testing: true,
                        sentJSON: jsonRequest,
                        response: [],
                        receivedJSON: "REQ. NOT SENT"
                    });
                }

                nlapiLogExecution('DEBUG', 'Pacejet: REQUEST', JSON.stringify(jsonRequest));
                nlapiLogExecution('DEBUG', 'Pacejet: RESPONSE', JSON.stringify(response));
                //nlapiGetContext().setSessionObject('PacejetCache', JSON.stringify({hash: requestHash, response: response}));

                return response;
            };

        return {
            makeRequest: makeRequest
            //makeTestRequest: makeTestRequest
        };

    })();

    return SCModel.extend({
        name: 'Pacejet',
        get: function (nocache, shippingMethods, orderSummary) {
            var response;

            try {
                response = pacejetHelper.makeRequest(false, nocache, true, shippingMethods, orderSummary);
            } catch (ex) {
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

        // TODO (nice-to-have): getTestJSON
        getTestJSON: function(customer, items)  {

        }
    })

});
