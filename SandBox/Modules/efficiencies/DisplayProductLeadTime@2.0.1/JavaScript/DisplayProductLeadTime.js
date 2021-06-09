define('DisplayProductLeadTime', [
    'ProductDetails.Full.View',
    'DisplayProductLeadTime.Model',
    'DisplayProductLeadTime.View',
    'underscore'
], function DisplayProductLeadTime(
    ProductDetailsFullView,
    DisplayProductLeadTimeModel,
    DisplayProductLeadTimeView,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            ProductDetailsFullView.prototype.initialize =
                _.wrap(ProductDetailsFullView.prototype.initialize, function prototypeInitialize(fn) {
                    fn.apply(this, _.toArray(arguments).slice(1));

                    this.on('beforeCompositeViewRender', function afterViewRender() {
                        if (!this.model.getStockInfo().isInStock) {
                            this.$el
                                .find('.product-details-full-main [data-view="Product.Stock.Info"]')
                                .after('<div data-view="display.product.lead.time"></div>');
                        }
                    });
                });

            _.extend(ProductDetailsFullView.prototype.childViews, {
                'display.product.lead.time': function ChildViewDisplayProductLeadTime() {
                    return new DisplayProductLeadTimeView({
                        model: new DisplayProductLeadTimeModel(),
                        application: application,
                        id: this.model.get('item').get('_id')
                    });
                }
            });
        }
    };
});
