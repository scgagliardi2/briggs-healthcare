var Handler = (function(){

    var SUBTAB_SCA_IMAGES = 'custpage_ef_ii_tab',
        FLD_DISPLAY_IMAGES = 'custpage_ef_ii_html',
        HC_SCA_IMAGES = 'SCA Images';

    /* Private */
    

    var displayImagesForSCA = function(form,record)
    {

        var subtabSCAImages = form.addTab(SUBTAB_SCA_IMAGES, HC_SCA_IMAGES),
            fieldDisplayImages = form.addField(FLD_DISPLAY_IMAGES, 'inlinehtml', '', null, SUBTAB_SCA_IMAGES);
            fieldDisplayImages.setDefaultValue(getJavascriptString());
    };

    var getJavascriptString = function(){
        var suiteletUrl = nlapiResolveURL('SUITELET','customscript_ef_ii_sl_item_images','customdeploy_ef_ii_sl_item_images') + '&productid='+nlapiGetRecordId();
        return '<iframe id="ee_ii_suitelet_iframe" src="'+suiteletUrl+'" frameborder="0" style="width:97%;"></iframe>' +
        '<script>function resizeFrameSCAImages(){'+
            'jQuery("#ee_ii_suitelet_iframe").height(jQuery("#ee_ii_suitelet_iframe").contents().height()+20);}'+
        '</script>';      
    };


    /* Public */
    var main  = function(type,form,request){

        var executionContext = nlapiGetContext().getExecutionContext();
        if(executionContext.toString()!=='userinterface') return;

        switch(type.toString()){
            case 'edit':
            case 'view':
                displayImagesForSCA(form,request);
                break;
        }
    };
    return {
        main: main
    };

}());