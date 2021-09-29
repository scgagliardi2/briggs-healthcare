define('CustomerSegments.OrderWizard.View', [
    'OrderWizard.Module.CartSummary',
    'CustomerSegments.Helper',
    'jQuery',
    'underscore',
    'Utils'
], function CustomerSegmentsOrderWizardView(
    OrderWizardCartSummaryView,
    Helper,
    jQuery,
    _
) {
    'use strict';

    _.extend(OrderWizardCartSummaryView.prototype, {
        initialize: _.wrap(OrderWizardCartSummaryView.prototype.initialize, function orderWizardModuleCartSummaryFunction(fn) {
            var self = this;
            var summary;
            fn.apply(self, _.toArray(arguments).slice(1));

            jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupsInfo(response) {
                if (response.isHidePrices) {
                    summary = self.wizard.model.get('summary');
                    if (summary !== undefined) {
                        summary.subtotal_formatted = '';
                        summary.total_formatted = '';
                        self.render();
                    }
                }
            });
        }),

        getContext: _.wrap(OrderWizardCartSummaryView.prototype.getContext, function orderWizardModuleCartSummaryFunction(fn) {
            var context = fn.call(this);
            var self = this;
            var summary;
            jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupsInfo(response) {
                if (response.isHidePrices) {
                    summary = self.wizard.model.get('summary');
                    if (summary !== undefined) {
                        summary.subtotal_formatted = '';
                        summary.total_formatted = '';
                    }
                }
            });

            return context;
        })
    });
});
