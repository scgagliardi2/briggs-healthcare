/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *@recordDeployed customer, lead & prospect
 */

define(['N/search'], function CustomerSegment(search) {
    'use strict';

    return {
        beforeSubmit: function beforeSubmit(context) {
            // Initialization
            var formData = context.newRecord;
            var customerSegmentIds = formData.getValue('custentity_customer_customersegments');
            var myCustomerSegmentsResult = [];
            var mycustomerSegmentsList = search.load({
                id: 'customsearch_ef_customer_segments_group'
            });
            var ids = [];

            if (customerSegmentIds && customerSegmentIds.length !== 0) {
                util.each(customerSegmentIds, function utilEach(value) {
                    ids.push(value);
                });

                mycustomerSegmentsList.filters = [search.createFilter({
                    name: 'internalid',
                    operator: 'anyof',
                    values: ids
                })];
                mycustomerSegmentsList.run().each(function segmentListResult(result) {
                    myCustomerSegmentsResult.push({
                        id: result.id,
                        value: result.getValue('groupname').replace(/ /g, '-')
                    });
                    return true;
                });
            } else {
                myCustomerSegmentsResult.push({ 'id': '', 'value': '' });
            }

            formData.setValue('custentity_hidden_customersegment', JSON.stringify(myCustomerSegmentsResult));
        }
    };
});
