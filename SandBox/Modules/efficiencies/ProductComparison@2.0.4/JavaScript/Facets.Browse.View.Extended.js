// @module Facets.Browse.View.Extended
define('Facets.Browse.View.Extended', [
    'Facets.Browse.View',
    'Facets.AddedForComparison.View',
    'ProductComparison.Helper',
    'SC.Configuration',
    'underscore',
    'jQuery',
    'jquery.cookie'
], function FacetsBrowseViewExtended(
    FacetsBrowseView,
    AddedForComparisonView,
    ProductComparisonHelper,
    Configuration,
    _,
    jQuery
) {
    'use strict';

    var ProductComparisonConfig = Configuration.get('productComparison');

    if (ProductComparisonConfig && ProductComparisonConfig.enabled) {
        _.extend(FacetsBrowseView.prototype, {
            events: _.extend(FacetsBrowseView.prototype.events, {
                'click [data-action="add-to-compare"]': 'updateAddedForComparison'
            }),

            // @method ChildView-AddedForComparison
            childViews: _.extend(FacetsBrowseView.prototype.childViews, {
                'AddedForComparison': function facetsBrowseChildView() {
                    return new AddedForComparisonView({ parentView: this });
                }
            }),

            initialize: _.wrap(FacetsBrowseView.prototype.initialize, function facetsBrowseViewInitialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('beforeCompositeViewRender', function beforeCompositeViewRender() {
                    this.$el
                      .find('[data-view="GlobalViews.Pagination"], [data-view="Facets.Items.Empty"]')
                      .after('<div class="facets-facet-browse-added-for-comparison" ' +
                                'data-view="AddedForComparison" style="display: none"></div>');
                });
                this.on('afterCompositeViewRender', function afterCompositeViewRender() {
                    _.defer(function deferRender() {
                        var existingProductToCompare = ProductComparisonHelper.getSessionCookieProductIDs();
                        if (existingProductToCompare && existingProductToCompare.length > 0) {
                            jQuery('[data-view="AddedForComparison"]').show();
                            jQuery('.compare-items-container-hide-button').addClass('active');
                            jQuery('.compare-items-container').hide();
                        } else {
                            jQuery('[data-view="AddedForComparison"]').hide();
                        }
                    });
                });
            }),

            // @method updateAddedForComparison
            updateAddedForComparison: function updateAddedForComparison(e) {
                var allowAddToCompare;
                var itemId;

                if (e && e.currentTarget.checked === true) {
                    allowAddToCompare = this.allowAddToCompare();
                    if (allowAddToCompare === true) {
                        itemId = jQuery(e.target).data('item-id');
                        this.addProductIdsToCompare(itemId);
                        this.getChildViewInstance('AddedForComparison').render();
                    } else {
                        e.preventDefault();
                        alert(_.translate('Can no longer add this product, only a maximum of 4 products are allowed!')); // eslint-disable-line no-alert
                    }
                } else if (e && e.currentTarget.checked === false) {
                    itemId = jQuery(e.target).data('item-id');
                    this.removeProductIdsFromCompare(itemId);
                    this.getChildViewInstance('AddedForComparison').render();
                }
            },

            // @method allowAddToCompare
            allowAddToCompare: function allowAddToCompare() {
                var existingProductToCompareIDs = _.pluck(ProductComparisonHelper.getSessionCookieProductIDs(), 'id');
                var allowAddtoCompare = existingProductToCompareIDs.length < 4;

                return allowAddtoCompare;
            },

            // @method addProductIdsToCompare
            addProductIdsToCompare: function addProductIdsToCompare(id) {
                // Check to see if passed in id already exist or not, if not add to the selection
                var self = this;
                var index;
                var sessionProducts = ProductComparisonHelper.getSessionCookieProductIDs();
                var existingProductToCompareIDs = _.pluck(sessionProducts, 'id');

                index = existingProductToCompareIDs.indexOf(id);
                if (existingProductToCompareIDs.length < 4) {
                    if (index === -1) {
                        // Doesnt exist proceed to add to the list
                        _.map(self.model.get('items').models, function mappedItem(item) {
                            if (item.id === id) {
                                sessionProducts.push({
                                    id: item.get('_id'),
                                    url: item.get('_thumbnail').url,
                                    name: item.get('_name')
                                });
                            }
                        });
                        jQuery('[data-view="AddedForComparison"]').show();
                    }

                    // Proceed to set product comparison IDs as a string in session cookie
                    jQuery.cookie('NS_ProductComparisonIDs', JSON.stringify(sessionProducts));
                }
                return existingProductToCompareIDs;
            },

            // @method removeProductIdsFromCompare
            removeProductIdsFromCompare: function removeProductIdsFromCompare(id) {
                var index;
                var newProductToCompareIDsStr;

                var existingProductToCompareIDs = _.pluck(ProductComparisonHelper.getSessionCookieProductIDs(), 'id');
                var existingProductToCompare = ProductComparisonHelper.getSessionCookieProductIDs();

                index = existingProductToCompareIDs.indexOf(id);
                if (index >= -1) {
                    existingProductToCompareIDs.splice(index, 1);
                    existingProductToCompare.splice(index, 1);
                    if (existingProductToCompareIDs.length <= 0) {
                        jQuery('[data-view="AddedForComparison"]').hide();
                    }

                    newProductToCompareIDsStr = JSON.stringify(existingProductToCompare);
                    jQuery.cookie('NS_ProductComparisonIDs', newProductToCompareIDsStr);
                }
            }
        });
    }
});
