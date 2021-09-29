define('Overview.Shipping.NoEdit.View', [
    'Overview.Shipping.View',
    'Profile.Model',
    'underscore'
], function OverviewShippingNoEditView(
    OverviewShippingView,
    ProfileModel,
    _
) {
    'use strict';

    _.extend(OverviewShippingView.prototype, {
        getContext: _.wrap(OverviewShippingView.prototype.getContext, function getContextWrap(fn) {
            var retVal = fn.apply(this, _.toArray(arguments).slice(1));
            var terms = ProfileModel.getInstance().get('paymentterms');
            _.extend(retVal, {
                'showEdit': !(terms)
            });
            return retVal;
        })
    });
});
