define('CaseFormFrontend.ServiceController', [
    'ServiceController',
    'CaseFormFrontend.Model'
], function CaseFormFrontendServiceController(
    ServiceController,
    CaseFormFrontendModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CaseFormFrontend.ServiceController',
        post: function post() {
            return CaseFormFrontendModel.submit(this.data);
        }
    });
});
