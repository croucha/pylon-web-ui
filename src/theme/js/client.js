module.exports = (function($, _) {
    /*----------------------------------------------------------------------------------------------
     * CLIENT INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Define object of this module
    var self = {};

    // Feature detect
    // Determine if navigator and navigator.platform exists before trying to use it
    if(navigator && navigator.platform) {
        // Setup self platform booleans
        self.isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;
        self.isWindows = navigator.platform.toUpperCase().indexOf('WIN') !== -1;
        self.isLinux = navigator.platform.toUpperCase().indexOf('LINUX') !== -1;
        self.isMacPpc = navigator.platform === 'MacPPC';
        self.isMacIntel = navigator.platform === 'MacIntel';
    }
    // Feature detect
    // Determine if navigator and navigator.userAgent exists before trying to use it
    if(navigator && navigator.userAgent) {
        // Setup self browser booleans
        self.isChrome = navigator.userAgent.indexOf('Chrome') > -1;
        self.isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
        self.isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
        self.isSafari = navigator.userAgent.indexOf('Safari') > -1;
        self.isOpera = navigator.userAgent.indexOf('Presto') > -1;
        self.isAndroid = navigator.userAgent.indexOf('Android') > -1;
        self.isIphone = navigator.userAgent.indexOf('iPhone') > -1;
        if ((self.isChrome) && (self.isSafari)) { self.isSafari=false; }
    }

    /**
     * Returns boolean false if browser is not IE or IE is less than 5 or greater than 9.
     * Returns IE version number for IE 5 through 9 if self is use any of those versions.
     * @returns {Boolean|Number}
     */
    self.ieVersion = function() {
        var v = 3, div = document.createElement('div'), a = div.all || [];
        while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]);
        return v > 4 ? v : !v;
    };
    
    /**
     * Uses jquery.cookie library:
     * https://github.com/carhartl/jquery-cookie
     * 
     * Determines if self's cookies are enabled
     * 
     * @returns {Boolean}
     */
    self.cookiesEnabled = function() {
        // Define date object
        var date = new Date();
        // Set time 1 second from now
        date.setTime(date.getTime() + (1 * 1000));
        return $.cookie('cookieCheck', 'valid', { expires: date }) && $.cookie('cookieCheck') === 'valid';
    };

    return self;
})(jQuery, _);