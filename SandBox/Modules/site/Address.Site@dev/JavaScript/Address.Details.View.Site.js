define('Address.Details.View.Site', [
    'Address.Details.View',
    'Profile.Model',
    'underscore'
], function AddressDetailsViewSite(
    AddressDetailsView,
    ProfileModel,
    _
) {
    'use strict';

    _.extend(AddressDetailsView.prototype, {
        getContext: _.wrap(AddressDetailsView.prototype.getContext, function wrapGetContext(fn) {
            var retVal = fn.apply(this, _.toArray(arguments).slice(1));

            var terms = ProfileModel.getInstance().get('paymentterms');
            _.extend(retVal, {
                'paymentterms': terms,
                'showEditButton': !this.options.hideActions && !(terms),
                'showRemoveButton': !this.options.hideActions && !(terms)
            });
            return retVal;
        })
    });
});
