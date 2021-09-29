define('CustomerSegments.Helper', [
    'SC.Configuration',
    'Profile.Model',
    'CustomerSegments.Model',
    'jQuery',
    'underscore',
    'Utils'
], function CustomerSegmentsFacetsRouter(
    Configuration,
    ProfileModel,
    CustomerSegmentsModel,
    jQuery,
    _
) {
    'use strict';

    /*
    * Provide support for customer segment module
    **/
    var Helper = {
        loadPromiseCustomerGroup: jQuery.Deferred(),

        loadPromiseGroupInfo: jQuery.Deferred(),

        configuration: Configuration && Configuration.get('customerSegments'),

        /*
        * Set Customer groups and add to Global configuration*/
        setCustomerGroups: function setCustomerGroups() {
            var profile;
            var customerGroups;
            var customerGroupIds;
            var self = this;

            // Check if Customer Groups is already set, then return promise
            if (this.configuration.customerGroups && !_.isEmpty(this.configuration.customerGroups)) {
                return Helper.loadPromiseCustomerGroup.resolve(this.configuration);
            }

            // Get Customer Profile and set Customer Groups details to Global Configuration
            ProfileModel.getPromise().done(function ProfileModelGetPromise() {
                profile = ProfileModel.getInstance();
                customerGroups = profile.get('customerGroup') || '';
                customerGroupIds = profile.get('customerGroupids') || self.configuration.defaultGroupId;

                // Check Configuration for Guest user setting
                if (!self.configuration.guestUser && _.isEmpty(customerGroups)) {
                    customerGroups = self.configuration.defaultGroup.replace(new RegExp(' ', 'g'), '-');
                }

                // Add new configuration for customer segments
                _.extend(self.configuration, {
                    customerGroups: customerGroups,
                    customerGroupIds: customerGroupIds
                });

                return Helper.loadPromiseCustomerGroup.resolve(self.configuration);
            });

            return Helper.loadPromiseCustomerGroup;
        },

        /*
        * Set Group information and add to Global configuration
        * @return: Promise
        * */
        setGroupsInfo: function setGroupsInfo() {
            var model = new CustomerSegmentsModel();
            var groupsInfo;
            var self = this;

            // Check if Group info is already set, then return promise
            if (this.configuration.groupLogo && !_.isEmpty(this.configuration.groupLogo)) {
                return Helper.loadPromiseGroupInfo.resolve(this.configuration);
            }

            /*
            * Get Customer group and fetch group data
            * Execute after setCustomerGroups is done
            * */
            jQuery.when(Helper.setCustomerGroups()).done(function whenSetCustomerGroups(response) {
                if (response.customerGroups && !_.isEmpty(response.customerGroups)) {
                    model.fetch({
                        data: {
                            groupIds: response.customerGroupIds
                        },
                        success: function success(groups) {
                            groupsInfo = {
                                groupLogo: groups.get('logos'),
                                groupBanners: groups.get('banners'),
                                groupCategory: groups.get('categories'),
                                isHidePrices: groups.get('isHidePrices'),
                                isHideAddtoCart: groups.get('isHideAddtoCart')
                            };

                            _.extend(self.configuration, groupsInfo);

                            return Helper.loadPromiseGroupInfo.resolve(groupsInfo);
                        }
                    });
                } else {
                    return Helper.loadPromiseGroupInfo.resolve(self.configuration);
                }

                return false;
            });

            return Helper.loadPromiseGroupInfo;
        },

        /*
        * Add Facets Filter to searchApiMasterOptions
        * @params: view - current view being access, not required
        * */
        addToSearchApiMasterOptions: function addToSearchApiMasterOptions(view, isCategory) {
            jQuery.when(Helper.setCustomerGroups()).done(function whenSetCustomerGroups(response) {
                _.each(Configuration.searchApiMasterOptions, function eachApiOptions(value) {
                    _.extend(value, {
                        'facet.exclude': !_.isEmpty(value['facet.exclude']) ?
                        value['facet.exclude'] + ',custitem_item_customersegments' :
                            'custitem_item_customersegments',
                        'fieldset': _.isEmpty(value.fieldset) ? 'search' : value.fieldset
                    });

                    if (!_.isEmpty(response.customerGroups)) {
                        _.extend(value, {
                            'custitem_item_customersegments': response.customerGroups,
                            'include': 'facets'
                        });
                    }
                });

                if (view) {
                    if (isCategory) {
                        view.showPage(true);
                    } else {
                        view.showPage();
                    }
                }
            });
        },

        /*
        * Check if Facet is already added to configuration
        * @return boolean
        * */
        inFacets: function inFacets(id) {
            return _.has(Configuration.searchApiMasterOptions.Facets, id);
        },

        /*
        * Filter collection base on current groups
        * @param: View - current view being access
        * @param: type - relateditems_detail || correlateditems_detail, not required
        * @return: (Array) Filtered items
        * */
        filterCollection: function extendCollection(View, type) {
            _.extend(View.prototype, {
                parse: function parse(response) {
                    var originalItems = _.compact(response.items) || [];
                    var self = this;
                    var items = {};

                    if (type) {
                        _.each(_.pluck(originalItems, type), function eachOriginalItemsType(dataitems) {
                            _.each(dataitems, function eachDataitems(item) {
                                if (Helper.isItemGroup(item)) {
                                    if (!_.contains(self.itemsIds, item.internalid) && !items[item.internalid]) {
                                        items[item.internalid] = item;
                                    }
                                }
                            });
                        });
                    } else {
                        _.each(originalItems, function eachOriginalItems(item) {
                            if (Helper.isItemGroup(item)) {
                                if (!_.contains(self.itemsIds, item.internalid) && !items[item.internalid]) {
                                    items[item.internalid] = item;
                                }
                            }
                        });
                    }

                    return _.toArray(items);
                }
            });
        },

        /*
        * Filter cart items base on customer group
        * @param: View - current view being access
        * */
        filterCart: function cartFilter(View) {
            View.loadCart().done(function doneLoadCart() {
                var cart = View.getInstance();

                _.each(cart.get('lines').models, function eachCartLines(line) {
                    if (line) {
                        if (!Helper.isItemGroup(line.get('item').toJSON())) {
                            cart.removeLine(line, cart.get('options'));
                        }
                    }
                });
            });
        },

        /*
        * Check if items is available to the current group
        * @param: item - current item being checked
        * @return Boolean
        * */
        isItemGroup: function isItemGroup(item) {
            var itemGroupStr = _.pick(item, 'custitem_item_customersegments');
            var itemGroups = !_.isEmpty(itemGroupStr) ? itemGroupStr.custitem_item_customersegments.split(', ') : '';
            var profileGroups;

            if (!_.isEmpty(this.configuration.customerGroups)) {
                profileGroups = this.configuration.customerGroups.replace(new RegExp('-', 'g'), ' ').split(',');

                return !_.isEmpty(_.intersection(itemGroups, profileGroups));
            }

            return true;
        },

        checkBannerImage: function checkBannerImage(groupBanners, configBanners) {
            var count;
            var ctr;
            var banners = [];
            var bannerObj;

            if (groupBanners) {
                _.each(groupBanners, function mapGroupBanner(val, key) {
                    if (_.isEmpty(val.image)) {
                        if (configBanners[key]) {
                            if (configBanners[key].image) {
                                val.image = configBanners[key].image;
                            } else {
                                banners.push(configBanners[key]);
                            }
                        } else {
                            ctr = key - count;
                            ctr = (ctr >= count) ? count - 1 : ctr;
                            if (configBanners[ctr].image) {
                                val.image = configBanners[ctr].image;
                            } else {
                                banners.push(configBanners[ctr]);
                            }
                        }
                    }
                });

                bannerObj = groupBanners;
            } else {
                bannerObj = configBanners;
            }

            if (_.isEmpty(banners)) {
                return bannerObj;
            }

            return banners;
        }
    };

    return Helper;
});
