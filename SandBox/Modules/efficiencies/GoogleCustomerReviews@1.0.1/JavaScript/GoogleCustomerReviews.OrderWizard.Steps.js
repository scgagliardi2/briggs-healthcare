define('GoogleCustomerReviews.OrderWizard.Steps', [
    'SC.Checkout.Configuration',
    'GoogleCustomerReviews.OrderWizard.View',
    'underscore'
], function GoogleCustomerReviewsOrderWizardSteps(
    SCCheckOutConfiguration,
    GoogleCustomerReviewsOrderWizardView,
    _
) {
    'use strict';

    var stepSize = _.size(SCCheckOutConfiguration.checkoutSteps) - 1;
    SCCheckOutConfiguration.checkoutSteps[
        stepSize
        ].steps[
            1
        ].modules.push([
            GoogleCustomerReviewsOrderWizardView
        ]);
});
