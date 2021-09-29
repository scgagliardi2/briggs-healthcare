define('CustomerSegments.ProductLine.Stock.View', [
    'ProductLine.Stock.View',
    'PluginContainer',
    'customersegments_product_line_stock.tpl',
    'underscore'
], function CustomerSegmentsItemViewsStockView(
    ItemViewsStock,
    PluginContainer,
    Template,
    _
) {
    'use strict';

    _.extend(ItemViewsStock.prototype, {
        template: Template
    });

    ItemViewsStock.prototype.installPlugin('postContext', {
        name: 'ProductLineStock',
        priority: 10,
        execute: function execute(context, view) {
            _.extend(context, {
                showView: !!_.isUndefined(view.model.get('view'))
            });
        }
    });
});
