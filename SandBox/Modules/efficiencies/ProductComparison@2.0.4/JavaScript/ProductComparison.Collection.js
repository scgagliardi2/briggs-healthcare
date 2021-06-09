/*
    © 2016 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
// @module ProductComparison
define('ProductComparison.Collection', [
    'SC.Configuration',
    'Backbone.CachedCollection',
    'Item.Collection',
    'Session',
    'underscore',
    'Utils'
], function ProductComparisonCollection(
    Configuration,
    BackboneCachedCollection,
    ItemCollection,
    Session,
    _
) {
    'use strict';

    return ItemCollection.extend({
        url: function Url() {
            var productIDs = [];
            var idString = '';
            var url = '';
            var tmpVal;

            // Retreieving from URL queryStr from options
            var queryStrParams = this.options;
            if (queryStrParams) {
                _.each(queryStrParams, function eachQueryParams(value, key) {
                    tmpVal = parseInt(value, 10);
                    if (key < 4) {
                        productIDs.push(tmpVal);
                        idString += 'id=' + tmpVal + '&';
                    }
                });
                url = '/api/items?' + idString + 'fieldset=productcomparison';
            }
            return url;
        },

        // @method initialize
        initialize: function initialize(options) {
            this.options = options;
        },

        // @method getModuleConfig
        getModuleConfig: function getModuleConfig() {
            var config = Configuration.get('productComparison');
            return config;
        },

        // @method getMappedValuesToProperties
        getMappedValuesToProperties: function getMappedValuesToProperties() {
            var self = this;
            var productValues = [];
            var itemValue;
            var test = this.getModuleConfig().itemProperties;
            var tmpItemProperties = _.clone(test);
            tmpItemProperties = _.sortBy(tmpItemProperties, 'order');

            _.map(tmpItemProperties, function tmpItemPropertiesMapping(itemProperty, key) {
                productValues = [];

                self.each(function eachProperty(item) {
                    if (itemProperty && itemProperty.fieldid) {
                        if (itemProperty.type === 'Actions') {
                            itemValue = {};

                            if (typeof itemProperty.fieldid === 'string') {
                                itemProperty.fieldid = itemProperty.fieldid.replace(/\s/g, '');
                                itemProperty.fieldid = itemProperty.fieldid.split(',');
                            }

                            _.each(itemProperty.fieldid, function eachItemPropertyId(itemPropertyID) {
                                itemValue[itemPropertyID] = item.get(itemPropertyID);
                            });

                            itemProperty.isTypeControlActions = true;
                        } else {
                            itemValue = item.get(itemProperty.fieldid);
                        }

                        if (itemProperty.type === 'Image') {
                            itemProperty.isTypeImage = true;
                        }

                        if (itemProperty.fieldid === '_images') {
                            itemValue = _.first(itemValue);
                        }
                        productValues.push(itemValue);
                    }
                });

                // if the product values is not empty, add it in the item property else remove
                if (_.compact(productValues).length !== 0) {
                    itemProperty.productValues = productValues;
                } else {
                    delete tmpItemProperties[key];
                }
            });

            return _.compact(tmpItemProperties);
        }
    });
});
