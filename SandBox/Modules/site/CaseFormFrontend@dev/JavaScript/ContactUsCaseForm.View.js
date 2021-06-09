define('ContactUsCaseForm.View', [
    'SC.Configuration',
    'contact-us-case-form.tpl',
    'Backbone',
    'Backbone.FormView',
    'jQuery',
    'underscore',
    'Utils'
], function ContactUsCaseForm(
    Configuration,
    ContactUsCaseFormTpl,
    Backbone,
    BackboneFormView,
    jQuery,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: ContactUsCaseFormTpl,
        attributes: {
            'class': 'ContactUsCaseForm'
        },
        events: {
            'submit form': 'saveTheForm'
        },
        bindings: {
            '[name="firstname"]': 'firstname',
            '[name="lastname"]': 'lastname',
            '[name="companyname"]': 'companyname',
            '[name="email"]': 'email',
            '[name="title"]': 'title',
            '[name="phone"]': 'phone',
            '[name="incomingmessage"]': 'incomingmessage'
        },
        initialize: function initialize(options) {
            this.application = options.application;
            BackboneFormView.add(this);
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _('Contact Us').translate(),
                href: '/contactus'
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
            var caseFormConfig = Configuration.caseformfrontend || {};
            var fUrl = caseFormConfig.BriggsContactUs;
            this.model.set('caseFormUrl', fUrl);
            return {
                firstname: this.model.get('firstname') || '',
                lastname: this.model.get('lastname') || '',
                companyname: this.model.get('companyname') || '',
                email: this.model.get('email') || '',
                title: this.model.get('title') || '',
                phone: this.model.get('phone') || '',
                incomingmessage: this.model.get('incomingmessage') || '',
                caseFormUrl: fUrl
            };
        }
    });
});
