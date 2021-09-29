define('ProductComparison.Router', [
    'Backbone',
    'ProductComparison.Dashboard.View',
    'ProductComparison.Collection',
    'underscore'
], function ProductComparisonRouter(
    Backbone,
    DashboardView,
    Collection,
    _
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            'productcomparison?*querystring': 'productsToCompareFilteredList'
        },

        // @method initialize
        initialize: function initialize(application) {
            this.application = application;
        },

        // @method ProductsToCompareFilteredList
        productsToCompareFilteredList: function productsToCompareFilteredList(querystring) {
            var params = this.parseQueryString(querystring);
            var collection = new Collection(params);
            var view = new DashboardView({
                collection: collection,
                application: this.application
            });

            collection.fetch().done(function fetchCollection() {
                view.showContent();
            });
        },

        // @method parseQueryString
        /* Parse QueryString using String Splitting */
        parseQueryString: function parseQueryString(queryString) {
            var parts = queryString.split('&');
            var arr = [];

            _.each(parts, function eachParts(part) {
                var val = part.split('=')[1];
                arr.push(val);
            });

            return arr;
        }
    });
});
