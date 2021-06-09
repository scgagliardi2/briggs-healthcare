/*eslint-disable*/
define('OrderWizard.Module.PaymentMethod.Selector.Site', [
    'Wizard.Module',
    'OrderWizard.Module.PaymentMethod.Creditcard',
    'OrderWizard.Module.PaymentMethod.Invoice',
    'OrderWizard.Module.PaymentMethod.PayPal',
    'OrderWizard.Module.PaymentMethod.External',
    'SC.Configuration',
    'OrderWizard.Module.PaymentMethod.Selector',
    'Profile.Model',
    'underscore'
], function OrderWizardSelectorFilter(
    WizardModule,
    OrderWizardModulePaymentMethodCreditcard,
    OrderWizardModulePaymentMethodInvoice,
    OrderWizardModulePaymentMethodPayPal,
    OrderWizardModulePaymentMethodExternal,
    Configuration,
    OrderWizardModulePaymentMethodSelector,
    ProfileModel,
    _
) {
    'use strict';

    _.extend(OrderWizardModulePaymentMethodSelector.prototype, {

        initialize: function (options)
    		{
    			var self = this;
    			WizardModule.prototype.initialize.apply(this, arguments);

    			this.modules = options.modules || [
    				{
    					classModule: OrderWizardModulePaymentMethodCreditcard
    				,	name: _('Credit / Debit Card').translate()
    				,	type: 'creditcard'
    				,	options: {}
    				}
    			,	{
    					classModule: OrderWizardModulePaymentMethodInvoice
    				,	name: _('Invoice').translate()
    				,	type: 'invoice'
    				,	options: {}
    				}
    			,	{
    					classModule: OrderWizardModulePaymentMethodPayPal
    				,	name: _('PayPal').translate()
    				,	type: 'paypal'
    				,	options: {}

    				}
    			];

    			if (!options.disableExternalPaymentMethods)
    			{
    				var payment_methods = Configuration.get('siteSettings.paymentmethods', [])
    				,	payment_methods_configuration = Configuration.get('paymentmethods', [])
    				,	external_payment_methods = _.where(payment_methods, {isexternal: 'T'});

    				_.each(external_payment_methods, function (payment_method)
    				{
    					var payment_method_configuration = _.find(payment_methods_configuration, {key: payment_method.key});

    					self.modules.push(
    						self.getExternalPaymentMethodModule(payment_method, options, payment_method_configuration)
    					);
    				});

    				this.wizard.model.on('change:confirmation', function (model, confirmation)
    				{
    					if (confirmation && confirmation.statuscode === 'redirect')
    					{
    						window.location.href = _.addParamsToUrl(confirmation.redirecturl, {touchpoint: Configuration.get('currentTouchpoint')});
    						throw new Error('This is not an error. This is just to abort javascript');
    					}
    				});

    			}

                var terms = ProfileModel.getInstance().get('paymmentterms');

    			_.each(this.modules, function (module)
    			{
    				// var ModuleClass = require(module.classModule);
    				var ModuleClass = module.classModule;
    				module.instance = new ModuleClass(_.extend({
    					wizard: self.wizard
    				,	step: self.step
    				,	stepGroup: self.stepGroup
    				}, module.options));

    				module.instance.on('ready', function (is_ready)
    				{
    					self.moduleReady(is_ready);
    				});
    			});

                var terms = ProfileModel.getInstance().get('paymentterms');
                if (terms && terms.internalid === '75') {
                    this.modules = this.modules.filter(function filterModules(mod) {
                        return mod.type === 'creditcard';
                    })

                    if(this.modules[0] && this.modules[0].name) {
                        this.modules[0].isSelected = true;
                    }
                }
    		}
    });
});
