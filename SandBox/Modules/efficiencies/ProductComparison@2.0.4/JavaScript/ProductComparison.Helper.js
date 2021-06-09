/*
    © 2016 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

define('ProductComparison.Helper', [
    'jQuery'
], function ProductComparisonHelper(jQuery) {
    'use strict';

    /* eslint-disable */
    function QueryString(qs) {
        var queryString = qs;
        var match;
        var re = /([^=&]+)(=([^&]*))?/g;

        var key;
        var value;
        this.dict = {};

        // If no query string  was passed in use the one from the current page
        if (!queryString) {
            queryString = location.search;
        }

        // Delete leading question mark, if there is one
        if (queryString.charAt(0) === '?') {
            queryString = qs.substring(1);
        }
        match = re.exec(qs);
        // Parse it
        while (match) {
            key = decodeURIComponent(match[1].replace(/\+/g, ' '));
            value = match[3] ? QueryString.decode(match[3]) : '';

            if (this.dict[key]) {
                this.dict[key].push(value);
            } else {
                this.dict[key] = [value];
            }
            match = re.exec(qs);
        }
    }

    QueryString.decode = function decodeQueryString(s) {
        var queryString = s;
        queryString = queryString.replace(/\+/g, ' ');
        queryString = queryString.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/gi,

        function decode1(code, hex1, hex2, hex3) {
            var n1 = parseInt(hex1, 16) - 0xE0;
            var n2 = parseInt(hex2, 16) - 0x80;
            var n3;
            var n;

            if (n1 === 0 && n2 < 32) {
                return code;
            }

            n3 = parseInt(hex3, 16) - 0x80;
            n = (n1 << 12) + (n2 << 6) + n3;

            if (n > 0xFFFF) {
                return code;
            }

            return String.fromCharCode(n);
        });

        queryString = queryString.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/gi,
            function decode2(code, hex1, hex2) {
                var n1 = parseInt(hex1, 16) - 0xC0;
                var n2 = parseInt(hex2, 16) - 0x80;

                if (n1 < 2) {
                    return code;
                }

                return String.fromCharCode((n1 << 6) + n2);
            });

        queryString = queryString.replace(/%([0-7][0-9A-F])/gi, function returnFromCharCode(code, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });

        return queryString;
    };

    QueryString.prototype.value = function queryStringValue(key) {
        var a = this.dict[key];
        return a ? a[a.length - 1] : undefined;
    };

    QueryString.prototype.values = function queryStringValues(key) {
        var a = this.dict[key];
        return a ? a : [];
    };

    QueryString.prototype.keys = function queryStringKeys() {
        var a = [];
        var key;
        for ( key in this.dict ) {
            if (this.dict.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        return a;
    };
    /* eslint-enable */

    return {
        // @method getSessionCookieProductIDs
        getSessionCookieProductIDs: function getSessionCookieProductIDs() {
            // load product ID from sessions cookies - need to dicover down the road is it
            // better to retrieve this from the Query String Param instead

            var productIDs = [];
            if (jQuery.cookie('NS_ProductComparisonIDs') && (typeof jQuery.cookie('NS_ProductComparisonIDs') !== 'object')) {
                productIDs = JSON.parse(jQuery.cookie('NS_ProductComparisonIDs'));
                if (!productIDs) {
                    productIDs = [];
                }
            }
            return productIDs;
        },
        // @method getQueryStrProductIDs
        getQueryStrProductIDs: function getQueryStrProductIDs() {
          // Retrieve this from the Browser URL
            var qs;
            var ret;
            var urlSubStr = window.location.href.split('?')[1];
            if (urlSubStr) {
                qs = new QueryString(urlSubStr);
                ret = qs.values('id');
            } else {
                ret = null;
            }

            return ret;
        },
        // @method setProductComparisonSessionCookie
        setProductComparisonSessionCookie: function setProductComparisonSessionCookie(objs) {
            if (objs) {
                jQuery.cookie('NS_ProductComparisonIDs', JSON.stringify(objs));
            } else {
                jQuery.cookie('NS_ProductComparisonIDs', null);
            }
        }
    };
});
