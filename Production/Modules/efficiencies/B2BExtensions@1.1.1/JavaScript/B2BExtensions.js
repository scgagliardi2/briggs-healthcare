
define('B2BExtensions', [
    'SC.Configuration',
    'underscore',
    'ItemsSearcher.View.ChangePlaceholder',
    'ProductLine.Sku.View.AddFields'
], function B2BExtensions(
    Configuration,
    _
) {
    'use strict';

    var modules = _.toArray(arguments);

    return {
        mountToApp: function mountToApp() {
            if (Configuration.get('quickStart.bTobExtensions.enabled')) {
                modules.forEach(function forEach(module) {
                    if (module.b2bLoadModule) module.b2bLoadModule();
                });
            }
        }
    };
});
