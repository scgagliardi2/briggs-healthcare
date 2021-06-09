define('DisplayProductLeadTime.Model', [
    'Backbone.CachedModel',
    'bignumber',
    'underscore',
    'Utils'
], function DisplayProductLeadTimeModel(
    CachedModel,
    bigNumber,
    _
) {
    'use strict';

    return CachedModel.extend({
        urlRoot: _.getAbsoluteUrl('services/DisplayProductLeadTime.Service.ss'),

        calculateDate: function calculateDate(totalDays) {
            var date = new Date();
            var day;
            var month;
            var year;


            date.setTime(date.getTime() + parseInt(totalDays * 24 * 60 * 60 * 1000, 10));
            day = date.getDate();
            month = date.getMonth() + 1;
            year = date.getFullYear();

            return month + '/' + day + '/' + year;
        },

        getLeadTime: function getLeadTime() {
            var leadTime;
            var totalDays = bigNumber(parseInt(this.get('leadTime'), 10)).plus(parseInt(this.get('purchaseOrder'), 10)).toNumber();

            if (totalDays <= 0) {
                leadTime = this.calculateDate(0);
            } else {
                leadTime = this.calculateDate(totalDays);
            }

            return leadTime;
        }
    });
});
