define('DisplayProductLeadTime.Model', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function DisplayProductLeadTimeModel(
    SCModel,
    SearchHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'DisplayProductLeadTime',

        record: 'item',

        fieldsets: {
            basic: [
                'internalid',
                'name',
                'quantityavailable',
                'outofstockmessage',
                'leadtime',
                'date',
                'status'
            ]
        },

        columns: {
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' },
            quantityavailable: { fieldName: 'quantityavailable' },
            outofstockmessage: { fieldName: 'outofstockmessage' },
            leadtime: { fieldName: 'leadtime' }
        },

        proxy: function proxy(data, request) {
            var serviceUrl = nlapiResolveURL(
                'SUITELET',
                'customscript_ef_sl_dplt',
                'customdeploy_el_sl_dplt',
                false
            );

/* eslint-disable */
            var currentDomainMatch = request.getURL().match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var relativeServiceUrl = serviceUrl.replace(/^.*\/\/[^\/]+/, '');
/* eslint-enable */
            var currentDomain = currentDomainMatch && currentDomainMatch[0];
            var finalServiceUrl;
            var apiResponse;
            var responseData;
            var unknownError = {
                status: 500,
                code: 'ERR_UNKNONW',
                message: 'Internal error'
            };

            if (currentDomain[currentDomain.length - 1] === '/') {
                currentDomain = currentDomain.slice(0, -1);
            }

            data.website = session.getSiteSettings(['siteid']).siteid;

            finalServiceUrl = currentDomain + relativeServiceUrl;
            apiResponse = nlapiRequestURL(finalServiceUrl, JSON.stringify(data), request.getAllHeaders(), 'POST');

            try {
                responseData = JSON.parse(apiResponse.getBody());
            } catch (e) {
                throw unknownError;
            }

            if (parseInt(apiResponse.getHeader('Custom-Header-Status'), 10) !== 200) {
                throw _.extend({}, {
                    status: apiResponse.getHeader('Custom-Header-Status'),
                    code: responseData.errorCode,
                    message: responseData.errorMessage
                });
            }

            return responseData;
        },

        get: function get(data) {
            var Search;
            var itemResult;
            var filters = [
                { fieldName: 'internalid', operator: 'is', value1: data.itemId },
                { fieldName: 'website', operator: 'is', value1: data.website }
            ];

            Search = new SearchHelper(this.record, filters, this.columns, this.fieldsets.basic).search();

            itemResult = Search.searchRange(0, 1).getResults();


            return {
                leadTime: itemResult[0].leadtime || 30,
                purchaseOrder: this.getPurchasedOrder(filters) || 7
            };
        },

        getPurchasedOrder: function getPurchasedOrder(filters) {
            var Search;
            var purchaseOrder;
            var columns = _.extend(this.columns, {
                date: {
                    fieldName: 'trandate',
                    joinKey: 'transaction',
                    sort: 'desc'
                },
                status: {
                    fieldName: 'statusref',
                    joinKey: 'transaction'
                }
            });

            filters.push({ fieldName: 'isonline', operator: 'is', value1: 'T' },
                         { fieldName: 'isinactive', operator: 'is', value1: 'F' },
                         { fieldName: 'status', joinKey: 'transaction', operator: 'is', value1: 'PurchOrd:B' }
                        );

            Search = new SearchHelper(this.record, filters, columns, this.fieldsets.basic).search();

            Search.setSort('trandate');
            Search.setSortOrder('desc');

            purchaseOrder = Search.searchRange(0, 1).getResults();

            if (purchaseOrder.length > 0) {
                return this.getDays(purchaseOrder[0].date);
            }

            return false;
        },

        getDays: function getDays(date) {
            var currentDate = new Date();
            var arrayDate = date.split('/');
            var newDate = new Date(arrayDate[2], parseFloat(arrayDate[0]) - 1, parseFloat(arrayDate[1]));
            var finalDate = newDate.getTime() - currentDate.getTime();

            return Math.floor(finalDate / (1000 * 60 * 60 * 24)) + 1;
        }
    });
});
