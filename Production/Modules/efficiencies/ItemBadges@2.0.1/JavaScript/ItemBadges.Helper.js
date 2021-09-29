define('ItemBadges.Helper', [
    'PluginContainer',
    'ItemBadges.Collection',

    'ItemBadges.View'
], function ItemBadgesHelper(
    PluginContainer,
    Collection,

    ItemBadgesView
) {
    'use strict';

    var Helper = {
        addChildView: function addChildView(View, options) {
            View.prototype.preRenderPlugins = View.prototype.preRenderPlugins || new PluginContainer();

            View.prototype.preRenderPlugins.install({
                name: 'ItemBadges',
                execute: function execute($el) {
                    $el
                        .find(options.target)
                        .after('<div class="itemBadge-view-container ' +
                            options.viewClass + '" data-view="Itembadges.View"></div>');
                }
            });

            Helper.executeChildView(View);
        },

        executeChildView: function executeChildView(View) {
            var collection = new Collection();

            View.addChildViews({
                'Itembadges.View': function wrapperFunction() {
                    return new ItemBadgesView({
                        application: this.application,
                        model: this.model,
                        collection: collection
                    });
                }
            });
        }
    };

    return Helper;
});
