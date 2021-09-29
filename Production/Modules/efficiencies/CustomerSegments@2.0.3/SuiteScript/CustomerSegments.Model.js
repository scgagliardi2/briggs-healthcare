define('CustomerSegments.Model', [
    'Configuration',
    'SC.Model',
    'SearchHelper',
    'underscore'
], function CustomerSegmentsModel(
    Configuration,
    SCModel,
    SearchHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'CustomerSegments',

        record: 'entitygroup',

        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],

        columns: {
            internalid: { fieldName: 'internalid' },
            groupname: { fieldName: 'groupname' },
            logo: { fieldName: 'custentity_customersegment_logo', type: 'object' },
            banner: { fieldName: 'custentity_customersegment_banner', type: 'object' },
            category: { fieldName: 'custentity_entitygroup_commercecategory', type: 'object' },
            bannertext: { fieldName: 'custentity_customersegment_banner_text' },
            isHidePrices: { fieldName: 'custentity_customersegment_hide_prices' },
            isHideAddtoCart: { fieldName: 'custentity_customersegment_hide_add2cart' }
        },

        get: function get(groupIds) {
            var search;
            var results;
            var banners = [];
            var logos = [];
            var categories = [];
            var isHidePrices = [];
            var isHideAddtoCart = [];

            var category;

            search = new SearchHelper(this.record, this.filters, this.columns);

            search.addFilter({
                fieldName: this.columns.internalid.fieldName,
                operator: 'anyof',
                value1: groupIds.split(',')
            });

            search.search();

            results = search.getResults();

            if (!results) {
                throw notFoundError;
            }

            // Structure the data base on frontend needs
            _(results).each(function eachResult(result) {
                category = _.pick(result.category, 'name').name || '';
                category = category.split(',');
                isHideAddtoCart.push({
                    groups: result.groupname,
                    hideAddToCart: result.isHideAddtoCart === 'T'
                });
                isHidePrices.push({
                    groups: result.groupname,
                    hidePrice: result.isHidePrices === 'T'
                });
                logos.push(_.pick(result.logo, 'name').name);
                banners.push({
                    title: result.groupname,
                    image: _.pick(result.banner, 'name').name,
                    imageLogo: _.pick(result.logo, 'name').name,
                    text: result.bannertext || '',
                    href: '/search'
                });
                categories = _.union(categories, category);
            });


            Configuration.customerSegments = {
                logos: logos,
                banners: banners,
                categories: _.compact(categories),
                isHidePrices: isHidePrices,
                isHideAddtoCart: isHideAddtoCart

            };

            return {
                logos: logos,
                banners: banners,
                categories: _.compact(categories),
                isHidePrices: isHidePrices,
                isHideAddtoCart: isHideAddtoCart

            };
        }
    });
});
