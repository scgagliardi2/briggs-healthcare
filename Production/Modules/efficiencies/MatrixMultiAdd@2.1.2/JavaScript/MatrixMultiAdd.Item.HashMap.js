define('MatrixMultiAdd.Item.HashMap', [
    'Backbone',
    'underscore',
    'Utils'
], function MatrixMultiAddOrderLineHashMap(
    Backbone,
    _
) {
    'use strict';

    var COLUMN = 'col';
    var ROW = 'row';

    return Backbone.Model.extend({
        initialize: function initialize() {
            this.data = {};
        },
        put: function put(key, value) {
            if (!this.data[key[COLUMN]]) {
                this.data[key[COLUMN]] = {};
            }
            this.data[key[COLUMN]][key[ROW]] = value;
            this.trigger('put', value);
        },
        remove: function remove(key) {
            if (!this.data[key[COLUMN]]) {
                this.data[key[COLUMN]] = {};
            }
            delete this.data[key[COLUMN]][key[ROW]];
            this.trigger('remove', key);
        },
        get: function get(key) {
            return this.data[key[COLUMN]] && this.data[key[COLUMN]][key[ROW]];
        },
        getAll: function getAll() {
            var all = [];
            _.each(this.data, function eachColumn(rows) {
                _.each(rows, function eachRow(value) {
                    all.push(value);
                });
            });
            return all;
        },
        getTotal: function getTotal() {
            var sum = 0;
            var colsOptions;
            var rowsOptions;
            _.each(this.getAll(), function eachGetAll(item) {
                colsOptions = (item.get('item').get('_getColsOption')) ? item.get('item').get('_getColsOption').get('cartOptionId') : '';
                rowsOptions = (item.get('item').get('_getRowsOption')) ? item.get('item').get('_getRowsOption').get('cartOptionId') : '';
                item.setItemOption(colsOptions, item.get(colsOptions));
                item.setItemOption(rowsOptions, item.get(rowsOptions));
                sum += item.getEstimatedAmount();
            });
            return sum;
        }
    });
});
