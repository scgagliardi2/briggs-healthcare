define(
'Pacejet',
['Application','Pacejet.JSON.Model','underscore','Utils'],
function(Application, PacejetModel, _, Utils) {

    var mapPacejetPrices = function(shippingMethods) {
        var result = PacejetModel.get();
        if (result.success) {
            _.each(result.response, function(pacejetShip) {
                if (!pacejetShip.shipCodeXRef) return;

                var shippingMethod = _.findWhere(shippingMethods, {internalid: pacejetShip.shipCodeXRef});
                if (shippingMethod) {
                    shippingMethod.rate = pacejetShip.consigneeFreight;
                    shippingMethod.rate_formatted = Utils.formatCurrency(pacejetShip.consigneeFreight);
                    shippingMethod.is_pacejet = true;
                }
            });
        }
        else {
            //TODO: Throw error in calculations
        }
    };

    var isUpdating = false;

        // @class LiveOrder.Model
    Application.on('after:LiveOrder.get', function(Model, response) {
        mapPacejetPrices(response.shipmethods);
        response.shipmethods = _(response.shipmethods).filter(function(sm){ return sm.is_pacejet});
        var shipMethod = _.find(response.shipmethods, function(ship) { return ship.internalid == response.shipmethod});
        if (shipMethod && shipMethod.is_pacejet && parseFloat(shipMethod.rate) != (response.summary && response.summary.shippingcost)
        && !isUpdating) {
            isUpdating = true;
            order.setCustomFieldValues({'custbody_ns_ps_shipping_price': shipMethod.rate.toString()});
            response = Model.get();
            isUpdating = false;
        }

        return response;
    });

    Application.on('after:LiveOrder.update', function(Model, data, response) {
        var shipMethod = _.find(response.shipmethods, function(ship) { return ship.internalid == response.shipmethod});
        if (shipMethod && shipMethod.is_pacejet) {
            order.setCustomFieldValues({custbody_ns_ps_shipping_price: shipMethod.rate.toString() });
        }
        else {
            order.setCustomFieldValues({custbody_ns_ps_shipping_price: '0.00' });
        }
    });

});
