define('CaseFormFrontend.Router', [
    'Backbone',
    'ContactUsCaseForm.View',
    'RequestCatalogCaseForm.View',
    'ContactUsCaseForm.Model',
    'RequestCatalogCaseForm.Model'
], function CaseFormFrontendRouter(
    Backbone,
    ContactUsCaseFormView,
    RequestCatalogCaseFormView,
    ContactUsCaseFormModel,
    RequestCatalogCaseFormModel
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            'contactus': 'contactUs',
            'request-a-catalog': 'requestCatalog'
        },
        initialize: function initialize(application) {
            this.application = application;
        },
        contactUs: function contactUs() {
            var model = new ContactUsCaseFormModel();
            var view = new ContactUsCaseFormView({
                application: this.application,
                model: model
            });
            view.showContent();
        },
        requestCatalog: function requestCatalog() {
            var model = new RequestCatalogCaseFormModel();
            var view = new RequestCatalogCaseFormView({
                application: this.application,
                model: model
            });
            view.showContent();
        }
    });
});
