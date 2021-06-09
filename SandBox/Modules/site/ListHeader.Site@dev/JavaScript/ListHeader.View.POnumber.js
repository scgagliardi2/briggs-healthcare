define('ListHeader.View.POnumber', [
    'Backbone',
    'ListHeader.View',
    'AjaxRequestsKiller',
    'underscore',
    'jQuery'
], function POnumber(
    Backbone,
    ListHeaderView,
    AjaxRequestsKiller,
    _,
    $
) {
    'use strict';

    _.extend(ListHeaderView.prototype.events, {
        'click [data-action="ponumberHandler"]': 'poNumberHandler',
        'click [data-action="clearPoNumberHandler"]': 'clearPoNumberHandler'
    });

    _.extend(ListHeaderView.prototype, {
        poNumberVal: '',

        poNumberHandler: function poNumberHandler() {
            this.poNumberVal = $('#ponumber').val();
            this.updateUrl();
        },

        clearPoNumberHandler: function clearPoNumberHandler() {
            $('#ponumber').html('');
            this.poNumberVal = '';
            this.updateUrl();
        },

        updateCollection: function updateCollection() {
            var range = null;
            var ponumber = null;
            var collection = this.collection;

            if (this.selectedRange) {
                range = {
                    from: this.selectedRange.from || (this.allowEmptyBoundaries ? '' : this.rangeFilterOptions.fromMin),
                    to: this.selectedRange.to || (this.allowEmptyBoundaries ? '' : this.rangeFilterOptions.toMax)
                };
            }

            if (this.poNumberVal) {
                ponumber = this.poNumberVal;
            }

            collection.update && collection.update({
                filter: this.selectedFilter,
                range: range,
                sort: this.selectedSort,
                order: this.order,
                page: this.page,
                ponumber: ponumber,
                killerId: AjaxRequestsKiller.getKillerId()
            }, this);

            return this;
        },

        updateUrl: function updateUrl() {
            var url = Backbone.history.fragment;

            url = this.isDefaultFilter(this.selectedFilter) ?
            _.removeUrlParameter(url, 'filter') :
            _.setUrlParameter(url, 'filter', _.isFunction(this.selectedFilter.value) ? this.selectedFilter.value.apply(this.view) : this.selectedFilter.value);

            url = this.isDefaultSort(this.selectedSort) ? _.removeUrlParameter(url, 'sort') : _.setUrlParameter(url, 'sort', this.selectedSort.value);

            url = this.order === 1 ? _.removeUrlParameter(url, 'order') : _.setUrlParameter(url, 'order', 'inverse');

            url = this.poNumberVal ? _.setUrlParameter(url, 'ponumber', this.poNumberVal) : _.removeUrlParameter(url, 'ponumber');

            if (this.selectedRange) {
                url = this.selectedRange.from || this.selectedRange.to ?
                                                _.setUrlParameter(url, 'range', (this.selectedRange.from || '') + 'to' + (this.selectedRange.to || '')) :
                                                _.removeUrlParameter(url, 'range');
            }

            url = _.removeUrlParameter(url, 'page');
            this.page = 1;

            Backbone.history.navigate(url, { trigger: false });

            return this.updateCollection();
        },

        getPoNumberFromUrl: function getPoNumberFromUrl(urlValue) {
            return urlValue || '';
        },

        setSelecteds: _.wrap(ListHeaderView.prototype.setSelecteds, function setSelecteds(fn) {
            var urlOptions = _.parseUrlOptions(Backbone.history.fragment);
            fn.apply(this, _.toArray(arguments).slice(1));

            this.poNumberVal = this.getPoNumberFromUrl(urlOptions.ponumber);
        }),

        getContext: _.wrap(ListHeaderView.prototype.getContext, function getContext(fn) {
            var ret = fn.apply(this, _.toArray(arguments).slice(1));

            _.extend(ret, {
                poNumberSearch: this.poNumberSearch,
                poNumberVal: this.poNumberVal
            });

            return ret;
        })
    });
});
