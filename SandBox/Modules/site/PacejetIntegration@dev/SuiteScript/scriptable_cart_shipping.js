var nsps_order_shipping = new function () {

    this.updateShipping = function () {
        if (nlapiGetContext().getExecutionContext() != 'webstore') {
            return true;
        }
        var currentCost = nlapiGetFieldValue('shippingcost');
        var costToSet = nlapiGetFieldValue('custbody_ns_ps_shipping_price');
nlapiLogExecution('DEBUG', 'aa', 'in scriptcartscript');
        if (costToSet && costToSet != currentCost) {
            nlapiSetFieldValue('custbody_ns_ps_shipping_price', '', true, true);
            nlapiSetFieldValue('shippingcost', costToSet, true, true);
        }
    };

    var self = this;
    return {
        change: function() {
            self.updateShipping();
        }
    }
};
