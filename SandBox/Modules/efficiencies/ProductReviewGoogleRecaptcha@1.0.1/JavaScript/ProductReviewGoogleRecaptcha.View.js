define('ProductReviewGoogleRecaptcha.View', [
    'GoogleRecaptcha',
    'review_google_recaptcha.tpl',
    'Backbone',
    'underscore',
    'Utils'

], function ProductReviewGoogleRecaptchaView(
   GoogleRecaptcha,
   ProductReviewTpl,
   Backbone,
   _
) {
    'use strict';

    return Backbone.View.extend({
        template: ProductReviewTpl,

        render: function render() {
            this._render();
            GoogleRecaptcha.loadCaptcha();
        },

        getContext: function getContext() {
            return {
                rlabel: _.translate('ReCaptcha')
            };
        }

    });
});
