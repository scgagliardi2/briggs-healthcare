define('CustomerSegments.ProductDetails.Router', [
    'Backbone',
    'ProductDetails.Router',
    'Product.Model',
    'CustomerSegments.Helper',
    'AjaxRequestsKiller',
    'jQuery',
    'underscore',
    'Utils'
], function CustomerSegmentsItemDetailsRouter(
    Backbone,
    ProductDetailsRouter,
    ProductModel,
    Helper,
    AjaxRequestsKiller,
    jQuery,
    _
) {
    'use strict';

    _.extend(ProductDetailsRouter.prototype, {
        /* eslint-disable */
        productDetails: function productDetails (api_query, base_url, options)
        {
            var application = this.application
                ,	product = new ProductModel()
                ,	ViewConstructor = this.getView()
                ,	item = product.get('item');

            item.fetch({
                data: api_query
                ,	killerId: AjaxRequestsKiller.getKillerId()
                ,	pageGeneratorPreload: true
            }).then(
                // Success function
                function (data, result, jqXhr)
                {
                    jQuery.when(Helper.setCustomerGroups()).done(function whenSetGroupsInfo() {
                        // Added additional condition for Customer Groups
                        if (!item.isNew() && Helper.isItemGroup(_.first(data.items))) { // CustomerSegments-Override
                            // once the item is fully loaded we set its options
                            product.setOptionsFromURL(options);

                            product.set('source', options && options.source);

                            product.set('internalid', options && options.internalid);

                            if (api_query.id && item.get('urlcomponent') && SC.ENVIRONMENT.jsEnvironment === 'server') {
                                nsglobal.statusCode = 301;
                                nsglobal.location = product.generateURL();
                            }

                            if (data.corrections && data.corrections.length > 0) {
                                if (item.get('urlcomponent') && SC.ENVIRONMENT.jsEnvironment === 'server') {
                                    nsglobal.statusCode = 301;
                                    nsglobal.location = data.corrections[0].url + product.getQuery();
                                }
                                else {
                                    return Backbone.history.navigate('#' + data.corrections[0].url + product.getQuery(), {trigger: true});
                                }
                            }

                            var view = new ViewConstructor({
                                model: product
                                , baseUrl: base_url
                                , application: application
                            });

                            // then we show the content
                            view.showContent();
                        }
                        else if (jqXhr.status >= 500) {
                            application.getLayout().internalError();
                        }
                        else if (jqXhr.responseJSON.errorCode !== 'ERR_USER_SESSION_TIMED_OUT') {
                            // We just show the 404 page
                            application.getLayout().notFound();
                        }
                    });
                }
                // Error function
                ,	function (jqXhr)
                {
                    // this will stop the ErrorManagment module to process this error
                    // as we are taking care of it
                    try
                    {
                        jqXhr.preventDefault = true;
                    }
                    catch (e)
                    {
                        console.log(e.message);
                    }

                    if (jqXhr.status >= 500)
                    {
                        application.getLayout().internalError();
                    }
                    else if (jqXhr.responseJSON.errorCode !== 'ERR_USER_SESSION_TIMED_OUT')
                    {
                        // We just show the 404 page
                        application.getLayout().notFound();
                    }
                }
            );
        }
        /* eslint-enable */
    });
});
