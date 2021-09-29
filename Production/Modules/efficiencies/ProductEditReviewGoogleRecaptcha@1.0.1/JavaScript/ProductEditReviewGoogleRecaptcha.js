define('ProductEditReviewGoogleRecaptcha', [
    'ProductReviews.FormPreview.View',
    'ProductEditReviewGoogleRecaptcha.View',
    'Backbone.CompositeView',
    'PluginContainer',
    'underscore',
    'jQuery',
    'ProductEditReviewGoogleRecaptcha.validate'
], function ProductEditReviewGoogleRecaptcha(
    ProductFormPreviews,
    ProductEditReviewGoogleRecaptchaView,
    BackboneCompositeView,
    PluginContainer,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            ProductFormPreviews.prototype.preRenderPlugins = ProductFormPreviews.prototype.preRenderPlugins || new PluginContainer();

            ProductFormPreviews.prototype.preRenderPlugins.install({
                name: 'ProductFormPreviewsPreRenderPlugins',
                execute: function execute($el) {
                    $el
                        .find('.product-reviews-form-preview-main')
                        .after('<div class="product-reviews-preview-review-content" ' +
                               'data-view="RenderCaptcha.GoogleRecaptcha"></div>');
                }
            });

            _.extend(ProductFormPreviews.prototype.childViews, {
                'RenderCaptcha.GoogleRecaptcha': function childViewGoogleCaptcha() {
                    return new ProductEditReviewGoogleRecaptchaView({
                        model: this.model,
                        application: this.application
                    });
                }
            });
        }
    };
});
