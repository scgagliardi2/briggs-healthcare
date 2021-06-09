define('CustomerSegments.ProductViews.Price.View', [
    'Backbone',
    'ProductViews.Price.View',
    'CustomerSegments.Helper',
    'Cart.Summary.View',
    'Cart.Item.Summary.View',
    'Header.MiniCart.View',
    'Header.MiniCartItemCell.View',
    'ProductDetails.Full.View',
    'ProductDetails.QuickView.View',
    'Transaction.Line.Views.Price.View',
    'SC.Configuration',

    'jQuery',
    'underscore',
    'Utils'
], function CustomerSegmentsProductViewsPriceView(
    Backbone,
    ProductViewsPriceView,
    Helper,
    CartSummaryView,
    CartItemSummaryView,
    HeaderMiniCartView,
    HeaderMiniCartItemCellView,
    ProductDetailsFullView,
    ProductDetailsQuickViewView,
    TransactionLineViewsPriceView,
    Configuration,

    jQuery,
    _
) {
    'use strict';

    var itemPrice = {
        hidePrice: function hidePrice(isHidePrices) {
            var self = this;
            this.cartView();
            this.cartItemView();
            this.headerMiniCartView();
            this.headerMiniCartItemCellView();
            this.transactionLinePriceView();
            ProductViewsPriceView.prototype.getContext =
                _.wrap(ProductViewsPriceView.prototype.getContext, function ProductViewsPriceViewFunction(fn) {
                    var result;
                    var context = fn.call(this);
                    var hidePriceItem = false;
                    var itemGroups = self.checkItemGroup(context);

                    if (itemGroups) {
                        hidePriceItem = _.filter(isHidePrices, function fnIsHidePrices(cg) {
                            return itemGroups.includes(cg.groups) && cg.hidePrice;
                        });

                        if (hidePriceItem && !_.isEmpty(hidePriceItem)) {
                            this.on('beforeCompositeViewRender', function afterViewRender() {
                                this.$el.find('.product-views-price-login-to-see-prices').html('');
                            });

                            result = {
                                line: '',
                                isPriceRange: '',
                                showComparePrice: false,
                                currencyCode: '',
                                priceFormatted: '',
                                price: '',
                                comparePrice: '',
                                minPrice: '',
                                maxPrice: '',
                                comparePriceFormatted: '',
                                minPriceFormatted: '',
                                maxPriceFormatted: ''
                            };
                            _.extend(context, result);
                        }
                    }

                    return context;
                });
        },
        cartView: function cartView() {
            CartSummaryView.prototype.getContext =
                _.wrap(CartSummaryView.prototype.getContext, function CartViewFunction(fn) {
                    var result;
                    var context = fn.call(this);
                    result = {
                        summary: null
                    };
                    _.extend(context, result);
                    return context;
                });
        },
        cartItemView: function cartItemView() {
            CartItemSummaryView.prototype.getContext =
                _.wrap(CartItemSummaryView.prototype.getContext, function CartItemFunction(fn) {
                    var context = fn.call(this);
                    this.model.set('total_formatted', '');
                    return context;
                });
        },
        transactionLinePriceView: function transactionLinePriceView() {
            TransactionLineViewsPriceView.prototype.getContext =
                _.wrap(TransactionLineViewsPriceView.prototype.getContext, function CartItemFunction(fn) {
                    var context = fn.call(this);
                    var result = {
                        price: '',
                        rateFormatted: '',
                        showComparePrice: '',
                        comparePriceFormatted: ''
                    };
                    _.extend(context, result);

                    return context;
                });
        },
        headerMiniCartView: function headerMiniCartView() {
            HeaderMiniCartView.prototype.getContext =
                _.wrap(HeaderMiniCartView.prototype.getContext, function HeaderMiniCartViewFunction(fn) {
                    var context = fn.call(this);
                    var result;
                    result = {
                        isPriceEnabled: false
                    };
                    _.extend(context, result);

                    return context;
                });
        },
        headerMiniCartItemCellView: function headerMiniCartItemCellView() {
            HeaderMiniCartItemCellView.prototype.getContext =
                _.wrap(HeaderMiniCartItemCellView.prototype.getContext, function headerMiniCartItemCellViewFunction(fn) {
                    var context = fn.call(this);
                    this.model.set('rate_formatted', '');
                    return context;
                });
        },
        hideAddToCart: function hideAddToCart(isHideAddtoCart) {
            this.hideCartBtn(ProductDetailsFullView, isHideAddtoCart);
            this.hideCartBtn(ProductDetailsQuickViewView, isHideAddtoCart);
        },
        hideCartBtn: function hideCartBtn(View, isHideAddtoCart) {
            var self = this;
            var itemGroups;
            var hideButton;

            View.prototype.initialize = _.wrap(View.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                itemGroups = self.checkItemGroup(this);

                if (itemGroups) {
                    hideButton = _.filter(isHideAddtoCart, function fnIsHidePrices(cg) {
                        return itemGroups.includes(cg.groups) && cg.hideAddToCart;
                    });
                    if (hideButton && !_.isEmpty(hideButton)) {
                        this.on('afterViewRender', function afterViewRender() {
                            this.$el.find('[data-view="MainActionView"]').remove();
                            this.$el.find('.MainActionView').html('');
                        });
                    }
                }
            });
        },
        checkItemGroup: function checkItemGroup(context) {
            var itemGroups = false;

            if (context.model.get('custitem_item_customersegments')) {
                itemGroups = context.model.get('custitem_item_customersegments').split(',');
            } else if (context.model.get('item')) {
                itemGroups = context.model.get('item').get('custitem_item_customersegments');
                if (!itemGroups || _.isEmpty(itemGroups)) {
                    itemGroups = false;
                } else {
                    itemGroups = itemGroups.split(',');
                }
            }

            return itemGroups;
        }
    };
    return itemPrice;
});
