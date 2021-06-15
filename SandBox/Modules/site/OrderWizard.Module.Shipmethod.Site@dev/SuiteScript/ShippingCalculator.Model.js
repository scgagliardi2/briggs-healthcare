define("ShippingCalculator.Model", [
  "SC.Model",
  "CustomFieldsParser",
  "underscore",
], function PacejetModel(SCModel, customFieldsParser, _) {
  "use strict";

  return SCModel.extend({
    name: "ShippingCalculator.Model",
    getShippingCost: function(orderTotal) {
      var response;
      var shippingRate;

      var customFields = customFieldsParser(customer.getCustomFieldValues());
      var zoneCode = JSON.parse(customFields.custentityzone_code);

      nlapiLogExecution("DEBUG", "zone Code", JSON.stringify(customFields));

      var filters = [];
      filters.push(
        new nlobjSearchFilter("custrecord_briggs_p_code", null, "is", zoneCode)
      );

      var columns = [];
      columns.push(new nlobjSearchColumn("custrecord_start_threshold_amount"));
      columns.push(new nlobjSearchColumn("custrecord_end_threshold_amount"));
      columns.push(new nlobjSearchColumn("custrecord_briggs_p_code"));
      columns.push(new nlobjSearchColumn("custrecord_shipping_cost"));
      columns.push(new nlobjSearchColumn("custrecord_briggs_shippingpricepercent"));

      var search = nlapiCreateSearch(
        "customrecord_briggs_p_codes",
        filters,
        columns
      );
      var resultSet = search.runSearch();

      resultSet.forEachResult(function(searchResult) {
        var minOrderAmount = parseFloat(
          searchResult.getValue("custrecord_start_threshold_amount")
        );
        var maxOrderAmount =
          searchResult.getValue("custrecord_end_threshold_amount") &&
          parseFloat(searchResult.getValue("custrecord_end_threshold_amount"));

        var shipRate = parseFloat(
          searchResult.getValue("custrecord_shipping_cost")
        );

        var shippingPercentage = parseFloat(searchResult.getValue("custrecord_briggs_shippingpricepercent"));

        if (orderTotal >= minOrderAmount && orderTotal <= maxOrderAmount) {
          if(shipRate >= 0 ) {
            shippingRate = shipRate;
          }else {
            shippingRate = (shippingPercentage/100 )* orderTotal;
          }

          return false;
        } else {
          return true;
        }
      });

      if (!shippingRate) {
        response = {
          success: false,
          shippingCost: 0,
        };
      } else {
        response = {
          success: true,
          shippingCost: shippingRate,
        };
      }

      return response;
    },
  });
});
