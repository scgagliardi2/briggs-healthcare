define('CMSMerchandisingZonesInitialization', [
    'Item.Collection',
    'Merchandising.View',
    'Backbone',
    'underscore',
    'Utils',
    'merch_zone_cms.tpl'

], function CMSMerchandisingZonesInitialization(
    ItemCollection,
    MerchandisingView,
    Backbone,
    _,
    Utils,
    merchZoneCmsTpl
) {
    'use strict';

    var loadTpl = function loadTplIntoView(view, tplName) {
        var tplFn;

        if (tplName) {
            // we try to get the 'template' from the merchandising rule
            try {
                tplFn = Utils.requireModules(tplName + '.tpl');
            } catch (e) {
                console.warn('Template ' + tplName + ' is not compiled into the application, using default');  // eslint-disable-line no-console
            }
            if (tplFn) {
                view.template = tplFn;
            } else {
                view.template = merchZoneCmsTpl;
            }
        } else {
            view.template = merchZoneCmsTpl;
        }
    };
    return {
        mountToApp: function mountToApp(application) {
            var layout = application.getLayout();
            Backbone.Events.on('cms:custom:merchzones-rendered',
                /**
                 *
                 * @param itemsData
                 * @param {{}} options
                 * @param {String} options.tpl
                 * @param {String} options.divId
                 *
                 */
                function onMZRender(itemsData, options) {
                    /**
                     * this needs to be executed after the merchzone template was appended by SMT to the DOM
                     */
                    _.defer(function deferredAppend() {
                        var $placeHolder = layout.$('#' + options.divId);
                        var collection = new ItemCollection(itemsData, {
                            parse: true
                        });

                        var view = new MerchandisingView({
                            items: collection,
                            model: new Backbone.Model({
                                show: Infinity
                            })
                        });

                        var containerTpl = $placeHolder.closest('[data-cms-area]').data('template');

                        loadTpl(view, containerTpl || options.tpl);


                        view.setElement($placeHolder[0]);
                        view.render();
                        view.trigger('afterMerchandAppendToDOM');
                    });
                }
            );
        }
    };
});
