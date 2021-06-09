define('ContactUsCaseForm.Model', [
    'underscore',
    'Backbone',
    'Utils'
], function ContactUsCaseFormModel(
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
            companyname: {
                required: true,
                msg: _('Company Name is required').translate()
            },
            email: {
                required: true,
                msg: _('Email is required').translate()
            },
            title: {
                required: true,
                msg: _('Title is required').translate()
            },
            phone: {
                fn: _.validatePhone
            },
            incomingmessage: {
                required: true,
                msg: _('Comments is required').translate()
            }
        }
    });
});
