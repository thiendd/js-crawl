/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

/**
 * I make 2 tweaks in this plugin
 * First, change YQL to query image in URL
 * Second, call callback function with full result than just only result[0]
 *
 * @author tuanht
 */

jQuery.ajax = (function(_ajax){

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        // I change query with my own query to get image
        //query = 'select * from html where url="{URL}" and xpath="*"';
        query = 'select * from html where url="{URL}" and compat="html5" and (xpath="//img")';

    

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);

    }  

    return function(o) {

        var url = o.url;  

        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success){
                return function(data) {
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, data.results, 'success');
                    }
                };

            })(o.success);
        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);
