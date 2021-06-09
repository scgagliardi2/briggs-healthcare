define('RequestCatalogCaseForm.Model', [
    'underscore',
    'Backbone',
    'Utils'
], function RequestCatalogCaseFormModel(
    _,
    Backbone,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl('services/CaseFormFrontend.Service.ss'),
        validation: {
            firstname: {
                required: true,
                msg: _('First Name is required').translate()
            },
            lastname: {
                required: true,
                msg: _('Last Name is required').translate()
            },
            title: {
                required: true,
                msg: _('Title is required').translate()
            },
            email: {
                required: true,
                msg: _('Email is required').translate()
            },
            address1: {
                required: true,
                msg: _('Address is required').translate()
            },
            city: {
                required: true,
                msg: _('Address is required').translate()
            },
            state: {
                required: true,
                msg: _('Address is required').translate()
            },
            zipcode: {
                required: true,
                msg: _('Zip is required').translate()
            },
            /*eslint-disable*/
            // avoid eslint error "Expected to return a value at the end of method 'fn'"
            incomingmessage: {
                fn: function (catalogNumber) {
                    if (!catalogNumber) {
                        return _('Number of Catalogs is required (Max of 3)').translate();
                    } else if (catalogNumber > 3) {
                        return _('Max number of catalogs is 3').translate();
                    }
                }
            }
            /* eslint-enable */
        }
    });
});
