define('MatrixMultiAdd.Item.Model', [
    'Product.Model',
    'Backbone',
    'bignumber',
    'underscore',
    'Utils'
], function MatrixMultiAddItemModel(
    ProductModel,
    Backbone,
    bigNumber,
    _
) {
    'use strict';

    _.extend(ProductModel.prototype, {
        validateStocks: function validateStocks() {
            var itemName;
            var minimumQuantity;
            var itemStatus;
            var model;
            var stocks;
            var stockInfo;

            model = this.getSelectedMatrixChilds()[0];
            stockInfo = model.getStockInfo();
            itemName = model.get('_name');
            minimumQuantity = model.get('_minimumQuantity');
            stocks = stockInfo.stock;
            itemStatus = '';


            // set parent quantity equal to child
            model.set('quantity', this.get('quantity'));

            if (model.get('quantity') !== 0) {
             // if item is out of stock and not backorderable
                if (!model.get('_isPurchasable')) {
                    if (model.get('_showOutOfStockMessage')) {
                        itemStatus = _.translate(
                            '$(0) is $(1)',
                            itemName,
                            stockInfo.outOfStockMessage
                        );
                    } else {
                        itemStatus = _.translate(
                            '$(0) is not available',
                            itemName
                        );
                    }
                    this.set('quantity', 0);
                    model.set('quantity', 0);
                } else {
                    if (this.get('item').get('_itemType') === 'InvtPart') { // eslint-disable-line no-lonely-if
                        if (!model.get('_isInStock')) {
                            if (model.get('_isBackorderable') && model.get('_showOutOfStockMessage')) {
                                itemStatus = _.translate(
                                    '$(0) is $(1)',
                                    itemName,
                                    stockInfo.outOfStockMessage
                                );
                            }
                        } else {
                            // // added on elbrus if OOS is default
                            if (model.get('outofstockbehavior') !== '- Default -') { // eslint-disable-line no-lonely-if
                                if (minimumQuantity > model.get('quantity')) {
                                    itemStatus = _.translate(
                                         '$(0) has a minimum quantity of $(1)',
                                         itemName,
                                         minimumQuantity
                                    );
                                }
                                // if qty is more than stocks
                                if (stocks < model.get('quantity')) {
                                    itemStatus = _.translate(
                                        '$(0) items of $(1) are not available. Only $(2) item(s) are in stock',
                                        model.get('quantity'),
                                        itemName,
                                        stocks
                                    );
                                    if (!model.get('_isBackorderable')) {
                                        model.set('quantity', stocks);
                                        this.set('quantity', stocks);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return {
                itemName: itemName,
                minimumQuantity: minimumQuantity,
                itemStatus: itemStatus,
                stocks: stocks,
                showOutOfStockMessage: stockInfo.showOutOfStockMessage
            };
        },

        getEstimatedRate: function getEstimatedRate() {
            var result;
            var childMOdel = this.getSelectedMatrixChilds()[0];
            var priceSchedule = childMOdel.get('_priceDetails');
            var qty = '';

            childMOdel.set('quantity', this.get('quantity'));
            qty = parseInt(childMOdel.get('quantity'), 10);

            _.each(priceSchedule.priceschedule, function eachPriceSchedule(data) {
                if ((data.minimumquantity <= qty) && (data.maximumquantity >= qty)) {
                    result = data.price;
                }

                if ((data.minimumquantity <= qty) && (data.maximumquantity === undefined)) {
                    result = data.price;
                }
            });

            if (typeof result === 'undefined') {
                result = this.getSelectedMatrixChilds()[0].get('_price');
            }
            return result;
        },

        getEstimatedAmount: function getEstimatedAmount() {
            var result = 0;
            var model = this.getSelectedMatrixChilds()[0];

            model.set('quantity', this.get('quantity'));
            model.set('quantity', this.get('quantity'));

            if (model.get('_isPurchasable')) {
                if (!(model.get('minimumquantity') > model.get('quantity'))) {
                    if (this.getEstimatedRate()) {
                        result = bigNumber(this.getEstimatedRate()).times(model.get('quantity')).toNumber();
                    }
                }
            }
            return result;
        },

        setItemOption: function setItemOption(cartOptionField, value) {
            var selectedOption = this.get('options').findWhere({ cartOptionId: cartOptionField });
            var selectedValue = selectedOption && _.findWhere(selectedOption.get('values'), { internalid: value });

            if (selectedOption) {
                if (selectedValue) {
                    selectedOption.set('value', {
                        internalid: selectedValue.internalid,
                        label: selectedValue.label
                    });
                }
            }
        }
    });
});
