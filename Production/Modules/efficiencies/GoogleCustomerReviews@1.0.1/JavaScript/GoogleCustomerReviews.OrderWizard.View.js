define('GoogleCustomerReviews.OrderWizard.View', [
    'Wizard.Module',
    'Profile.Model',
    'SC.Configuration',
    'GoogleCustomerReviews.LoadScript',
    'underscore',
    'Utils'
], function GoogleCustomerReviewsOrderWizardView(
    WizardModule,
    ProfileModel,
    Configuration,
    GCR,
    _
) {
    'use strict';

    _.extend(WizardModule.prototype, {
        render: _.wrap(WizardModule.prototype.render, function wrapRender(fn) {
            var self = this;
            var profileModel;
            var confirmation;
            var cDate = new Date();
            var configuration = Configuration && Configuration.get('googleCustomerReviews');

            fn.apply(this, _.toArray(arguments).slice(1));

            profileModel = this.wizard.profileModel;
            confirmation = this.wizard.model.get('confirmation');

            if (confirmation && confirmation.get('confirmationnumber')) {
                GCR.loadScript('renderOptIn');

                window.renderOptIn = function renderOptIn() {
                    window.gapi.load('surveyoptin', function gapiLoad() {
                        window.gapi.surveyoptin.render({
                            'merchant_id': configuration.merchantId,
                            'order_id': confirmation.get('confirmationnumber'),
                            'email': profileModel.get('email'),
                            'delivery_country': profileModel.get('addresses').models[0].get('country'),
                            'estimated_delivery_date': self.formatDate(cDate.setDate(cDate.getDate() + configuration.estimatedDeliveryDate)),
                            'opt_in_style': configuration.optInStyle
                        });
                    });
                };
            }
        }),

        formatDate: function formatDate(date) {
            var d = new Date(date);
            var yyyy = d.getFullYear().toString();
            var mm = (d.getMonth() + 1).toString();
            var dd = d.getDate().toString();

            return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
        }
    });
});
