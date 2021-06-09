define('ItemBadges.List.View', [
    'Backbone',
    'itembadges_list.tpl',
    'Utils'
], function ItemBadgesListView(
    Backbone,
    Template
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,

        initialize: function initialize(options) {
            this.model = options.model;
        },

        getContext: function getContext() {
            return {
                model: this.model,
                bgcolor: this.model.get('bgColor'),
                name: this.model.get('name'),
                icon: this.model.get('icon'),
                weight: this.model.get('weight'),
                alt: this.model.get('alt'),
                showIcon: this.model.get('icon').internalid || false,
                showText: (!this.model.get('icon').internalid)
            };
        }
    });
});
