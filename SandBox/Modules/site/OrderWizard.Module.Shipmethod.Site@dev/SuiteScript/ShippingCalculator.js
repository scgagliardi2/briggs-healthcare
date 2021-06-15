define("ShippingCalculator", [
  "Application",
  "ShippingCalculator.Model",
  "underscore",
  "Utils",
], function(Application, ShippingCalculatorModel, _, Utils) {
  Application.on("after:LiveOrder.get", function(Model, response) {
    if (session.isLoggedIn2()) {
      var subtotal = response.summary.subtotal;
      var shippingCalculatorResponse =
        ShippingCalculatorModel.getShippingCost(subtotal);
      var shippingCost = shippingCalculatorResponse.shippingCost || 0;
      response.summary.shippingcost = parseFloat(shippingCost);
      response.summary.shippingcost_formatted =
        Utils.formatCurrency(shippingCost);

      var taxtotal = response.summary.taxtotal;
      var newTax = 0.0;
      if(taxtotal > 0) {
        var taxRate = (taxtotal /response.summary.subtotal);
        newTax = (response.summary.subtotal + shippingCost) * taxRate;
      }

      var newTaxFormatted = Utils.formatCurrency(newTax);
      response.summary.taxtotal = newTax;
      response.summary.taxtotal_formatted = newTaxFormatted;

      var total = response.summary.subtotal + shippingCost + newTax;
      var total_formatted = Utils.formatCurrency(total);

      response.summary.total = total;
      response.summary.total_formatted = total_formatted;
    }
    return response;
  });

  Application.on("after:LiveOrder.update", function(Model, data, response) {
    var shipMethod = _.find(response.shipmethods, function(ship) {
      return ship.internalid == 179;
    });

    if (shipMethod) {
      order.setShippingMethod({
        shipmethod: shipMethod.internalid,
        shipcarrier: shipMethod.shipcarrier,
      });
    }
  });
});
