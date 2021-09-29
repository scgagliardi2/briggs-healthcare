define('ItemBadges.Model', [
    'Backbone.CachedModel',
    'underscore',
    'Utils'
], function ItemBadgesModel(
    CachedModel,
    _
) {
    'use strict';

    return CachedModel.extend({
        urlRoot: _.getAbsoluteUrl('services/ItemBadges.Service.ss')
    });
});
