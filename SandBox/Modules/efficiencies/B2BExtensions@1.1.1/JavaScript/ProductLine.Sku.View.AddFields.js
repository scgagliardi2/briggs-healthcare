
define('ProductLine.Sku.View.AddFields', [
    'SC.Configuration',
    'ProductLine.Sku.View',
    'jQuery',
    'underscore',
    'Utils'
], function ProductLineSkuViewAddFields(
    Configuration,
    View,
    jQuery,
    _
) {
    'use strict';

    return {
        b2bLoadModule: function b2bLoadModule() {
            var fieldsToDisplay = Configuration.get('quickStart.bTobExtensions.displayWithSKU');
            if (fieldsToDisplay && fieldsToDisplay.length > 0) {
                View.prototype.initialize = _.wrap(View.prototype.initialize, function initialize(fn) {
                    fn.apply(this, _.toArray(arguments).slice(1));
                    this.on('afterViewRender', function afterViewRender(view) {
                        var skuContainer = view.$el.find('.product-line-sku-container');
                        fieldsToDisplay.forEach(function forEach(field) {
                            var label;
                            var value = _('$(0)').translate(view.model.get('item').get(field.id));
                            if (value) {
                                label = _('$(0): ').translate(field.label || field.id);
                                skuContainer.append(jQuery('<div class="b2b-extension-sku-container"/>')
                                                    .append('<span class="b2b-extension-sku-label">' + label + '</span>')
                                                    .append('<span class="b2b-extension-sku-value" itemprop="' + field.id + '">' + value + '</span>'));
                            }
                        });
                    });
                });
            }
        }
    };
});
