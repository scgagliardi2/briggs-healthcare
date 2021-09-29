define('GoogleRecaptcha.Model', [
    'SC.Model',
    'underscore'
], function ProductPreviewGoogleRecaptchaModel(
    SCModel,
    _
) {
    'use strict';

    var extendGoogleRecaptcha;
    var recaptchaError;
    var resp;
    var result;

    extendGoogleRecaptcha = _.extend(SCModel, {
        name: 'googlerecaptchamodel',
        validate: function validate(response) {
            recaptchaError = {
                status: 400,
                code: 'ERR_RECAPTCHA_INVALID',
                message: 'ReCaptcha is invalid'
            };

            resp = nlapiRequestURL(SC.Configuration.googleReCaptcha.verifyUrl, {
                secret: SC.Configuration.googleReCaptcha.serverkey,
                response: response
            });

            result = JSON.parse(resp.getBody());

            if (result.success !== true) {
                throw recaptchaError;
            }
        }
    });

    return extendGoogleRecaptcha;
});
