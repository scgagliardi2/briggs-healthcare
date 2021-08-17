define("ShippingCalculator", [
  "Application",
  "ShippingCalculator.Model",
  "underscore",
  "Utils",
  "SC.Models.Init"
], function(Application, ShippingCalculatorModel, _, Utils,ModelsInit) {
  Application.on("after:LiveOrder.get", function(Model, response) {
    if (ModelsInit.session.isLoggedIn2()) {
      var subtotal = response.summary.subtotal;
	  
	  var shipmethod = _.has(response,'shipmethod')? response.shipmethod : '';
	  
      var shippingCalculatorResponse =
        ShippingCalculatorModel.getShippingCost(subtotal,shipmethod);
	
      var shippingCost = shippingCalculatorResponse.shippingCost || 0;
      response.summary.shippingcost = parseFloat(shippingCost);
      response.summary.shippingcost_formatted =
        Utils.formatCurrency(shippingCost);
		
	
	if(Utils.isInCheckout()){
		response.options.custbody_ag_shipping_cost_custom = String(response.summary.shippingcost);
	}

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
	  
	  var allowedShipMethods = ['179','1987','1990'];
	  
	  response.shipmethods = _.filter(response.shipmethods,function(shipMethod){
		  
		  var shipMethodId = _.has(shipMethod,'internalid')? shipMethod.internalid : '';
		  
		  return (allowedShipMethods.indexOf(shipMethodId) != -1);
	  });
    }
    return response;
  });

  /*Application.on("after:LiveOrder.update", function(Model, data, response) {
    var shipMethod = _.find(response.shipmethods, function(ship) {
      return ship.internalid == 179;
    });

    if (shipMethod) {
      order.setShippingMethod({
        shipmethod: shipMethod.internalid,
        shipcarrier: shipMethod.shipcarrier,
      });
    }
  });*/
});
