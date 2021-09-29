define('CustomerSegments.Header.Logo.View', [
    'Backbone',

    'SC.Configuration',

    'CustomerSegments.Helper',

    'Header.Logo.View',
    'customersegments_header_logo.tpl',

    'jQuery',
    'underscore',
    'Utils'
], function CustomerSegmentsHeaderLogoView(
    Backbone,

    Configuration,

    Helper,

    HeaderLogoView,
    customersegmentsHeaderLogoTpl,

    jQuery,
    _,
    Utils
) {
    'use strict';

    _.extend(HeaderLogoView.prototype, {
        template: customersegmentsHeaderLogoTpl,

        /*
         * Logo URL base on commerce configuration
         * This will be used as a default logo if Group logo is not set
         * */
        logoUrl: Utils.getAbsoluteUrl(Configuration.get('header.logoUrl')),

        initialize: _.wrap(HeaderLogoView.prototype.initialize, function initialize(fn) {
            var self;
            fn.apply(this, _.toArray(arguments).slice(1));

            /*
             * Create new backbone model
             * Set default value for the current model
             * */
            this.model = new Backbone.Model({
                minHeight: '',
                showThis: false
            });

            self = this;

            /*
             * Response from CustomerSegments Helper
             * This ensure that Group information is already been set
             * Check if logo is available in group information else use the default logo
             * Re-render the view once all information is set
             * */
            jQuery.when(Helper.setGroupsInfo()).done(function whenSetGroupsInfo(response) {
                if (response.groupLogo && !_.isEmpty(response.groupLogo[0])) {
                    self.model.set('logoUrl', response.groupLogo[0]);
                    self.model.set('showThis', true);
                    self.model.set('minHeight', jQuery('.header-content').height() + 'px');
                } else {
                    self.model.set('logoUrl', self.logoUrl);
                    self.model.set('showThis', true);
                }

                self.render();
            });
        }),

        getContext: _.wrap(HeaderLogoView.prototype.getContext, function getContext(fn) {
            var context = fn.call(this);

            _.extend(context, {
                logoUrl: this.model.get('logoUrl'),
                showThis: this.model.get('showThis'),
                minHeight: this.model.get('minHeight')
            });

            return context;
        })
    });
});
