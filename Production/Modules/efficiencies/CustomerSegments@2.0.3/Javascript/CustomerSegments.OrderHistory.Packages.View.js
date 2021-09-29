define('CustomerSegments.OrderHistory.Packages.View', [
    'Backbone.CollectionView',
    'PluginContainer',
    'OrderHistory.Packages.View',
    'Transaction.Line.Views.Cell.Actionable.View',
    'Transaction.Line.Views.QuantityAmount.View',
    'OrderHistory.Item.Actions.View',

    'jQuery',
    'underscore'
], function CustomerSegmentsOrderHistoryPackagesView(
    BackboneCollectionView,
    PluginContainer,
    OrderHistoryPackagesView,
    TransactionLineViewsCellActionableView,
    TransactionLineViewsQuantityAmountView,
    OrderHistoryItemActionsView,

    jQuery,
    _
) {
    'use strict';

    _.extend(OrderHistoryPackagesView.prototype, {
        initialize: _.wrap(OrderHistoryPackagesView.prototype.initialize, function wrapInitialize(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.lines = this.setCurrentView(this.model.get('lines'));
        }),
        setCurrentView: function setCurrentView(lines) {
            _.map(lines, function mapLines(line) {
                line.get('item').set({ view: 'salesorder' });
            });

            return lines;
        },
        childViews: _.extend(OrderHistoryPackagesView.prototype.childViews, {
            'Items.Collection': function ItemsCollection() {
                return new BackboneCollectionView({
                    collection: this.lines,
                    childView: TransactionLineViewsCellActionableView,
                    viewsPerRow: 1,
                    childViewOptions: {
                        navigable: true,
                        application: this.options.application,
                        SummaryView: TransactionLineViewsQuantityAmountView,
                        ActionsView: OrderHistoryItemActionsView
                    }
                });
            }
        })
    });
});
