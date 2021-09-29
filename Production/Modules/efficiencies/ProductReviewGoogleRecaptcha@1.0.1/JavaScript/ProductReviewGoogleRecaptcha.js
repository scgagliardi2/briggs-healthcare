define('ProductReviewGoogleRecaptcha', [
    'ProductReviews.Form.View',
    'ProductReviewGoogleRecaptcha.View',
    'GlobalViews.Message.View',
    'Backbone.CompositeView',
    'underscore',
    'PluginContainer',
    'jQuery',
    'ProductReviewGoogleRecaptcha.validate'

], function ProductReviewGoogleRecaptcha(
    ProductFormReviews,
    ProductReviewGoogleRecaptchaView,
    GlobalViewsMessageView,
    BackboneCompositeView,
    _,
    PluginContainer
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            ProductFormReviews.prototype.preRenderPlugins = ProductFormReviews.prototype.preRenderPlugins || new PluginContainer();

            ProductFormReviews.prototype.preRenderPlugins.install({
                name: 'ProductFormReviewsPreRenderPlugins',
                execute: function execute($el) {
                    $el
                        .find('.product-reviews-form-content-groups')
                        .after('<div class="product-reviews-form-content-groups">' +
                             '<div class="product-reviews-form-content-group" ' +
                                     'data-view="RenderCaptcha.GoogleRecaptcha">' +
                             '</div></div>');
                }
            });

            _.extend(ProductFormReviews.prototype.childViews, {
                'RenderCaptcha.GoogleRecaptcha': function childViewGoogleCaptcha() {
                    return new ProductReviewGoogleRecaptchaView({
                        application: this.application
                    });
                }
            });
        }
    };
});
