define('MatrixMultiAdd', [
    'MatrixMultiAdd.View',
    'ProductDetails.Full.View',
    'PluginContainer',
    'SC.Configuration',
    'underscore',
    'MatrixMultiAdd.ItemsKeyMapping',
    'MatrixMultiAdd.Item.Model'
], function MatrixMultiAdd(
    MatrixMultiAddView,
    ProductDetailsFullView,
    PluginContainer,
    Configuration,
    _
) {
    'use strict';

    _.extend(ProductDetailsFullView.prototype.childViews, {
        'ProductDetails.MatrixMultiAdd': function childViewMatrixMultiAdd() {
            return new MatrixMultiAddView({
                model: this.model,
                application: this.application
            });
        }
    });

    return {
        mountToApp: function mountToApp() {
            ProductDetailsFullView.prototype.initialize = _.wrap(ProductDetailsFullView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('beforeCompositeViewRender', function afterViewRender() {
                    if (this.model.get('item').get('_showGrid') === true) {
                        // place the multi add grid under the main content and hide the standard matrix options
                        this.$el.find('.product-details-full-main-content')
                                .after('<div data-view="ProductDetails.MatrixMultiAdd"/>');
                        this.$el.find('[data-view="Product.Options"],' +
                                    '.product-details-full-actions,' +
                                    '[data-view="Quantity.Pricing"],' +
                                    '[data-view="Quantity"]')
                                .remove();
                    }
                });
            });
        }
    };
});
