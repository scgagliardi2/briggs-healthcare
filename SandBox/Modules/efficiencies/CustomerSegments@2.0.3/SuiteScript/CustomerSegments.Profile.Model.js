define('CustomerSegments.Profile.Model', [
    'Application',
    'Models.Init',
    'Profile.Model',
    'CustomFieldsParser',
    'underscore'
], function CustomerSegmentsProfileModel(
    Application,
    CommerceAPI,
    Profile,
    customFieldsParser,
    _
) {
    'use strict';

    _.extend(Profile, {
        getCustomerGroup: function getCustomerGroup() {
            var customFields;
            var customerGroups = [];

            if (CommerceAPI.session.isLoggedIn2()) {
                customFields = customFieldsParser(CommerceAPI.customer.getCustomFieldValues());

                try {
                    customerGroups = JSON.parse(customFields.custentity_hidden_customersegment);
                } catch (e) {
                    customerGroups = false;
                }
            }

            return customerGroups;
        }
    });
    Application.on('after:Profile.get', function afterProfileGet(Model, responseData) {
        var customerGroups = Model.getCustomerGroup();
        var customerGroup = '';
        var customerGroupids = '';

        if (customerGroups) {
            customerGroup = _.pluck(customerGroups, 'value').toString();
            customerGroupids = _.pluck(customerGroups, 'id').toString();
        }

        responseData.customerGroup = customerGroup;
        responseData.customerGroupids = customerGroupids;
    });
});
