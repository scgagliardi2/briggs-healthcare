define('Custom.OrderHistory.ServiceController', [
    'OrderHistory.ServiceController',
    'OrderHistory.Model',
    'underscore'
], function CustomOrderHistoryServiceController(
    OrderHistoryServiceController,
    OrderHistoryModel,
    _
) {
    'use strict';

    _.extend(OrderHistoryServiceController, {
        get: function get() {
            var recordtype = this.request.getParameter('recordtype');
            var id = this.request.getParameter('internalid');

            if (recordtype && id) {
                return OrderHistoryModel.get(recordtype, id);
            }

            return OrderHistoryModel.list({
                filter: this.request.getParameter('filter'),
                order: this.request.getParameter('order'),
                sort: this.request.getParameter('sort'),
                from: this.request.getParameter('from'),
                to: this.request.getParameter('to'),
                ponumber: this.request.getParameter('ponumber'),
                origin: this.request.getParameter('origin'),
                page: this.request.getParameter('page') || 1,
                results_per_page: this.request.getParameter('results_per_page')
            });
        }
    });
});
