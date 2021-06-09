var Handler = (function(){


    function getWebsitesByImageFolder(websites){
        var websitesByImageFolder = {};
        _.each(websites,function(ws){ 
            websitesByImageFolder[ws.images.imagefolder] = websitesByImageFolder[ws.images.imagefolder] || [];
            websitesByImageFolder[ws.images.imagefolder].push(ws);
        });
        return websitesByImageFolder;
    }
    function getTemplate(){

        var search = nlapiSearchRecord('file',null,new nlobjSearchFilter('name',null,'is','EF II SL - Gallery Template.html'),new nlobjSearchColumn('internalid'));
        var fileId = search && search[0].getValue('internalid');
        var tplFile = nlapiLoadFile(fileId);
        return _.template(tplFile.getValue());
    }

    var getWebsitesSettings = function(websiteIds)
    {
        var WebsiteModel = Application.getModel('Website');
        return WebsiteModel.listByIds(websiteIds);


    };
    var getValidationErrors = function(websites,item)
    {
        /*
         imagefolder: record.getFieldValue('imagefolder'),
         imagefilenameformat: record.getFieldValue('imagefilenameformat'),
         imageuniquefield: record.getFieldValue('imageuniquefield'),
         imageitemfielddelimiter:record.getFieldValue('imageitemfielddelimiter'),
         imagestructurefielddelimiter: record.getFieldValue('imagestructurefielddelimiter'),
         imagepath: imagePath
         */
        var validationErrors = [];
        _.each(websites,function(website){

          	nlapiLogExecution('ERROR', 'website', JSON.stringify(website));

            nlapiLogExecution('ERROR', 'item', JSON.stringify(item));
          
            var errorStart = 'Website ' + website.name + '('+ website.internalid +')' + ' ';
            if(website.sitetype!='ADVANCED'){
                validationErrors.push(errorStart + ' is not a SuiteCommerce Advanced');
            }
            if(!website.images.imagefolder){
                validationErrors.push(errorStart + ' needs the image folder');
            }

            if(!website.images.imageuniquefield){
                validationErrors.push(errorStart + ' needs the image field specified');
            }

            if(!item[website.images.imageuniquefield]){
                validationErrors.push('This item needs a ' + website.images.imageuniquefield + ' to work for '+errorStart);
            }
        });

        return validationErrors;
    };

    var showItemImages = function(request,response)
    {

        var productId = request.getParameter('productid');
        var ItemModel = Application.getModel('Item');

        if(!productId)
        {
            throw nlapiCreateRecord('Product id not specified');
        }

        var item = ItemModel.getWithFields(productId, allNamingConventionFields);
        var validationErrors = getValidationErrors(websitesSettings,item);

        if( validationErrors.length === 0 ) {
            var websitesByImageFolder = getWebsitesByImageFolder(websitesSettings);
            nlapiLogExecution('ERROR', 'websitesByImageFolder', JSON.stringify(websitesByImageFolder));
            response.write(template({
                item: item,
                websites: websitesByImageFolder
            }));
        } else {
            _.each(validationErrors, function(validationError){
                response.write(validationError+'<br/>')
            });
        }

    };

    var context = nlapiGetContext();
    var scaWebsiteIds = (context.getSetting('SCRIPT','custscript_ef_ii_sl_website') || '2').split(',');
    var websitesSettings = getWebsitesSettings(scaWebsiteIds);
    var allNamingConventionFields = _.unique(_.compact(_.map(websitesSettings,function(ws){ return ws.images.imageuniquefield})));
    var template = getTemplate();
  
  allNamingConventionFields = _.map(allNamingConventionFields, function(field){
    
    return field.toLowerCase();
    
  });
  
  nlapiLogExecution('ERROR', 'allNamingConventionFields', JSON.stringify(allNamingConventionFields));

    var uploadImages = function(request,response)
    {
               
        var folder = request.getParameter('folder');
        var filesQty = request.getParameter('filesQty');

        for(var i = 0; i<filesQty; i++)
        {
            var file = request.getFile("file"+i);
             file.setFolder(folder);
            var id = nlapiSubmitFile(file); 
        }

    };

    
    /* Public */
    var main  = function(request,response)
    {
        var method = request.getMethod();
        switch(method.toString())
        {
            case 'POST':
                uploadImages(request,response);
                break;
            
            case 'GET':
            default:
                showItemImages(request,response);
                break;
        }
        
    };

    return {
        main: main
    };

}());





