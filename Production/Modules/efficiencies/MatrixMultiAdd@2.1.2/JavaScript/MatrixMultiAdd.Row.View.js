define('MatrixMultiAdd.Row.View', [
    'Backbone',
    'QuantityPricing.View',
    'MatrixMultiAdd.Item.HashMap',
    'matrix_multi_add_row.tpl',
    'underscore',
    'jQuery',
    'Utils'
], function MatrixMultiAddRowView(
    Backbone,
    QuantityPricingView,
    MatrixMultiAddItemHashMap,
    Template,
    _,
    jQuery

) {
    'use strict';

    var isDisplay;

    return Backbone.View.extend({
        template: Template,

        events: {
            'click [data-action="mma-moredetails"]': 'showPrices',
            'click [data-field="input"]': 'stopPropagation'
        },

        showPrices: function showPrices(e) {
            var $target = this.$el.find(e.currentTarget);
            var $rowID = $target.data('rowid') || $target.closest('tr').data('rowid');
            // this.$el.find('tr[data-priceid]') or this.$('tr[data-priceid]')
            // produces the incorrect behaviour if used below
            var $priceID = jQuery('tr[data-priceid]');
            var collapseClass = 'matrix-multi-add-collapse';
            $priceID.each(function eachPriceID(i, tr) {
                // show the prices under the clicked tr and
                // if tr isn't the one clicked and doesn't have collapse class then add it
                $priceID = jQuery(tr).data('priceid');
                if ($priceID === $rowID) {
                    jQuery(tr).toggleClass(collapseClass);
                } else if (($priceID !== $rowID) && (!jQuery(tr).hasClass(collapseClass))) {
                    jQuery(tr).addClass(collapseClass);
                }
            });
        },

        stopPropagation: function stopPropagation(e) {
            // don't open the pricing row when user clicks on the quantity input field
            e.stopPropagation();
        },

        getContext: function getContext() {
            var priceCollection;
            var isRows;
            if (this.model.get('internalid')) {
                isDisplay = this.model.get('internalid');
            } else {
                isDisplay = this.model.get('rows');
            }

            // price Schedule Model
            if (this.model.get('rows') !== undefined) {
                priceCollection = (this.model.get('rows').length !== 0) ? this.model.get('rows') : [this.model.attributes];
                isRows = this.model.get('rows').length === 0;
            }

            return {
                isDisplay: isDisplay,
                uniqueID: this.model.get('internalid'),
                thumbnailImage: this.model.get('thumbnail'),
                colsLabel: this.model.get('label'),
                cols: this.model.get('cols'),
                colsCollection: this.model.attributes,
                rowsCollection: this.model.get('rows'),
                priceCollection: priceCollection,
                isRows: isRows
            };
        }
    });
});
