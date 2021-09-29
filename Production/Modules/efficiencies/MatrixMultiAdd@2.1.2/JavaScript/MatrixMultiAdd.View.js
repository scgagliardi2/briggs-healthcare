define('MatrixMultiAdd.View', [
    'Backbone',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'MatrixMultiAdd.Item.HashMap',
    'GlobalViews.Message.View',
    'QuantityPricing.Utils',

    'MatrixMultiAdd.Row.View',

    'MatrixMultiAdd.SubTotal.View',

    'MatrixMultiAdd.RowHead.View',

    'matrix_multi_add_view.tpl',

    'SC.Configuration',


    'LiveOrder.Model',
    'LiveOrder.Line.Model',

    // Cart
    'Cart.Confirmation.Helpers',

    'underscore',
    'jQuery',

    'Utils'

], function MatrixMultiAddView(
    Backbone,
    BackboneCompositeView,
    BackboneCollectionView,
    MatrixMultiAddItemHashMap,
    GlobalViewsMessageView,
    QuantityPricingUtils,
    MatrixMultiAddRowView,
    MatrixMultiAddSubTotalView,

    MatrixMultiAddRowHeadView,

    Template,

    Configuration,

    LiveOrderModel,
    LiveOrderLineModel,

    // cart
    CartConfirmationHelpers,

    _,
    jQuery,

    Utils
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,
        events: {
            'click [data-action="add-to-cart"]': 'addToCart',
            'input  [data-action="add-quantity"]': 'addQuantity',
            'paste  [data-action="add-quantity"]': 'addQuantity',
            'change [data-action="add-quantity"]': 'addQuantity'
        },

        subscribeView: null,

        initialize: function initialize(options) {
            BackboneCompositeView.add(this);
            this.application = options.application;
            this.itemsForCart = new MatrixMultiAddItemHashMap(); // all items to be added to cart.
            this.validationResponse = '';

            this.cart = LiveOrderModel.getInstance();

            this.colsFieldID = (this.model.get('item').get('_getColsOption')) ? this.model.get('item').get('_getColsOption').get('cartOptionId') : '';
            this.rowsFieldID = (this.model.get('item').get('_getRowsOption')) ? this.model.get('item').get('_getRowsOption').get('cartOptionId') : '';

            try {
                this.subscribeView = Utils.requireModules('BackInStockNotification.Views.Subscribe');
            } catch (e) {
                this.subscribeView = null;
            }

            this.on('afterCompositeViewRender', jQuery.proxy(this.tableHeight, this));
            this.listenTo(this.options.application.getLayout(), 'afterViewRender', jQuery.proxy(this.tableHeight, this));
        },

        tableHeight: function tableHeight() {
            // control the height of the table if its greater than the viewport height
            var header = this.$('[data-section="matrix-multi-add-header"]');
            var grid = this.$('[data-section="matrix-multi-add-table"]');
            var footer = this.$('[data-section="matrix-multi-add-footer"]');
            var moduleHeight = header.height() + grid.height() + footer.height();
            var viewportHeight = jQuery(window).height();
            if (moduleHeight > viewportHeight) {
                // value 30 is to allow some extra space
                jQuery(grid).css('height', viewportHeight - header.height() - footer.height() - 30)
                    .addClass('matrix-multi-add-table-overflow');
            }
        },

        addToCart: function addToCart() {
            var self = this;
            var cartPromise;
            if (this.itemsForCart.getAll().length === 0) {
                this.validationErrorMessage(_.translate('Items For Cart Is Empty'),
                    this.$el.find('.cart-error')
                );
            } else {
                _.each(this.itemsForCart.getAll(), function itemsForCart(item) {
                    item.setItemOption(self.colsFieldID, item.get(self.colsFieldID));
                    item.setItemOption(self.rowsFieldID, item.get(self.rowsFieldID));

                    cartPromise = self.cart.addLine(item);
                });

                // Go to Cart
                CartConfirmationHelpers._goToCart(cartPromise); // eslint-disable-line no-underscore-dangle
            }
        },

        addQuantity: function addQuantity(e) {
            var $target = jQuery(e.target);
            var model = this.model.clone();
            var colValue = ($target.closest('tr').data('rowid')) ? $target.closest('tr').data('rowid').toString() : 0;
            var rowValue = ($target.data('rowid')) ? $target.data('rowid').toString() : 0;
            var quantity;

            quantity = parseInt($target.val(), 10);

            // validate if value of Quantity is NaN
            if ((isNaN(quantity))) {
                quantity = 0;
            }
            if (colValue) {
                model.setOption(this.colsFieldID, colValue);
            }
            if (rowValue) {
                model.setOption(this.rowsFieldID, rowValue);
            }

            model.set('quantity', quantity);

            // validate Item
            this.validate(model, $target);
            if (quantity < 1) {
                this.itemsForCart.remove({
                    col: colValue,
                    row: rowValue
                });
            } else {
                this.itemsForCart.put({
                    col: colValue,
                    row: rowValue
                }, model);
            }
            // Grand Total
            this.getTotal(colValue, rowValue);
        },
        validate: function validate(model, currentTarget) {
            var validationResult = model.validateStocks();
            var stockInfo = model.getStockInfo();
            var form;
            var container = this.$el.find('.matrix-stockinfo');

            if (validationResult.itemStatus) {
                this.validationResponse = validationResult.itemStatus;
            } else {
                this.validationResponse = '';
            }

            if (this.validationResponse) {
                this.validationErrorMessage(this.validationResponse, this.$el.find('.item-error'));
                if (!stockInfo.isInStock && stockInfo.showOutOfStockMessage && this.subscribeView) {
                    form = new this.subscribeView({
                        application: this.application,
                        itemModel: this.model,
                        configuration: Configuration
                    });

                    container.attr('data-type', 'backinstocknotification-control-placeholder');
                    container.html('').append(form.$el);
                    form.render();
                }
            } else {
                this.$el.find('.global-views-message-button').click();
                this.$el.find('.matrix-stockinfo').html('');
            }

            // set quantity for the current child matrix
            currentTarget.val(model.get('quantity'));
        },

        validationErrorMessage: function validationErrorMessage(msg, container) {
            var globalViewMessage;
            var msgContainerParent;

            globalViewMessage = new GlobalViewsMessageView({
                message: msg,
                type: 'error',
                closable: true
            });
            msgContainerParent = container;
            msgContainerParent.html(globalViewMessage.render().$el.html());
        },

        getTotal: function getTotal(col, row) {
            this.$el.find('.grandtotal').html(
                _.formatCurrency(this.itemsForCart.getTotal(col, row))
            );
        },
        getOptionValues: function getOptionValues() {
            var thumbnails = this.model.get('item').get('itemimages_detail') && this.model.get('item').get('itemimages_detail').media;
            var cols = this.model.get('item').get('_getColorOptions');
            var optionValues = this.model.get('item').get('_getColsOption');
            var self = this;
            var cloneModel = this.model.clone();
            var colsCatOptionId = (optionValues) ? optionValues.get('cartOptionId') : [];
            var getChildMatrix;
            var qytAvailableperRow;

            if (optionValues) {
                optionValues = _.map(optionValues.get('values'), function mapcolsOptions(colsOptionValue) {
                    if (colsOptionValue.internalid) {
                        cloneModel.setOption(colsCatOptionId, colsOptionValue.internalid);
                        getChildMatrix = cloneModel.getSelectedMatrixChilds()[0];
                        qytAvailableperRow = getChildMatrix.get('quantityavailable');
                        return {
                            internalid: colsOptionValue.internalid,
                            isAvailable: colsOptionValue.isAvailable,
                            label: colsOptionValue.label,
                            thumbnail: (thumbnails) ? thumbnails[colsOptionValue.label] : [],
                            cols: (_.findWhere(cols, { colorsname: colsOptionValue.label })) ?
                                   _.findWhere(cols, { colorsname: colsOptionValue.label }).hex : '',
                            rows: self.getrowsOptionValues(colsOptionValue.internalid),
                            priceSchedule: (self.getrowsOptionValues(colsOptionValue.internalid).length === 0) ? self.getPriceSchedule(cloneModel) : [],
                            originalPrice: getChildMatrix.get('_priceDetails').onlinecustomerprice_formatted,
                            qytAvailable: qytAvailableperRow
                        };
                    }
                    return null;
                });

                // if column is not available only row
            } else {
                optionValues = {
                    rows: self.getrowsOptionValues()
                };
            }

            return optionValues;
        },

        getcolsOptionValues: function getcolsOptionValues() {
            var thumbnails = this.model.get('item').get('itemimages_detail') && this.model.get('item').get('itemimages_detail').media;
            var cols = this.model.get('item').get('_getColorOptions');
            var colsOptions = this.model.get('item').get('_getColsOption');

            if (colsOptions) {
                colsOptions = _.map(colsOptions.get('values'), function mapcolsOptions(colsOptionValue) {
                    if (colsOptionValue.internalid) {
                        return {
                            internalid: colsOptionValue.internalid,
                            isAvailable: colsOptionValue.isAvailable,
                            label: colsOptionValue.label,
                            thumbnail: (thumbnails) ? thumbnails[colsOptionValue.label] : [],
                            cols: cols[colsOptionValue.label]
                        };
                    }
                    return null;
                });
            }
            return colsOptions;
        },

        getrowsOption: function getrowsOption() {
            var rowsOptions;
            if (this.model.get('item').get('_getRowsOption')) {
                rowsOptions = _.findWhere(this.model.get('item').get('itemoptions_detail').fields, {
                    internalid: this.model.get('item').get('_getRowsOption').get('cartOptionId')
                });
            }

            return rowsOptions;
        },

        getcolsOption: function getcolsOption() {
            var colsOptions;
            if (this.model.get('item').get('_getColsOption')) {
                colsOptions = _.findWhere(this.model.get('item').get('itemoptions_detail').fields, {
                    internalid: this.model.get('item').get('_getColsOption').get('cartOptionId')
                });
            }

            return colsOptions;
        },

        getrowsOptionValues: function getrowsOptionValues(colsID) {
            var rowsItems;
            var available;
            var self;
            var childs;
            var childModel;
            var colsInternalId;
            var rowsOptions;
            var qtyPricing;
            var pricePerRow;
            var cloneModel;
            var originalPrice;
            var originalPricePerRow;
            var qytAvailableperRow;

            rowsOptions = this.getrowsOption();
            rowsItems = [];
            self = this;

            cloneModel = self.model.clone();

            if (rowsOptions) {
                rowsItems = _.map(rowsOptions.values, function mapRowItems(rowsData) {
                    if (colsID) {
                        cloneModel.setOption(cloneModel.get('item').get('_getColsOption').get('cartOptionId'), colsID, true);
                    }

                    if (rowsData.internalid) {
                        cloneModel.setOption(cloneModel.get('item').get('_getRowsOption').get('cartOptionId'), rowsData.internalid, true);
                    }

                    childs = cloneModel.getSelectedMatrixChilds();
                    childModel = null;
                    if (childs && childs.length === 1) {
                        childModel = childs[0];
                    }

                    if (childModel) {
                        colsInternalId = colsID;
                        available = true;
                        qtyPricing = self.getPriceSchedule(cloneModel);
                        originalPrice = childModel.get('_priceDetails').onlinecustomerprice_formatted;
                        qytAvailableperRow = childModel.get('quantityavailable');
                    } else {
                        available = false;
                        qtyPricing = [];
                        originalPrice = [];
                        qytAvailableperRow = '';
                    }

                    pricePerRow = (rowsData.internalid) ? qtyPricing : [];
                    originalPricePerRow = (rowsData.internalid) ? originalPrice : [];

                    return {
                        colsID: colsInternalId,
                        internalid: (rowsData.internalid) ? rowsData.internalid : '',
                        label: rowsData.label,
                        isAvailable: available,
                        priceSchedule: pricePerRow,
                        originalPrice: originalPricePerRow,
                        qytAvailable: qytAvailableperRow
                    };
                });
            }

            return rowsItems;
        },

        getPriceSchedule: function getPriceSchedule(model) {
            var priceSchedule = QuantityPricingUtils.rearrangeQuantitySchedule(model.get('item'),
                _.isFunction(model.getSelectedMatrixChilds) ?
                model.getSelectedMatrixChilds() : []
            );

            return priceSchedule;
        },

        childViews: {
            'MatrixMultiAdd.RowHead': function childViewRowHead() {
                return new BackboneCollectionView({
                    collection: (this.getrowsOption()) ? this.getrowsOption() : [],
                    childView: MatrixMultiAddRowHeadView,
                    viewsPerRow: 1
                });
            },

            'MatrixMultiAdd.Row': function childViewRow() {
                return new BackboneCollectionView({
                    collection: new Backbone.Collection(this.getOptionValues()),
                    childView: MatrixMultiAddRowView,
                    viewsPerRow: 10,
                    childViewOptions: {
                        rowsCollection: new Backbone.Collection(this.getrowsOptionValues()),
                        colsCollection: new Backbone.Collection(this.getcolsOptionValues()),
                        itemsForCart: this.itemsForCart
                    }
                });
            }
        },

        getContext: function getContext() {
            var isMatrixDimension;
            var colsOnly = false;

            // check if item is matrix
            if (this.getrowsOption()) {
                isMatrixDimension = this.getrowsOption().ismatrixdimension;
            } else {
                if (this.getcolsOption()) { // eslint-disable-line no-lonely-if
                    isMatrixDimension = this.getcolsOption().ismatrixdimension;
                    colsOnly = true;
                } else {
                    isMatrixDimension = [];
                }
            }

            return {
                showGrid: this.model.get('item').get('_showGrid'),
                ismatrixdimension: isMatrixDimension,
                colsOnly: colsOnly,
                total: _.formatCurrency(this.itemsForCart.getTotal())
            };
        }
    });
});
