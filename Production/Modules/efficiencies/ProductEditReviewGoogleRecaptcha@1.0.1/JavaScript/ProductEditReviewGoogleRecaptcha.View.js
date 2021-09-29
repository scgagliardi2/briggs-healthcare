define('ProductEditReviewGoogleRecaptcha.View', [
    'GoogleRecaptcha',
    'preview_google_recaptcha.tpl',
    'Backbone',
    'underscore',
    'ProductReviews.FormPreview.View',
    'jQuery'
], function ProductEditReviewGoogleRecaptchaView(
   GoogleRecaptcha,
   ProductEditReviewTpl,
   Backbone,
   _
) {
    'use strict';

    return Backbone.View.extend({
        template: ProductEditReviewTpl,

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
