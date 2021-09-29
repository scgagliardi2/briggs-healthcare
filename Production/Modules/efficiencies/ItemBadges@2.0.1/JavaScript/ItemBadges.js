define('ItemBadges', [
    'SC.Configuration',
    'ItemBadges.Helper',

    'ProductDetails.Full.View',
    'ProductDetails.QuickView.View',
    'Facets.ItemCell.View',
    'ItemRelations.RelatedItem.View',

    'underscore'
], function ItemBadges(
    Configuration,
    Helper,

    ProductDetailsFullView,
    ProductDetailsQuickViewView,
    FacetsItemCellView,
    ItemRelationsRelatedItemView,

    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            var moduleConfig = Configuration.get('itemBadges');

            if (moduleConfig.showInFacet) {
                Configuration.facets.push({
                    id: 'custitem_ef_badges',
                    priority: 20,
                    behavior: 'multi',
                    name: _(moduleConfig.facetName).translate()
                });
            }

            Helper.addChildView(ProductDetailsFullView, {
                target: '[data-view="Product.ImageGallery"]',
                viewClass: 'itembadges-itemdetail'
            });

            Helper.addChildView(ProductDetailsQuickViewView, {
                target: '[data-view="Product.ImageGallery"]',
                viewClass: 'itembadges-itemdetail'
            });

            Helper.addChildView(FacetsItemCellView, {
                target: '.facets-item-cell-grid-link-image,' +
                '.facets-item-cell-list-image, .facets-item-cell-table-link-image',
                viewClass: 'itembadges-listitem'
            });

            Helper.addChildView(ItemRelationsRelatedItemView, {
                target: '.item-relations-related-item-thumbnail',
                viewClass: 'itembadges-relateditem'
            });
        }
    };
});
