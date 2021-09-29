define('CustomerSegments', [
    'CustomerSegments.Helper',

    'LiveOrder.Model',

    'Item.Collection',
    'ItemRelations.Related.Collection',
    'ItemRelations.Correlated.Collection',

    'CustomerSegments.ProductViews.Price.View',

    'jQuery',

    'CustomerSegments.ProductDetails.Router',
    'CustomerSegments.Facets.Router',
    'CustomerSegments.Categories',
    'CustomerSegments.OrderHistory.Packages.View',
    'CustomerSegments.ProductLine.Stock.View',
    'CustomerSegments.Header.Logo.View',
    'CustomerSegments.Home.View',
    'CustomerSegments.Checkout.Step',
    'CustomerSegments.Transaction.Line.Views.Cell.Navigable.View',
    'Utils'
], function CustomerSegments(
    Helper,

    LiveOrderModel,

    ItemCollection,
    ItemRelationsRelatedCollection,
    ItemRelationsCorrelatedCollection,

    CustomerSegmentsProductViewsPriceView,

    jQuery
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            Helper.filterCollection(ItemCollection);
            // Filter related items base on customer groups
            Helper.filterCollection(ItemRelationsRelatedCollection, 'relateditems_detail');
            // Filter correlated items base on customer groups
            Helper.filterCollection(ItemRelationsCorrelatedCollection, 'correlateditems_detail');
            // Filter items base on customer groups that have been added to cart
            Helper.filterCart(LiveOrderModel);

            jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupsInfo(response) {
                if (response.isHidePrices && response.isHideAddtoCart) {
                    CustomerSegmentsProductViewsPriceView.hidePrice(response.isHidePrices);
                    CustomerSegmentsProductViewsPriceView.hideAddToCart(response.isHideAddtoCart);
                }
            });

            application.getLayout().on('beforeAppendView', function applicationGetLayout() {
                // Check if Facets is already been add to searchApiMasterOptions
                if (!Helper.inFacets('custitem_item_customersegments')) {
                    // Update searchApiMasterOptions to add Customer Segment Facets
                    Helper.addToSearchApiMasterOptions();
                }
            });
        }
    };
});
