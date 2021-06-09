define('ItemBadges.View', [
    'Backbone',
    'Backbone.CollectionView',

    'ItemBadges.List.View',
    'itembadges_view.tpl'
], function ItemBadgesView(
    Backbone,
    CollectionView,

    ItemBadgesList,
    Template
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,

        initialize: function initialize(options) {
            this.application = options.application;
            this.model = options.model;
            this.collection = options.collection;

            this.listenToOnce(this.collection, 'sync', this.render);

            this.collection.fetch();
        },

        getContext: function getContext() {
            var item = this.model.get('item') || this.model;

            this.badgeCollection = this.collection.filterBadges(item.get('custitem_ef_badges') || false);
            return {
                hasBadges: !!this.badgeCollection.length
            };
        },

        childViews: {
            'Itembadges.List.View': function ItembadgesLisView() {
                return new CollectionView({
                    collection: this.badgeCollection,
                    childView: ItemBadgesList
                });
            }
        }
    });
});
