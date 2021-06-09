/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
define([
    'N/search',
    'N/runtime',
    'N/record'
], function CustomerSegmentMapReduceScript(
        search,
        runtime,
        record
) {
    'use strict';

    var audienceControlMapReduce = {
        getInputData: function getInputData() {
            var delimiter = /\u0005/;
            var mySaveSearchResult = [];
            var selectedRecord = runtime.getCurrentScript().getParameter('custscript_ss_cs_mr_selected_rec');
            var saveSearchFieldId = runtime.getCurrentScript().getParameter('custscript_ss_cs_mr_savesearchfieldid');
            var customerSelectedSegments = runtime.getCurrentScript().getParameter('custscript_ss_cs_mr_customersegments');
            var remainSegments = runtime.getCurrentScript().getParameter('custscript_ef_map_remain_cs');
            if (selectedRecord === 'customer') {
                search.load({
                    id: saveSearchFieldId,
                    columns: [
                        'id',
                        'recordType',
                        'custentity_customer_customersegments',
                        'altname'
                    ]
                }).run().each(function eachSaveSearchResult(result) {
                    mySaveSearchResult.push({
                        id: result.id,
                        name: result.getValue('altname'),
                        recordType: result.recordType,
                        customerSegmentsValue: result.getValue('custentity_customer_customersegments').split(','),
                        customerSegmentsText: result.getText('custentity_customer_customersegments'),
                        customerSelectedSegments: customerSelectedSegments.split(delimiter),
                        selectedRecord: selectedRecord,
                        remainSegments: remainSegments
                    });
                    return true;
                });
            } else {
                search.load({
                    id: saveSearchFieldId,
                    columns: ['id', 'custitem_item_customersegments']
                }).run().each(function eachResult(result) {
                    mySaveSearchResult.push({
                        id: result.id,
                        customerSegmentsValue: result.getValue('custitem_item_customersegments').split(','),
                        customerSegmentsText: result.getText('custitem_item_customersegments'),
                        recordType: result.recordType,
                        customerSelectedSegments: customerSelectedSegments.split(delimiter),
                        selectedRecord: selectedRecord,
                        remainSegments: remainSegments
                    });
                    return true;
                });
            }
            return mySaveSearchResult;
        },
        map: function map(context) {
            var searchResult = JSON.parse(context.value);
            var existingSegment = searchResult.customerSegmentsValue;

            var concatSegments = (searchResult.remainSegments === 'T') ?
                existingSegment.concat(searchResult.customerSelectedSegments) :
            searchResult.customerSelectedSegments;

            var objRecord = (searchResult.selectedRecord === 'customer') ? {
                type: record.Type.CUSTOMER,
                customFieldID: 'custentity_customer_customersegments'
            } :
            {
                type: searchResult.recordType,
                customFieldID: 'custitem_item_customersegments'
            };

            var recordLoaded = record.load({
                type: objRecord.type,
                id: searchResult.id
            });
            recordLoaded.setValue(objRecord.customFieldID, concatSegments);
            recordLoaded.save();

            return true;
        }
    };
    return {
        getInputData: audienceControlMapReduce.getInputData,
        map: audienceControlMapReduce.map
    };
});
