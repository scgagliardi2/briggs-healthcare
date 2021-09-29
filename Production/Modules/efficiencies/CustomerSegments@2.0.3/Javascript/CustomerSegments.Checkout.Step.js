define('CustomerSegments.Checkout.Step', [
    'SC.Configuration',
    'CustomerSegments.OrderWizard.View',
    'underscore'
], function CustomerSegmentsCheckoutStep(
    Configuration,
    OrderWizardModuleCustomerSegments,
    _
) {
    'use strict';

    return {
        checkoutStepView: function checkoutStepView() {
            var stepsToAddTo = [
                'Delivery Method',      // Standard
                'Shipping method',      // Billing First
                'Checkout Information', // OPC
                'Review'                // All
            ];
            _.each(Configuration.get('checkoutSteps'), function eachCheckoutStep(checkoutStep) {
                if (_.contains(stepsToAddTo, checkoutStep.name)) {
                    _.each(checkoutStep.steps || {}, function eachStep(step) {
                        step.modules.push([OrderWizardModuleCustomerSegments]);
                    });
                }
            });
        }
    };
});
