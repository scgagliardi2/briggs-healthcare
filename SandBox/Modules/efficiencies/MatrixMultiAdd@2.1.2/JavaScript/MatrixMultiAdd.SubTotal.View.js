define('MatrixMultiAdd.SubTotal.View', [
    'Backbone',
    'MatrixMultiAdd.Item.HashMap',
    'GlobalViews.Message.View',
    'matrix_multi_add_subtotal_view.tpl',
    'underscore',
    'Utils'
], function MatrixMultiAddRowSubTotalView(
    Backbone,
    MatrixMultiAddItemHashMap,
    GlobalViewsMessageView,
    Template,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,
        initialize: function initialize(options) {
            this.itemsForCart = options.itemsForCart;
        },
        getContext: function getContext() {
            return {
                total: _.formatCurrency(this.itemsForCart.getTotal()),
                isReadyForCart: this.itemsForCart.getTotal() !== 0
            };
        }
    });
});
