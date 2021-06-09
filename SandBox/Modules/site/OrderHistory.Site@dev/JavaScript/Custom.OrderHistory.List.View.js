define('Custom.OrderHistory.List.View', [
    'Backbone',
    'SC.Configuration',
    'ListHeader.View',
    'Backbone.CompositeView',
    'OrderHistory.List.View',
    'Backbone.CollectionView',
    'RecordViews.Actionable.View',
    'OrderHistory.List.Tracking.Number.View',
    'Handlebars',
    'underscore'
], function ListView(
    Backbone,
    Configuration,
    ListHeaderView,
    BackboneCompositeView,
    OrderHistoryListView,
    BackboneCollectionView,
    RecordViewsActionableView,
    OrderHistoryListTrackingNumberView,
    Handlebars,
    _
) {
    'use strict';

    _.extend(OrderHistoryListView.prototype, {
        initialize: function initialize(options) {
            var isoDate = _.dateToString(new Date());

            this.application = options.application;
            this.collection = options.collection;
            this.isSCISIntegrationEnabled = Configuration.get('siteSettings.isSCISIntegrationEnabled', false);

            this.rangeFilterOptions = {
                fromMin: '1800-01-02',
                fromMax: isoDate,
                toMin: '1800-01-02',
                toMax: isoDate
            };

            this.listenCollection();

            this.listHeader = new ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: 'date',
                rangeFilterLabel: _('From').translate(),
                hidePagination: true,
                allowEmptyBoundaries: true,
                poNumberSearch: true
            });

            BackboneCompositeView.add(this);
        }
    });

    _.extend(OrderHistoryListView.prototype.childViews, {
        'Order.History.Results': function OrderHistoryResults() {
            var self = this;
            var recordsCollection = new Backbone.Collection(this.collection.map(function map(order) {
                var dynamicColumn;
                var columns;
                var model;

                if (self.isSCISIntegrationEnabled) {
                    dynamicColumn = {
                        label: _('Origin:').translate(),
                        type: 'origin',
                        name: 'origin',
                        value: _.findWhere(Configuration.get('transactionRecordOriginMapping'), { origin: order.get('origin') || null }).name
                    };
                } else {
                    dynamicColumn = {
                        label: _('Status:').translate(),
                        type: 'status',
                        name: 'status',
                        value: order.get('status').name
                    };
                }

                columns = [{
                    label: _('Purchase No.').translate(),
                    type: 'ponumber',
                    name: 'ponumber',
                    value: order.get('ponumber')
                }, {
                    label: _('Date:').translate(),
                    type: 'date',
                    name: 'date',
                    value: order.get('trandate')
                }, {
                    label: _('Amount:').translate(),
                    type: 'currency',
                    name: 'amount',
                    value: order.get('amount_formatted')
                }];

                if (!_.isUndefined(dynamicColumn)) {
                    columns.push(dynamicColumn);
                }

                model = new Backbone.Model({
                    title: new Handlebars.SafeString(_('<span class="tranid">$(0)</span>').translate(order.get('tranid'))),
                    touchpoint: 'customercenter',
                    detailsURL: '/purchases/view/' + order.get('recordtype') + '/' + order.get('internalid'),
                    recordType: order.get('recordtype'),
                    id: order.get('internalid'),
                    internalid: order.get('internalid'),
                    trackingNumbers: order.get('trackingnumbers'),
                    columns: columns
                });

                return model;
            }));

            return new BackboneCollectionView({
                childView: RecordViewsActionableView,
                collection: recordsCollection,
                viewsPerRow: 1,
                childViewOptions: {
                    actionView: OrderHistoryListTrackingNumberView,
                    actionOptions: {
                        showContentOnEmpty: true,
                        contentClass: '',
                        collapseElements: true
                    }
                }
            });
        }
    });
});
