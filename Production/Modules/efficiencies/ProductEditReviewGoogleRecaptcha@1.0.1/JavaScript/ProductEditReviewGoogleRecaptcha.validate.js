define('ProductEditReviewGoogleRecaptcha.validate', [
    'ProductReviews.FormPreview.View',
    'GlobalViews.Message.View',
    'Backbone.CompositeView',
    'underscore',
    'jQuery'

], function ProductReviewGoogleRecaptcha(
    ProductFormReviews,
    GlobalViewsMessageView,
    BackboneCompositeView,
    _,
    jQuery
) {
    'use strict';

    // frontend validation
    ProductFormReviews.prototype.save =
        _.wrap(ProductFormReviews.prototype.save, function wrapProductFormInitialize(fn) {
            var resp;
            var msgContainerParent;
            var globalViewMessage;
            var response;
            resp = jQuery('.g-recaptcha-response').val();
            switch (_.isEmpty(resp)) {
            case true:
                globalViewMessage = new GlobalViewsMessageView({
                    message: _.translate('ReCaptcha is invalid'),
                    type: 'error',
                    closable: true
                });
                msgContainerParent = jQuery('.msg');
                msgContainerParent.html(globalViewMessage.render().$el.html());
                return false;
            default:
                jQuery('.global-views-message-button').click();
                this.model.set('g-recaptcha-response', resp);
                response = true;

            }
            fn.apply(this, _.toArray(arguments).slice(1));
            return response;
        });
});
