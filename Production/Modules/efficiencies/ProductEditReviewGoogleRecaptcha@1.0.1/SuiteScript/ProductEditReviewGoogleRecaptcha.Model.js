define('ProductReviewGoogleRecaptcha.Model', [
    'SC.Model',
    'ProductReviews.Model',
    'GoogleRecaptcha.Model',

    'Application',
    'underscore'
], function ProductReviewGoogleRecaptchaModel(
    SCModel,
    ProductReview,
    GoogleRecaptchaModel,

    Application,
    _
) {
    'use strict';

    var extendProductReview;

    Application.on('before:ProductReview.create', function ProductPreviewModelCreate(Model, data) {
        GoogleRecaptchaModel.validate(data['g-recaptcha-response']);
    });

    extendProductReview = _.extend(ProductReview, {
        name: 'productreviewgooglerecaptcha'
    });

    return extendProductReview;
});
