define('MatrixMultiAdd.ItemsKeyMapping', [
    'Backbone',
    'SC.Configuration',
    'underscore'
], function MatrixMultiAddItemsKeyMapping(
    Backbone,
    Configuration,
    _
) {
    'use strict';

    Configuration.itemKeyMapping = Configuration.itemKeyMapping || {};
    _.extend(Configuration.itemKeyMapping, {
        _showGrid: function showGridItem(item) {
            var matrixChildren = item.get('_matrixChilds') && item.get('_matrixChilds').length;
            var siteWide = Configuration.get('matrixMultiAddtoCart');
            var perItem = item.get('custitem_ef_mma_show');

            // Only enable the feature when we have 1 or 2 matrix options
            if (item.get('_matrixOptions') && item.get('_matrixOptions').length <= 2) {
                if (_.isPhoneDevice() !== true) {
                    if (matrixChildren !== 0) {
                        if (siteWide.siteWide || perItem) {
                            return true;
                        }
                    }
                }

                // disable this module on small mobile devices or if there are no matrix options
                return false;
            }

            // disable this module on small mobile devices or if there are no matrix options
            return false;
        },
        _matrixOptions: function _matrixOptions(item) {
            var matrixDimension = item.getPosibleOptions().filter(function filterItemPossibleOptions(result) {
                var filterResult = (_.filter(result, { isMatrixDimension: true })[0]);

                return filterResult;
            });

            return matrixDimension;
        },
        _getColsOption: function _getColsOption(item) {
            var colOptions;
            var optionIds = item.get('_matrixOptions').map(function pluckCartOptionsId(data) {
                return data.get('cartOptionId');
            });

            var cols = _.pluck(Configuration.get('matrixMultiAddtoCart.fields'), 'columnFieldsID');

            var colsPossibleOptions = _.intersection(
                cols,
                optionIds
            );

            colOptions = item.getPosibleOptions().filter(function filterItemPossibleOptions(result) {
                var filterResult = (_.where(result, { cartOptionId: colsPossibleOptions[0] })[0]);
                return filterResult;
            });

            return colOptions[0];
        },

        _getRowsOption: function _getRowsOption(item) {
            var rowOptions;
            var optionIds = item.get('_matrixOptions').map(function pluckCartOptionsId(data) {
                return data.get('cartOptionId');
            });

            var row = _.pluck(Configuration.get('matrixMultiAddtoCart.fields'), 'rowsFieldIds');

            var rowsPossibleOptions = _.intersection(
                row,
                optionIds
            );

            rowOptions = item.getPosibleOptions().filter(function filterItemPossibleOptions(result) {
                var filterResult = (_.where(result, { cartOptionId: rowsPossibleOptions[0] })[0]);
                return filterResult;
            });

            return rowOptions[0];
        },
        _getColorOptions: function _getColorOptions() {
            return Configuration.get('matrixMultiAddtoCart.color');
        }
    });
});
