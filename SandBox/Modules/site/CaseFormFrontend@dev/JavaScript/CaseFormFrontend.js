define('CaseFormFrontend', [
    'CaseFormFrontend.Router'
], function CaseFormFrontend(
    Router
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            return new Router(application);
        }
    };
});
