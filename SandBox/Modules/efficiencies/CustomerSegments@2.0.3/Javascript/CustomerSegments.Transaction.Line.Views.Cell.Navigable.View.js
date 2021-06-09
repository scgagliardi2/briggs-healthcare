define('CustomerSegments.Transaction.Line.Views.Cell.Navigable.View', [
    'Transaction.Line.Views.Cell.Navigable.View',
    'CustomerSegments.Helper',
    'jQuery',
    'underscore',
    'Utils'
], function CustomerSegmentsOrderWizardView(
    TransactionLineViewsCellNavigableView,
    Helper,
    jQuery,
    _
) {
    'use strict';

    TransactionLineViewsCellNavigableView.prototype.initialize =
        _.wrap(TransactionLineViewsCellNavigableView.prototype.initialize, function TransactionLineViewsCellNavigableViewFunction(fn) {
            var self = this;
            fn.apply(self, _.toArray(arguments).slice(1));

            jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupsInfo(response) {
                if (response.isHidePrices) {
                    self.options.detail3 = '';
                    self.options.detail3Title = '';
                    self.options.showBlockDetail2 = '';
                    self.options.detail2 = '';
                    self.render();
                }
            });
        });
});
