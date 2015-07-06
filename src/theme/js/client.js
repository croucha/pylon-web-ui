(function($, _) {    
    /*----------------------------------------------------------------------------------------------
     * CLIENT INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the app global object exists
    app = app || {};
    // Create the client namespace
    app.client = app.client || {};
    // Create a scoped alias to simplify references
    var client = app.client;

    // Feature detect
    // Determine if navigator and navigator.platform exists before trying to use it
    if(navigator && navigator.platform) {
        // Setup client platform booleans
        client.isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;
        client.isWindows = navigator.platform.toUpperCase().indexOf('WIN') !== -1;
        client.isLinux = navigator.platform.toUpperCase().indexOf('LINUX') !== -1;
        client.isMacPpc = navigator.platform === 'MacPPC';
        client.isMacIntel = navigator.platform === 'MacIntel';
    }
    // Feature detect
    // Determine if navigator and navigator.userAgent exists before trying to use it
    if(navigator && navigator.userAgent) {
        // Setup client browser booleans
        client.isChrome = navigator.userAgent.indexOf('Chrome') > -1;
        client.isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
        client.isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
        client.isSafari = navigator.userAgent.indexOf('Safari') > -1;
        client.isOpera = navigator.userAgent.indexOf('Presto') > -1;
        client.isAndroid = navigator.userAgent.indexOf('Android') > -1;
        client.isIphone = navigator.userAgent.indexOf('iPhone') > -1;
        if ((client.isChrome) && (client.isSafari)) { client.isSafari=false; }
    }

    /**
     * Returns boolean false if browser is not IE or IE is less than 5 or greater than 9.
     * Returns IE version number for IE 5 through 9 if client is use any of those versions.
     * @returns {Boolean|Number}
     */
    client.ieVersion = function() {
        var v = 3, div = document.createElement('div'), a = div.all || [];
        while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]);
        return v > 4 ? v : !v;
    };
    
    /**
     * Uses jquery.cookie library:
     * https://github.com/carhartl/jquery-cookie
     * 
     * Determines if client's cookies are enabled
     * 
     * @returns {Boolean}
     */
    client.cookiesEnabled = function() {
        // Define date object
        var date = new Date();
        // Set time 1 second from now
        date.setTime(date.getTime() + (1 * 1000));
        return $.cookie('cookieCheck', 'valid', { expires: date }) && $.cookie('cookieCheck') === 'valid';
    };
})(jQuery, _);