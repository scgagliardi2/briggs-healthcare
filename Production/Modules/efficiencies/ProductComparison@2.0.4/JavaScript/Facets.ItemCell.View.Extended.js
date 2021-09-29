define('Facets.ItemCell.View.Extended', [
    'Facets.ItemCell.View',
    'SC.Configuration',
    'ProductComparison.Helper',
    'underscore',
    'jquery.cookie'
], function FacetsItemCellViewExtended(
    FacetsItemCellView,
    Configuration,
    ProductComparisonHelper,
    _
) {
    'use strict';

    var ProductComparisonConfig = Configuration.get('productComparison');

    if (ProductComparisonConfig && ProductComparisonConfig.enabled) {
        _.extend(FacetsItemCellView.prototype, {
            initialize: _.wrap(FacetsItemCellView.prototype.initialize, function FacetsItemCellViewPrototypeInitialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('afterViewRender', function afterViewRender() {
                    var checkForCompare = this.checkForAddToCompare();
                    var itemId = this.model.get('_id');
                    var divStr = '<div class="facets-item-cell-addtocompare"><input type="checkbox" class="facets-item-cell-addtocompare-ckbox" value="';
                    divStr += itemId + '" data-action="add-to-compare" data-item-id="' + itemId + '" name="" value="' + itemId + '"> ';
                    divStr += _.translate('Add to Compare') + '</div>';
                    if (checkForCompare) {
                        divStr = '<div class="facets-item-cell-addtocompare"><input type="checkbox" class="facets-item-cell-addtocompare-ckbox" value="';
                        divStr += itemId + '" data-action="add-to-compare" data-item-id="' + itemId + '" name="" value="' + itemId + '" checked="checked"> ';
                        divStr += _.translate('Add to Compare') + '</div>';
                    }
                    this.$el
                        .find('[data-view="ItemDetails.Options"]')
                        .before(divStr);
                });
            }),

            // @method FacetsItemCellView.prototype.getContext
            getContext: _.wrap(FacetsItemCellView.prototype.getContext, function FacetsItemCellViewPrototypeGetContext(fn) {
                var context = fn.apply(this, _.toArray(arguments).slice(1));
                context.checkForAddToCompare = this.checkForAddToCompare();
                return context;
            }),

            // @method checkForAddToCompare
            checkForAddToCompare: function checkForAddToCompare() {
                var itemId = this.model.get('_id');
                var index;
                var willBeAddedToCompare = false;
                var existingProductToCompareIDs = _.pluck(ProductComparisonHelper.getSessionCookieProductIDs(), 'id');

                index = existingProductToCompareIDs.indexOf(itemId);
                if (index > -1) {
                    willBeAddedToCompare = true;
                }
                return willBeAddedToCompare;
            }
        });
    }
});
