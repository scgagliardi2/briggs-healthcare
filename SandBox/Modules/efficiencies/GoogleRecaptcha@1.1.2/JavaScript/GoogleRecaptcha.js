define('GoogleRecaptcha', [
    'jQuery',
    'SC.Configuration'
], function GoogleRecaptcha(
    jQuery,
    Configuration
) {
    'use strict';

    var loader = {
        loadedPromise: jQuery.Deferred(),
        initialized: false,
        getModuleConfig: function getModuleConfig() {
            return Configuration.get('googleReCaptcha');
        },
        loadCaptcha: function loadCaptcha() {
            var url = this.getModuleConfig().apiUrl +
                      '?onload=_loadCaptcha&render=explicit';

            if (SC.ENVIRONMENT.jsEnvironment === 'browser') {
                jQuery.ajax({
                    url: url,
                    dataType: 'script',
                    // always call this script without appending timestamp params to the url
                    cache: true,
                    // Don't throw internal errors/404 because of third party integration
                    preventDefault: true
                });
            } else {
                this.loadedPromise.rejectWith('Google ReCaptcha is a Browser Script only');
            }

            this.initialized = true;

            return this.loadedPromise;
        }
    };
    /* eslint-disable */
    window._loadCaptcha = function _loadCaptcha() {
        grecaptcha.render('Recaptcha', {
            sitekey: loader.getModuleConfig().sitekey,
            theme: loader.getModuleConfig().theme
        });
    };
    /* eslint-enable */

    return loader;
});
