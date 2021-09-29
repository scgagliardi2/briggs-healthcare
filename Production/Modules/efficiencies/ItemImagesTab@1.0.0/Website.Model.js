Application.defineModel('Website', {
	listByIds: function(ids)
	{
		var self = this;
		return _.map(ids, function(id){ return self.getById(id);})
	},
	getById: function(id){
		var getPrimaryDomain =  function(record)
		{
	        //For every link on our emails, we need a DOMAIN.
	        //If we have a primary domain, use that. If not, use the first of the website record.
	        var countDomains = record.getLineItemCount('shoppingdomain');
	        var domain;
	        for(var i= 1; i<=countDomains; i++){
	            if(record.getLineItemValue('shoppingdomain','isprimary',i)=='T')
	            {
	                domain = {
	                    fulldomain: 'http://'+ record.getLineItemValue('shoppingdomain','domain',i) + '/',
	                    domain: record.getLineItemValue('shoppingdomain','domain',i),
	                    hostingroot: record.getLineItemValue('shoppingdomain','hostingroot',i),
	                    isprimary: record.getLineItemValue('shoppingdomain','isprimary',i)==='T'
	                }
	            }
	        }

	        //IF we don't have a primary domain, we should be reading the first one of the domains configured
	        if(!domain)
	        {
	            domain = {
	                fulldomain: 'http://'+ record.getLineItemValue('shoppingdomain','domain',1) + '/',
	                domain: record.getLineItemValue('shoppingdomain','domain',1),
	                hostingroot: record.getLineItemValue('shoppingdomain','hostingroot',1),
	                isprimary: record.getLineItemValue('shoppingdomain','isprimary',1)==='T'
	            }
	        }
	        return domain;
    	};

	    var getFullImagePath = function(record)
	    {
	        //This algorithm that looks for the path to the image folder, will only work if the image folder is under "Web Hosting Files"
	        //If not, i'm not sure what would happen
	        var imageFolderId = record.getFieldValue('imagefolder') || '';
	        var pathToImages = '/';
	        while( imageFolderId.indexOf('-')===-1 && imageFolderId!='' )
	        {
	            var j = nlapiLookupField('folder', imageFolderId,['internalid','name','parent','externalid','group','class']);

	            imageFolderId = j.parent.toString();
	            if(j.parent.indexOf('-')===-1 ) { //grandpa shouldn't be "Web Hosting Files"
	                pathToImages = '/' + j.name + pathToImages;
	            }
	        }
	        return pathToImages;
	    };

	    var getResize = function(record){
	    	 

			var countSizes = record.getLineItemCount('imagesize');
	        var resize;
	        for(var i= 1; i<=countSizes; i++){
	            if(record.getLineItemValue('imagesize','imageshdescr',i)=='backendui')
	            {
	                resize = {
	                    imagekey: record.getLineItemValue('imagesize','imagekey',i),
	                    imagemaxheight: record.getLineItemValue('imagesize','imagemaxheight',i),
	                    imagemaxwidth: record.getLineItemValue('imagesize','imagemaxwidth',i),
	                    imageshdescr: record.getLineItemValue('imagesize','imageshdescr',i)
	                }
	            }
	        }

	        //IF we don't have a primary domain, we should be reading the first one of the domains configured
	        if(!resize)
	        {
	            resize = {
	                	imagekey: record.getLineItemValue('imagesize','imagekey',1),
	                    imagemaxheight: record.getLineItemValue('imagesize','imagemaxheight',1),
	                    imagemaxwidth: record.getLineItemValue('imagesize','imagemaxwidth',1),
	                    imageshdescr: record.getLineItemValue('imagesize','imageshdescr',1)
	            }
	        }
	        return resize;
	    };

	    var getImageAssetConfig = function(record)
	    {
	    	var companyId = nlapiGetContext().getCompany();
	    	var domainSetup = getPrimaryDomain(record);
	    	var imageConfig = getFullImagePath(record);
	    	var resize = getResize(record);
	    	var imagePath = '/c.' + companyId + imageConfig+'[[PRODUCT]]' + '?n='+record.getId() + '&c=' + companyId;
	    	imagePath +='&resizeid=' +resize.imagekey + '&resizeh='+resize.imagemaxheight + '&resizew='+resize.imagemaxwidth; 
	    	return {
	    		imagefolder: record.getFieldValue('imagefolder'),
	    		imagefilenameformat: record.getFieldValue('imagefilenameformat'),
		        imageuniquefield: record.getFieldValue('imageuniquefield').toLowerCase(),
		        imageitemfielddelimiter:record.getFieldValue('imageitemfielddelimiter'),
		        imagestructurefielddelimiter: record.getFieldValue('imagestructurefielddelimiter'),
		        imagepath: imagePath

 
	    	}
	    	
	    };

	    var record = nlapiLoadRecord('website', id);

	    return {
	    	internalid: id,
	    	sitetype: record.getFieldValue('sitetype'),
	    	name: record.getFieldValue('internalname'),
	        images: getImageAssetConfig(record)
	        
	    }
	}
});