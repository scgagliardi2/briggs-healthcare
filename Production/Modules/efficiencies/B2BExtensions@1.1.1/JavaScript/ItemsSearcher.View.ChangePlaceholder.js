
define('ItemsSearcher.View.ChangePlaceholder', [
    'SC.Configuration',
    'ItemsSearcher.View',
    'underscore'
], function ItemsSearcherViewChangePlaceholder(
    Configuration,
    View,
    _
) {
    'use strict';

    return {
        b2bLoadModule: function b2bLoadModule() {
            var searchPlaceholderText = Configuration.get('quickStart.bTobExtensions.searchPlaceholderText');
            if (searchPlaceholderText) {
                View.prototype.initialize = _.wrap(View.prototype.initialize, function initialize(fn) {
                    fn.apply(this, _.toArray(arguments).slice(1));
                    this.on('afterViewRender', function afterViewRender(view) {
                        view.$el.find('.tt-input').prop('placeholder', searchPlaceholderText);
                    });
                });
            }
        }
    };
});
