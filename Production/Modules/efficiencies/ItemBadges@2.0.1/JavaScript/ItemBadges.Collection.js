define('ItemBadges.Collection', [
    'Backbone',
    'Backbone.CachedCollection',
    'ItemBadges.Model',
    'underscore'
], function ItemBadgesCollection(
    Backbone,
    BackboneCachedCollection,
    Model,
    _
) {
    'use strict';

    return BackboneCachedCollection.extend({
        model: Model,

        url: _.getAbsoluteUrl('services/ItemBadges.Service.ss'),

        filterBadges: function filterBadges(badges) {
            var self = this;
            var itemBadges;
            var data;

            if (badges) {
                itemBadges = badges.split(',');
                _.each(itemBadges, function each(value, key) {
                    itemBadges[key] = value.trim();
                });

                data = _.filter(self.models, function filter(badge) {
                    return _.contains(itemBadges, badge.get('name').trim());
                });
            }

            return new Backbone.Collection(data);
        }
    });
});
