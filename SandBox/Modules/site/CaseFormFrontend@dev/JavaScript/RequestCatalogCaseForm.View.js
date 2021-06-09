define('RequestCatalogCaseForm.View', [
    'SC.Configuration',
    'request-catalog-case-form.tpl',
    'Backbone',
    'Backbone.FormView',
    'jQuery',
    'underscore',
    'Utils'
], function RequestCatalogCaseForm(
    Configuration,
    requestCatalogCaseFormTpl,
    Backbone,
    BackboneFormView,
    jQuery,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: requestCatalogCaseFormTpl,
        attributes: {
            'class': 'RequestCatalogCaseForm'
        },
        events: {
            'submit form': 'saveTheForm'
        },
        bindings: {
            '[name="firstname"]': 'firstname',
            '[name="lastname"]': 'lastname',
            '[name="title"]': 'title',
            '[name="email"]': 'email',
            '[name="address1"]': 'address1',
            '[name="city"]': 'city',
            '[name="state"]': 'state',
            '[name="zipcode"]': 'zipcode',
            '[name="incomingmessage"]': 'incomingmessage'
        },
        initialize: function initialize(options) {
            this.application = options.application;
            BackboneFormView.add(this);
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _('Request a Catalog').translate(),
                href: '/request-a-catalog'
            }];
        },
        saveTheForm: function saveTheForm(e) {
            var promise = this.saveForm(e);
            var self = this;
            promise.done(function promiseDoneResponse(response) {
                if (response.code === 'OK') {
                    self.$('form').get(0).reset();
                    self.showError(response.successMessage, 'success');
                } else {
                    self.showError(response.message, 'error', true);
                }
            });
        },
        getContext: function getContext() {
            var incomingmessage = this.model.get('incomingmessage');
            var caseFormConfig = Configuration.caseformfrontend || {};
            var fUrl = caseFormConfig.BriggsRequestCatalog;
            if (!incomingmessage) {
                this.model.set('incomingmessage', 1);
            }
            this.model.set('caseFormUrl', fUrl);
            return {
                firstname: this.model.get('firstname') || '',
                lastname: this.model.get('lastname') || '',
                companyname: this.model.get('companyname') || '',
                title: this.model.get('title') || '',
                email: this.model.get('email') || '',
                address1: this.model.get('address1') || '',
                city: this.model.get('city') || '',
                state: this.model.get('state') || '',
                zipcode: this.model.get('zipcode') || '',
                incomingmessage: this.model.get('incomingmessage'),
                caseFormUrl: fUrl
            };
        }
    });
});
