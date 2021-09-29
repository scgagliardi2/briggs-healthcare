/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define([
    'N/search',
    'N/ui/message'
],
    function CustomerSegmentClientScript(
        search,
        message
) {
        var audienceControlClient = {
            fieldChanged: function fieldChanged(context) {
                var currentRecord = context.currentRecord;
                var field = currentRecord.getField({ fieldId: 'custpage_savesearchfield' });
                var fieldId = context.fieldId;
                var selectedRecordValue = currentRecord.getValue({ fieldId: 'custpage_selectrecordfield' });
                var mycustomerSaveSearchList;
                var myItemSaveSearchList;
                if (fieldId === 'custpage_selectrecordfield') {
                    field.removeSelectOption({
                        value: null
                    });
                    field.insertSelectOption({
                        value: '-', text: '-'
                    });
                    if (selectedRecordValue === 'customer') {
                        mycustomerSaveSearchList = search.load({
                            type: search.Type.SAVED_SEARCH,
                            id: 'customsearch_list_customer_save_search'
                        });
                        mycustomerSaveSearchList.run().each(function segmentListResult(result) {
                            field.insertSelectOption({
                                value: result.getValue('id'),
                                text: result.getValue('title')
                            });
                            return true;
                        });
                    } else if (selectedRecordValue === 'item') {
                        myItemSaveSearchList = search.load({
                            type: search.Type.SAVED_SEARCH,
                            id: 'customsearch_list_item_save_search'
                        });
                        myItemSaveSearchList.run().each(function segmentListResult(result) {
                            field.insertSelectOption({
                                value: result.getValue('id'),
                                text: result.getValue('title')
                            });
                            return true;
                        });
                    }
                }
            },
            showErrorMessage: function showErrorMessage(msg) {
                var errMsg = message.create({
                    title: 'Message',
                    message: msg,
                    type: message.Type.ERROR
                });
                errMsg.show();
            },
            saveRecord: function saveRecord(context) {
                var currentRecord = context.currentRecord;
                var recordField = currentRecord.getText({ fieldId: 'custpage_selectrecordfield' });
                var saveSearchField = currentRecord.getText({ fieldId: 'custpage_savesearchfield' });
                var segmentsField = currentRecord.getValue({ fieldId: 'custpage_customersegments' });

                if (recordField === '-') {
                    audienceControlClient.showErrorMessage('Please Select A Record');
                } else if (saveSearchField === '-' || saveSearchField === '') {
                    audienceControlClient.showErrorMessage('Please Select A Save Search');
                } else if (segmentsField[0] === '') {
                    audienceControlClient.showErrorMessage('Please Select A Customer Segments');
                } else {
                    audienceControlClient.showInfoMessage(context);
                }
                return true;
            },
            showInfoMessage: function showInfoMessage(context) {
                var currentRecord = context.currentRecord;
                var link = '<a href="/app/common/scripting/mapreducescriptstatus.nl?whence=">Click Here</a>';
                var myMsg = message.create({
                    title: 'Message',
                    message: currentRecord.getText({ fieldId: 'custpage_selectrecordfield' }) + ' MapReduce script is now processing! To view status ' + link,
                    type: message.Type.INFORMATION
                });
                myMsg.show();
            }
        };
        return {
            fieldChanged: audienceControlClient.fieldChanged,
            saveRecord: audienceControlClient.saveRecord
        };
    });
