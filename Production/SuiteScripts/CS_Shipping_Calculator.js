function setShippingCost()
{

	if(nlapiGetContext().getExecutionContext() == 'webstore'){
		var shipping_cost_custom = nlapiGetFieldValue('custbody_ag_shipping_cost_custom');
		
		nlapiSetFieldValue('shippingcost', parseFloat(shipping_cost_custom));
	}
  return true;
}