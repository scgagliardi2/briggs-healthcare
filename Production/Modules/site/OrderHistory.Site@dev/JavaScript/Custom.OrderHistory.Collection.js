define('Custom.OrderHistory.Collection', [
    'OrderHistory.Collection',
    'underscore'
], function OrderHistoryCollection(
    Collection,
    _
) {
    'use strict';

    _.extend(Collection.prototype, {
        update: function update(options) {
            var range = options.range || {};
            var data = {
                filter: this.customFilters || (options.filter && options.filter.value),
                sort: options.sort.value,
                order: options.order,
                from: range.from,
                to: range.to,
                page: options.page,
                ponumber: options.ponumber
            };

            this.fetch({
                data: data,
                reset: true,
                killerId: options.killerId
            });
        }
    });
});
