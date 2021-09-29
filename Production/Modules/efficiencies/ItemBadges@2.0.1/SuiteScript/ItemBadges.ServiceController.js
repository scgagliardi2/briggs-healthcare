define('ItemBadges.ServiceController', [
    'ServiceController',
    'Application',
    'ItemBadges.Model'
], function ItemBadgesServiceController(
    ServiceController,
    Application,
    ItemBadgesModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'ItemBadges.ServiceController',

        get: function get() {
            this.sendContent(ItemBadgesModel.list(), {
                'cache': response.CACHE_DURATION_MEDIUM
            });
        }
    });
});
