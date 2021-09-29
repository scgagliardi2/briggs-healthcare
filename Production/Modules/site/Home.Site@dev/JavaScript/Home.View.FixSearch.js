define('Home.View.FixSearch', [
    'Home.View',
    'underscore',
    'SC.Configuration'
], function (
    HomeView,
    _,
    Configuration
) {
    'use strict';

    _.extend(HomeView.prototype, {
        getContext: _.wrap(HomeView.prototype.getContext, function (fn) {
            var retVal = fn.apply(this, _.toArray(arguments).slice(1));
//URL fix for search failure to redirect on home
            var urlCheck = window.location.href;
            if(!String.prototype.includes){
                String.prototype.includes = function(search, start) {
                    if (typeof start !== 'number') {
                        start = 0;
                    }

                    if (start + search.length > this.length) {
                        return false;
                    } else {
                        return this.indexOf(search, start) !== -1;
                    }
                };
            }

            if (!(urlCheck.includes("cart"))) {
                Configuration.currentTouchpoint = 'home'
            }

            return retVal;
        })
    })
})
