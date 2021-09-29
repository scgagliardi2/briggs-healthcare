define('ItemBadges.Model', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function ItemBadgesModel(
    SCModel,
    SearchHelper,
    _
) {
    'use strict';

    // @extends SCModel
    return SCModel.extend({
        name: 'ItemBadges',

        record: 'customrecord_ef_item_badges',

        fieldsets: {
            basic: [
                'internalid',
                'name',
                'bgColor',
                'icon',
                'alt',
                'weight'
            ]
        },

        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],

        columns: {
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' },
            bgColor: { fieldName: 'custrecord_ef_item_badges_bgcolor' },
            icon: { fieldName: 'custrecord_ef_item_badges_image', type: 'file' },
            alt: { fieldName: 'custrecord_ef_item_badges_alt' },
            weight: { fieldName: 'custrecord_ef_item_badges_weight', sort: 'asc' }
        },

        list: function list() {
            var Search;
            var filters = _.clone(this.filters);

            Search = new SearchHelper(this.record, filters, this.columns, this.fieldsets.basic).search();

            return Search.getResults();
        }
    });
});
