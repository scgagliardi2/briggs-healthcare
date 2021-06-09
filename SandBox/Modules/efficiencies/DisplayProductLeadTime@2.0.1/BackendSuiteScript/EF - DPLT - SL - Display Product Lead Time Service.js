define('EF - DPLT - SL - Display Product Lead Time Service', [
    'DisplayProductLeadTime.Model',
    'Application'
], function DisplayProductLeadTimeService(
    DisplayProductLeadTimeModel,
    Application
) {
    'use strict';

/* eslint-disable */
    var service = function service(request) {
        var method = request.getMethod();
        var data;

        /* Only run this script from the webstore */
        if (nlapiGetContext().getExecutionContext().toString() !== 'webstore') {
            return Application.sendError(forbiddenError);
        }

        try {
            data = JSON.parse(request.getBody());
        } catch (e) {
            return Application.sendError(methodNotAllowedError);
        }

        try {
            switch (method) {
            case 'POST':
                Application.sendContent(DisplayProductLeadTimeModel.get(data));
                break;
            default:
                return Application.sendError(methodNotAllowedError);
            }
        } catch (e) {
            return Application.sendError(e);
        }
    };
/* eslint-enable */

    return {
        service: service
    };
});
