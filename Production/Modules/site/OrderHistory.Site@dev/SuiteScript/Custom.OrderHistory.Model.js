define('Custom.OrderHistory.Model', [
    'OrderHistory.Model',
    'underscore'
], function CustomOrderHistoryModel(
    OrderHistoryModel,
    _
) {
    'use strict';

    _.extend(OrderHistoryModel, {
        setExtraListColumns: function setExtraListColumns() {
            this.columns.ponumber = new nlobjSearchColumn('otherrefnum');
            this.columns.trackingnumbers = new nlobjSearchColumn('trackingnumbers');

            if (!this.isSCISIntegrationEnabled) return;

            this.columns.origin = new nlobjSearchColumn('formulatext');

            this.columns.origin.setFormula('case when LENGTH({source})>0 then 2 else (case when {location.locationtype.id} = \'' +
                SC.Configuration.locationTypeMapping.store.internalid +
                '\' then 1 else 0 end) end');
        },

        setExtraListFilters: function setExtraListFilters() {
            if (this.data.ponumber) {
                this.filters.otherrefnum_operator = 'and';
                this.filters.otherrefnum = ['otherrefnum', 'equalto', this.data.ponumber];
            }

            if (this.data.filter === 'status:open') {
                this.filters.type_operator = 'and';
                this.filters.type = ['type', 'anyof', ['SalesOrd']];
                this.filters.status_operator = 'and';
                this.filters.status = ['status', 'anyof', ['SalesOrd:A', 'SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']];
            } else if (this.isSCISIntegrationEnabled) {
                if (this.data.filter === 'origin:instore') {
                    this.filters.scisrecords_operator = 'and';
                    this.filters.scisrecords = [
                        ['type', 'anyof', ['CashSale', 'CustInvc', 'SalesOrd']],
                        'and',
                        ['createdfrom.type', 'noneof', ['SalesOrd']],
                        'and',
                        ['location.locationtype', 'is', SC.Configuration.locationTypeMapping.store.internalid],
                        'and',
                        ['source', 'is', '@NONE@']
                    ];
                } else {
                    this.filters.scisrecords_operator = 'and';
                    this.filters.scisrecords = [
                        [
                            ['type', 'anyof', ['CashSale', 'CustInvc']],
                            'and',
                            ['createdfrom.type', 'noneof', ['SalesOrd']],
                            'and',
                            ['location.locationtype', 'is', SC.Configuration.locationTypeMapping.store.internalid],
                            'and',
                            ['source', 'is', '@NONE@']
                        ],
                        'or',
                        [
                            ['type', 'anyof', ['SalesOrd']]
                        ]
                    ];
                }
            } else {
                this.filters.type_operator = 'and';
                this.filters.type = ['type', 'anyof', ['SalesOrd']];
            }
        },

        mapListResult: function mapListResult(resultParam, record) {
            var result = resultParam || {};
            result.ponumber = record.getValue('otherrefnum');
            result.trackingnumbers = record.getValue('trackingnumbers') ? record.getValue('trackingnumbers').split('<BR>') : null;

            if (this.isSCISIntegrationEnabled) {
                result.origin = parseInt(record.getValue(this.columns.origin), 10);
            }

            return result;
        }
    });
});
