define('CustomerSegments.Model', [
    'Backbone.CachedModel',
    'Utils'
], function CustomerSegmentModel(
    CachedModel,
    Utils
) {
    'use strict';

    return CachedModel.extend({
        urlRoot: Utils.getAbsoluteUrl('services/CustomerSegments.Service.ss')
    });
});
