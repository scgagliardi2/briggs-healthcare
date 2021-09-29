define('DisplayProductLeadTime.View', [
    'Backbone',
    'display_product_lead_time.tpl',
    'underscore'
], function DisplayProductLeadTimeView(
    Backbone,
    Template,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,

        initialize: function initialize(options) {
            this.model = options.model;
            this.application = options.application;

            this.listenToOnce(this.model, 'sync', this.render);

            this.model.fetch({
                data: {
                    itemId: options.id
                }
            });
        },

        getContext: function getContext() {
            var message = 'Expected back in stock';
            var showLeadTime = false;

            if (this.model.get('purchaseOrder') && this.model.get('leadTime')) {
                showLeadTime = true;
            }

            return {
                msgOutOfStock: _.translate(message),
                outOfStockDate: this.model.getLeadTime(),
                showLeadTime: showLeadTime
            };
        }
    });
});
