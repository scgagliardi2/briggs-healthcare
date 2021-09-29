define('CaseFormFrontend.Model', [
    'SC.Model',
    'SC.Models.Init',
    'underscore',
    'Utils'
], function CaseFormFrontendModel(
    SCModel,
    ModelsInit,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'CaseFormFrontend',
        submit: function subscribe(data) {
            var subsidiary = ModelsInit.session.getShopperSubsidiary();
            var url = data.caseFormUrl;
            var params = _.omit(data, 'caseFormUrl');
            var response;
            var responseCode;

            params.subsidiary = subsidiary;

            try {
                response = nlapiRequestURL(url, params);
                responseCode = parseInt(response.getCode(), 10);

                if (responseCode === 200 || responseCode === 302 || responseCode === 201 || responseCode === 404) {
                    return {
                        code: 'OK',
                        successMessage: 'Thanks for contacting us.'
                    };
                }
            } catch (e) {
                nlapiLogExecution('ERROR', 'CaseFormFrontend', e);
                if (e instanceof nlobjError && e.getCode().toString() === 'ILLEGAL_URL_REDIRECT') {
                    return {
                        code: 'OK',
                        successMessage: 'Thanks for contacting us.'
                    };
                }
            }

            return {
                status: 500,
                code: 'ERR_FORM',
                message: 'Something went wrong processing your form, please try again later.'
            };
        }
    });
});
