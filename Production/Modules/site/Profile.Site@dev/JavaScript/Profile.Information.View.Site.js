define('Profile.Information.View.Site', [
    'Profile.Information.View',
    'Profile.Model',
    'underscore'
], function(
    ProfileInformationView,
    ProfileModel,
    _
) {
    'use strict';

    _.extend(ProfileInformationView.prototype, {
        getContext: _.wrap(ProfileInformationView.prototype.getContext, function (fn) {
            var retVal = fn.apply(this, _.toArray(arguments).slice(1));

            var terms = ProfileModel.getInstance().get('paymentterms');
            _.extend(retVal, {
                'showCompany': !(terms)
            })
            return retVal;
        })
    })
})
