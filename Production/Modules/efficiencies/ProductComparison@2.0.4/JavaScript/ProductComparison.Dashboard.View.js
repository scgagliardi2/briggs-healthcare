define('ProductComparison.Dashboard.View', [
    'Backbone',
    'Backbone.CollectionView',
    'Backbone.CompositeView',
    'ProductComparison.Helper',
    'productcomparison_dashboard.tpl',
    'underscore',
    'SC.Configuration',
    'jQuery'
], function ProductComparisonDashboardView(
    Backbone,
    BackboneCollectionView,
    BackboneCompositeView,
    ProductComparisonHelper,
    Template,
    _,
    Configuration,
    jQuery
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,
        events: {
            'click [data-action="remove-from-productcomparison"]': 'removeFromProductComparison',
            'click [data-action="share-productcomparison"]': 'shareProductComparison'
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _('Compare Products').translate()
            }];
        },

        // @method initialize
        initialize: function initialize(options) {
            BackboneCompositeView.add(this);
            this.application = options.application;
            this.collection = options.collection;
            this.listenTo(this.collection, 'all', this.updateProductComparisonSessionCookie);
        },

        // @method getContext
        getContext: function getContext() {
            // console.log('test', this.collection.getMappedValuesToProperties());
            return {
                itemProperties: this.collection.getMappedValuesToProperties(),

                // @property {String} iconClass
                buttonColor: '#' + Configuration.get('productComparison.buttonColor'),

                // @property {String} title
                PropertyLabelColor: '#' + Configuration.get('productComparison.PropertyLabelColor')
            };
        },

        // @method setProductComparisonSessionCookie
        updateProductComparisonSessionCookie: function updateProductComparisonSessionCookie() {
            var self = this;
            var existingCookieProductIDs;
            var urlProductIDs;
            var sessionProducts = [];
            // If cookie exists we need to check the existing URL is the same as cookie
            existingCookieProductIDs = _.pluck(ProductComparisonHelper.getSessionCookieProductIDs(), 'id');

            // Get the current IDs fomr the URL
            urlProductIDs = ProductComparisonHelper.getQueryStrProductIDs();

            // If the cookies are different, proceed to reset the cookies from the URL
            if (((existingCookieProductIDs.length === urlProductIDs.length &&
                _.difference(existingCookieProductIDs, urlProductIDs).length !== 0)) ||
                (existingCookieProductIDs.length === 0) ||
                ((existingCookieProductIDs.length !== urlProductIDs.length) && urlProductIDs.length > 0)
                ) {
                self.collection.each(function traverseCollection(item) {
                    sessionProducts.push({
                        id: item.get('_id'),
                        url: item.get('_thumbnail').url,
                        name: item.get('_name')
                    });
                });


                ProductComparisonHelper.setProductComparisonSessionCookie(sessionProducts);
            }
        },

        // @method removeFromProductComparison
        removeFromProductComparison: function removeFromProductComparison(e) {
            var itemIdStr;
            var itemId = jQuery(e.target).data('itemid');
            var comparisonProductIDs;
            var removeIndex;
            var productComparisonIDsStr;
            var routeStr;
            var i;
            e.preventDefault();


            if (itemId) itemIdStr = itemId.toString();

            // Call function retrieveProductsToCompare to get product for comparison
            comparisonProductIDs = ProductComparisonHelper.getQueryStrProductIDs();

            // Find a match proceed to remove the matching ID from comparing product list
            removeIndex = comparisonProductIDs.indexOf(itemIdStr);
            if (removeIndex > -1) comparisonProductIDs.splice(removeIndex, 1);

            // Store it back to session cookie
            productComparisonIDsStr = JSON.stringify(comparisonProductIDs);
            jQuery.cookie('NS_ProductComparisonIDs', productComparisonIDsStr);

            // Follow by action to either reRender the page or navigate back to previous page
            if (comparisonProductIDs && comparisonProductIDs.length > 0) {
                routeStr = '#productcomparison?';
                for (i = 0; i < comparisonProductIDs.length; i++) {
                    if (i === comparisonProductIDs.length - 1) {
                        routeStr += 'id=' + comparisonProductIDs[i];
                    } else {
                        routeStr += 'id=' + comparisonProductIDs[i] + '&';
                    }
                }
                // Refresh the current page with new Query Strings
                Backbone.history.navigate(routeStr, { trigger: true });
            } else {
                // Return back to the search result if no products left
                Backbone.history.navigate('#search', { trigger: true });
            }
        },

        // @method shareProductComparison
        shareProductComparison: function shareProductComparison(e) {
            var url = encodeURIComponent(window.location);
            e.preventDefault();
            window.location = 'mailto:?subject=Check out the product comparisons via the URL in the email body&body=' + url;
        }
    });
});
