define('GoogleCustomerReviews.LoadScript', [], function GoogleCustomerReviewsLoadScript() {
    'use strict';

    var GoogleCustomerReviews = {
        loadScript: function badgeScript(id) {
            var script;
            var firstScriptTag;
            if (SC.ENVIRONMENT.jsEnvironment === 'browser') {
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.defer = true;
                script.id = id;
                script.src = 'https://apis.google.com/js/platform.js?onload=' + id;

                firstScriptTag = document.body.lastChild;
                firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
            }
        }
    };

    return GoogleCustomerReviews;
});
