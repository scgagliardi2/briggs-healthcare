// module ProductComparison
define('ProductComparison', [
    'Backbone',
    'SC.Configuration',
    'ProductComparison.Router',
    'underscore',
    'Utils',
    'Facets.Browse.View.Extended',
    'Facets.ItemCell.View.Extended'
], function ProductComparison(
    Backbone,
    Configuration,
    Router
) {
    'use strict';

    var ProductComparisonConfig = Configuration.get('productComparison');

    if (ProductComparisonConfig && ProductComparisonConfig.enabled) {
        return {
            mountToApp: function mountToApp(application) {
                var layout = application.getLayout();

                layout.goToProductComparison = function goToProductComparison() {
                    Backbone.history.navigate('productcomparison', { trigger: true });
                };
                return new Router(application);
            }
        };
    }
});
