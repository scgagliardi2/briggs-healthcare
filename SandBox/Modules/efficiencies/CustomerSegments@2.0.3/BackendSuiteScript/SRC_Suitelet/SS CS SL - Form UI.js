/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define([
    'N/ui/serverWidget',
    'N/search',
    'N/task',
    'N/redirect',
    'N/runtime',
    '../Configuration/SS CS - Backend Configuration'
],
    function CustomerSegmentBackendUI(
        serverWidget,
        search,
        task,
        redirect,
        runtime,
        configuration
) {
        var myCustomerSegmentsResult = [];
        var audienceControlForm = {
            onRequest: function onRequest(context) {
                var form;
                var selectRecordfield;
                var saveSearchField;
                var customersegments;
                var scriptTask;
                var remainSegments;
                form = serverWidget.createForm({
                    title: 'Customer Segments Mass Update'
                });

                if (context.request.method === 'GET') {
                    // trigger client script
                    form.clientScriptFileId = configuration.clientScriptFileId;

                    selectRecordfield = form.addField({
                        id: 'custpage_selectrecordfield',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Select Record'
                    });
                    selectRecordfield.addSelectOption({
                        value: '-',
                        text: '-'
                    });
                    selectRecordfield.addSelectOption({
                        value: 'item',
                        text: 'Item'
                    });
                    selectRecordfield.addSelectOption({
                        value: 'customer',
                        text: 'Customer'
                    });
                    saveSearchField = form.addField({
                        id: 'custpage_savesearchfield',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Select Save Search'
                    });
                    remainSegments = form.addField({
                        id: 'custpage_remainsegments',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Keep Existing Segments'
                    });
                    customersegments = form.addField({
                        id: 'custpage_customersegments',
                        type: serverWidget.FieldType.MULTISELECT,
                        label: 'Select Customer Segments'
                    });
                    util.each(audienceControlForm.customerSegmentsList(), function optionValueListResult(optionValueList) {
                        customersegments.addSelectOption({
                            value: optionValueList.id,
                            text: optionValueList.name
                        });
                    });
                    form.addSubmitButton({
                        label: 'Submit'
                    });
                    context.response.writePage(form);
                } else {
                    remainSegments = context.request.parameters.custpage_remainsegments;
                    saveSearchField = context.request.parameters.custpage_savesearchfield;
                    customersegments = context.request.parameters.custpage_customersegments;
                    selectRecordfield = context.request.parameters.custpage_selectrecordfield;

                    scriptTask = task.create({ taskType: task.TaskType.MAP_REDUCE });
                    scriptTask.scriptId = 'customscript_ss_cs_mr_update_customer';
                    scriptTask.deploymentId = 'customdeploy_ss_cs_mr_update_customer';

                    scriptTask.params = {
                        custscript_ss_cs_mr_customersegments: customersegments,
                        custscript_ss_cs_mr_savesearchfieldid: saveSearchField,
                        custscript_ss_cs_mr_selected_rec: selectRecordfield,
                        custscript_ef_map_remain_cs: remainSegments
                    };

                    if (saveSearchField !== '-' && customersegments !== '' && selectRecordfield !== '-') {
                        try {
                            // redirect to main page
                            scriptTask.submit();
                            redirect.toSuitelet({
                                scriptId: 'customscript_ss_cs_sl_form_ui',
                                deploymentId: 'customdeploy_ss_cs_sl_form_ui'
                            });
                        } catch (e) {
                            context.response.write('MapReduce Script is still running Check Map Reduce Status ' +
                                '<a target="_blank" href="/app/common/scripting/mapreducescriptstatus.nl?whence=">Click Here</a>'
                            );
                        }
                    } else {
                        redirect.toSuitelet({
                            scriptId: 'customscript_ss_cs_sl_form_ui',
                            deploymentId: 'customdeploy_ss_cs_sl_form_ui'
                        });
                    }
                }
            },
            customerSegmentsList: function customerSegmentsList() {
                var mycustomerSegmentsList = search.load({
                    id: 'customsearch_ef_customer_segments_group',
                    columns: ['groupname']
                });
                mycustomerSegmentsList.run().each(function segmentListResult(result) {
                    myCustomerSegmentsResult.push({
                        id: result.id,
                        name: result.getValue('groupname')
                    });
                    return true;
                });
                return myCustomerSegmentsResult;
            }
        };

        return {
            onRequest: audienceControlForm.onRequest
        };
    });
