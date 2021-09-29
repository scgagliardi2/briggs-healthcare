define('CustomerSegments.ServiceController', [
    'ServiceController',
    'Application',
    'CustomerSegments.Model'
], function CustomerSegmentsServiceController(
    ServiceController,
    Application,
    CustomerSegmentsModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CustomerSegments.ServiceController',

        /*
        * Get Group data base on customer group ID's
        * Type of cache
        *  - CACHE_DURATION_LONG = 7 days
        *  - CACHE_DURATION_MEDIUM = 2 hours
        *  - CACHE_DURATION_SHORT = 5 mins
        * @params: (String) groupIds
        * @return: Object
        * */
        get: function get() {
            var groupIds = this.request.getParameter('groupIds');
            this.sendContent(CustomerSegmentsModel.get(groupIds), {
                'cache': response.CACHE_DURATION_MEDIUM
            });
        }
    });
});
