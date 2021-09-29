Application.defineModel('Item', {
	findTypeAndParent: function(id)
	{
		var data = nlapiLookupField('item',id, ['type','parent']);
		var typemap = { 'Service' : 'serviceitem', 'InvtPart' : 'inventoryitem', 'Group' : 'itemgroup', 'NonInvtPart' : 'noninventoryitem' };

		return {
			type: typemap[data.type],
			parent: data.parent
		};
	},
	getWithFields: function(id,extraFields)
	{
		var type = this.findTypeAndParent(id);
		if(type.parent) {
			var record = nlapiLoadRecord(type.type, type.parent);
		}
		else {
			var record = nlapiLoadRecord(type.type, id);
		}
		var retObj = {};



		_.extend(retObj, {
			internalid: record.getFieldValue('internalid'),
			files: this.getFiles(record)
		});

		_.each(extraFields, function(extraField){
			retObj[extraField] = record.getFieldValue(extraField);
		});
		return retObj;

	},
	getFiles: function(record)
	{
	 
		var files = {};
		for(var i = 1; i <= record.getLineItemCount('itemimages'); i++) 
		{
        	files[record.getLineItemValue('itemimages', 'nkey', i).toString()] = {
        		id: record.getLineItemValue('itemimages', 'nkey', i),
        		filename: internalid = record.getLineItemValue('itemimages', 'name', i)
        	};
    	}

    	var ids = _.pluck(files,'id');

    	if(ids.length){

	    	var searchFolders = nlapiSearchRecord(
	    		'file', 
	    		null, 
	    		[new nlobjSearchFilter('internalid',null,'anyof',ids)],
	    		[new nlobjSearchColumn('internalid'),new nlobjSearchColumn('folder')]
	    	);


	    	_.each(searchFolders, function(f){
	    		files[f.getValue('internalid').toString()] && (files[f.getValue('internalid')].folder = f.getValue('folder'));
	    	});
    	}

    	return _.values(files).sort(function(a,b){
    		return a.folder >= b.folder;
    	});


	}
});