define('CustomerSegments.StoreItem.Model', [
    'Application',
    'Configuration',
    'StoreItem.Model',
    'Models.Init',
    'CustomFieldsParser',
    'underscore'
], function CustomerSegmentsProductListItemSearch(
    Application,
    Configuration,
    StoreItemModel,
    CommerceAPI,
    customFieldsParser,
    _
) {
    'use strict';

    _.extend(StoreItemModel, {
        configuration: Configuration.customerSegments,

        getUserData: function getUserData() {
            var customFields;
            var customerGroups = false;

            if (CommerceAPI.session.isLoggedIn2()) {
                customFields = customFieldsParser(CommerceAPI.customer.getCustomFieldValues());
                customerGroups = JSON.parse(customFields.custentity_hidden_customersegment);
                customerGroups = _.pluck(customerGroups, 'value');
                if (_.compact(customerGroups).length === 0 && !this.configuration.guestUser) {
                    customerGroups = this.configuration.defaultGroup.split(',');
                } else if (_.compact(customerGroups).length === 0 && this.configuration.guestUser) {
                    customerGroups = false;
                }
            }

            return customerGroups;
        },
        /*
        * Filter items by Groups, overrides setPreloadedItem of StoreItem.Model
        * @override: setPreloadedItem
        * */

        /* eslint-disable */
        setPreloadedItem: function setPreloadedItem(id, item, fieldset_name) {
            var itemGroupStr = _.pick(item, 'custitem_item_customersegments');
            var itemGroups = !_.isEmpty(itemGroupStr) ? itemGroupStr.custitem_item_customersegments.split(', ') : '';
            var profileGroups = this.getUserData();

            if (profileGroups) {
                profileGroups = profileGroups.toString().replace(new RegExp('-', 'g'), ' ').split(',');
                if (!_.isEmpty(_.intersection(itemGroups, profileGroups))) {
                    this.preloadedItems[this.getItemKey(id, fieldset_name)] = item;
                }
            } else {
                this.preloadedItems[this.getItemKey(id, fieldset_name)] = item;
            }

        }
        /* eslint-enable */
    });
});
