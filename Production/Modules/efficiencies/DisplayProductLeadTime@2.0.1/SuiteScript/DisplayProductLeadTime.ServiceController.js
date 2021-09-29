define('DisplayProductLeadTime.ServiceController', [
    'ServiceController',
    'Application',
    'DisplayProductLeadTime.Model'
], function DisplayProductLeadTimeServiceController(
    ServiceController,
    Application,
    DisplayProductLeadTimeModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'ItemBadges.ServiceController',

        get: function get() {
            var data = { itemId: this.request.getParameter('itemId') };
            this.sendContent(DisplayProductLeadTimeModel.proxy(data, this.request));
        }
    });
});
