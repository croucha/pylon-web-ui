// @TODO, document
document.write();
module.exports = (function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // @TODO document
        localStorage.clear();
        // Set timezone offset
        //setTimezoneCookie();
        // Set active link
        self.activeLink('ul[data-nav-active="true"]', 'active');
        // Add caret to active link of navigation slide
        $('div.navigation-slide ul li').each(function(index, value) {
            if($(this).hasClass('active')) {
                $(this).append($('<div>').addClass('arrow-left'));
            }
        });
        
        /*------------------------------------------------------------------------------------------
         * SMALL DEVICE NAVIGATION
         *----------------------------------------------------------------------------------------*/
        
        // Define content area that will need to shift
        // right for the slide in navigation.
        var contentSlide = $('div.content-slide');
        // Set to first time
        var firstToggleClick = true; 
        // Define scroll top positions
        var previousScrollTop = $(window).scrollTop();
        var currentScrollTop = '-' + $(window).scrollTop() + 'px';
        // Set click event for slide in navigation, which is used for devices with small screens (tablets and cell phones)
        $('button.fa-bars').on('click', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            // Turn off any previous one events to prevent stacking
            contentSlide.off('click');
            $(window).off('resize');
            // First click of the button?
            if(firstToggleClick) {
                firstToggleClick = false;
                // Update scroll top information
                previousScrollTop = $(window).scrollTop();
                currentScrollTop = '-' + $(window).scrollTop() + 'px';
                self.startMobileNavigation(contentSlide, $(this).data('target'), currentScrollTop);
                // Create one reset display event for resize
                $(window).one('resize', function() {
                    // If the current active element is a text input, we can assume the soft keyboard is visible
                   if($(document.activeElement).attr('type') !== 'search') {
                        firstToggleClick = true;
                        self.resetDisplay(contentSlide, contentSlide.data('target'), previousScrollTop);
                   }
                }); 
                // Create one reset display event on content slide
                contentSlide.one('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    firstToggleClick = true;
                    self.resetDisplay(this, $(this).data('target'), previousScrollTop); 
                });
            } else {
                firstToggleClick = true;
                self.resetDisplay(contentSlide, $(this).data('target'), previousScrollTop);     
            }
        });    
        // Removes address bar in android and iphone devices
        if (self.client.isIphone !== undefined && self.client.isIphone ||
            self.client.isAndroid !== undefined && self.client.isAndroid) {
            addEventListener('load', function() {
                setTimeout(self.util.hideUrlBar, 0);
            }, false);
        }
        
        // Fade in header menu items after the dom is ready
        $('header.main').find('nav.col-sm-3').fadeIn();
    });
     
    /*----------------------------------------------------------------------------------------------
     * MAIN MENUS
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Define qtip options for menus
        var qtipOptions = {
            content: {
                attr: 'data-description'
            },
            style: {
                classes: 'qtip-tipsy qtip-shadow',
                tip: {
                    corner: true
                }
            },
            position: {
                my: 'top center',
                at: 'bottom middle'
            }
        };
        // Setup parameters for menus
        var parentSelector = 'header.main';
        var triggerSelector = 'a.main-menus';
        var menuSelector = 'div.main-menus';
        // Start qTip
        var tooltips = $(triggerSelector).qtip(qtipOptions);
        // Get the first api element
        var api = tooltips.qtip('api');
        // Initialize menus
        self.util.enableHeadMenus({
            'parentSelector': parentSelector,
            'triggerSelector': triggerSelector,
            'menuSelector': menuSelector,
            initializeCallback: function() {
                // Click event for more
                $(parentSelector).on('click', menuSelector + ' a.more', function(event) {
                    event.preventDefault();
                    // Scroll to bottom of main menus to expose remaining items
                    $(menuSelector).scrollTop($(menuSelector).height());
                });
                // Scroll event for main menus
                $(parentSelector + ' ' + menuSelector).on('scroll', function() {
                   // Determine if scroll top is greater than 0
                   if($(this).scrollTop() > 0) {
                       // Hide more
                       $(this).find('a.more').hide();
                   } else {
                       // show more
                       $(this).find('a.more').show();
                   }
                });
                // Add custom chrome webkit scroll css for anything other than mac
                if(self.client.isMac !== undefined && !self.client.isMac) {
                    $(parentSelector + ' ' + menuSelector).addClass('scroll');
                }
            },
            triggerOpenCallback: function() {
                // Hide qtip
                api.hide();
                // Disable qtip
                api.disable();
                // Close profile menus
                if($('header.main div.user-card').attr('aria-hidden') === 'false') {
                    $('header.main a.profile').trigger('click');
                }
                // Close alerts menus
                if($('header.main div.alerts').attr('aria-hidden') === 'false') {
                    $('header.main a.alerts').trigger('click');
                }
            },
            triggerCloseCallback: function() {
                // Enable qTip
                api.enable();

            }
        });
    });
    
    /*----------------------------------------------------------------------------------------------
     * NOTIFICATIONS MENUS
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Define qtip options for menus
        var qtipOptions = {
            content: {
                attr: 'data-description'
            },
            style: {
                classes: 'qtip-tipsy qtip-shadow',
                tip: {
                    corner: true
                }
            },
            position: {
                my: 'top center',
                at: 'bottom middle'
            }
        };
        // Setup parameters for menus
        var parentSelector = 'header.main';
        var triggerSelector = 'a.alerts';
        var menuSelector = 'div.alerts';
        // Start qTip
        var tooltips = $(triggerSelector).qtip(qtipOptions);
        // Get the first api element
        var api = tooltips.qtip('api');
        // Initialize menus
        self.util.enableHeadMenus({
            'parentSelector': parentSelector,
            'triggerSelector': triggerSelector,
            'menuSelector': menuSelector,
            initializeCallback: function() {
                // Click event for more
                $(parentSelector).on('click', menuSelector + ' a.more', function(event) {
                    event.preventDefault();
                    // Scroll to bottom of main menus to expose remaining items
                    $(menuSelector).scrollTop($(menuSelector).height());
                });
                // Scroll event for main menus
                $(parentSelector + ' ' + menuSelector).on('scroll', function() {
                   // Determine if scroll top is greater than 0
                   if($(this).scrollTop() > 0) {
                       // Hide more
                       $(this).find('a.more').hide();
                   } else {
                       // show more
                       $(this).find('a.more').show();
                   }
                });
                // Add custom chrome webkit scroll css for anything other than mac
                if(self.client.isMac !== undefined && !self.client.isMac) {
                    $(parentSelector + ' ' + menuSelector).addClass('scroll');
                }
            },
            triggerOpenCallback: function() {
                // Hide qtip
                api.hide();
                // Disable qtip
                api.disable();
                // Close profile menus
                if($('header.main div.user-card').attr('aria-hidden') === 'false') {
                    $('header.main a.profile').trigger('click');
                }
                // Close main menus
                if($('header.main div.main-menus').attr('aria-hidden') === 'false') {
                    $('header.main a.main-menus').trigger('click');
                }
            },
            triggerCloseCallback: function() {
                // Enable qTip
                api.enable();

            }
        });
    });
    
    /*----------------------------------------------------------------------------------------------
     * USER
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Define qtip options for menus
        var qtipOptions = {
            content: self.config.user.username,
            style: {
                classes: 'qtip-tipsy qtip-shadow',
                tip: {
                    corner: true
                }
            },
            position: {
                my: 'top right',
                at: 'bottom left'
            }
        };
        // Start qTip
        $('a.user').qtip(qtipOptions);
    });

    /*----------------------------------------------------------------------------------------------
     * APPLICATION INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Define object of this modules
    self = {};
    
    /*----------------------------------------------------------------------------------------------
     * APPLICATION FUNCTIONS
     *--------------------------------------------------------------------------------------------*/
    
    /**
     * Define loader handler JavaScript UI
     * 
     * @param {Object} options
     * @param {String} options.loaderImageUrl
     * @param {String} options.text
     * @param {String} options.cssClass
     * @returns {HTML}
     */
    self.loaderHandler = function(options) {
        // Define options
        options = options || {};
        options.cssClass = options.cssClass || '';
        options.text = options.text || 'Loading Results.';
        options.loaderImageUrl = options.loaderImageUrl || self.config.loaderImageUrl;
        // Define loader
        var loader = $('<div>').addClass('loader ' + options.cssClass).append(
                $('<img>').prop({'alt': options.text, 'src': options.loaderImageUrl})
            ).append(
                $('<div>').addClass('text').text(options.text)
            );
        return loader.get(0).outerHTML;
    };
    
    /** 
     * Define message handler JavaScript UI
     * 
     * @param {String} messageType
     * Message type can be the following: error, success, warning, info
     * @param {String} messageContent
     * @returns {String} message
     **/
    self.messageHandler = function(messageType, messageContent) {
        var cssClass = messageType;
        // Determine class
        if(messageType === 'error') {
            cssClass = cssClass + ' bg-danger text-danger';
        } else if(messageType === 'success') {
            cssClass = cssClass + ' bg-success text-success';
        }
        var message = $('<div>').addClass(cssClass + ' alert message').append(
                $('<a>').addClass('close').attr({'data-dismiss':'alert'}).text('x')
        ).append(messageContent);
        return message.get(0).outerHTML;
    };
    
    /**
     * Wrap jQuery.ajax() for 401 support
     *  
     * @param {Object} options jQuery ajax options
     * @returns {undefined}
     */
    self.ajax = function(options) {
        // Check if option status code is undefined and define for default 401 callback
        if(options['statusCode'] === undefined ) { options['statusCode'] = {}; }
        // Check if 401 callback is undefined and define default callback below
        if(options['statusCode'][401] === undefined) {
            options['statusCode'][401] = function() {
                // If unauthorized, force redirect for login
                var expires = new Date(new Date().getTime() + parseInt(365) * 1000 * 60 * 60 * 24);
                $.cookie('redirect', window.location.pathname, { expires: expires, path: '/', domain: '.' + window.location.host, secure: false });
                window.location = '/ajax/ajax-error/';
            };
        }
        // Process ajax
        $.ajax(options);
    };
    
    /**
     * @param {String} contentWrap selector
     * @param {String} menuWrap selector
     * @param {Integer} top
     * @returns {undefined}
     */
    self.startMobileNavigation = function(contentWrap, menuWrap, top) {
        // Disable click events on content wrap
        $(contentWrap).find('div.pointer-events').css({'pointer-events':'none'});
        $(contentWrap).find('header.main, header.sub').css({'left': '240px'});
        $(contentWrap).css({'position':'fixed', 'min-width':'480px', 'top': top, 'bottom':'0', 'right':'0', 'left':'240px'});
        $(menuWrap).show();
        // Set the scroll top again for navigation slide. This will not affect content wrap since it's position is now fixed.
        // @TODO might want to adjust based on which li is active $(window).scrollTop($(menuWrap).find('ul li.active').offset().top - 60);
        $(window).scrollTop(0);
    };
    
    /**
     * @param {String} contentWrap selector
     * @param {String} menuWrap selector
     * @param {Number} top
     * @returns {undefined}
     */
    self.resetDisplay = function(contentWrap, menuWrap, top) {
       $(contentWrap).find('header.main, header.sub').css({'left': '0'});
       $(contentWrap).css({'position':'static', 'left':'0', 'width':'auto', 'min-width':'0'});
       // Enable click events on content wrap
       $(contentWrap).find('div.pointer-events').css({'pointer-events':'auto'});
       $(menuWrap).hide();
       // Return scroll top to original state
       $(window).scrollTop(top);
    };
    
    /**
     * @param {String} parentSelector
     * @param {String} activeClass
     */
   self.activeLink = function(parentSelector, activeClass) {
       // Set uri path
       var urlString = window.location.pathname;
       // Ensure last forward slash exists
       if(urlString.charAt(urlString.length - 1) !== '/') {
          urlString = urlString + '/';
       }
       // If there is a child navigation, then set parent nav link to active
       if($(parentSelector + '[data-nav-type="child"]').length > 0) {
           // Split and confirm lengh is greater than 2
           var urlVerification = urlString.split('/');
           // Assume url is currently on parent service root.
           // I.E. /settings/ and not /settings/foo/
           var urlStringParent = urlString;
           // Attempt to check if service is not at root and remove extra uri
           // I.E. /settings/foo/ and not /settings/
           // If the service is users, there is one more extra uri because of slug
           ((urlVerification[1] === 'users') ? lengthCheck = 4 : lengthCheck = 3);
           if(urlVerification.length > lengthCheck) {
               // Drop last forward slash
               parentUrlString = urlString.slice(0, -1);
               // Drop last uri since its the child
               var urlStringParent = parentUrlString.replace(parentUrlString.substr(parentUrlString.lastIndexOf('/') + 1), '');
           }
           // Loop through parents only and match
           $($(parentSelector + '[data-nav-type="parent"]').find('a')).each(function(index, value) {
               if(urlStringParent === $(value).attr('href')) {
                   $(value).parent().addClass(activeClass);
               }
           });
           // Now set selector for children only since parent link is set
           parentSelector = parentSelector + '[data-nav-type="child"]';
       }
       // Build active links
       $($(parentSelector).find('a')).each(function(index, value) {        
           // Build active link
           if(urlString === $(value).attr('href')) {
               $(value).parent().addClass(activeClass);
           }
       });
   };
   
   /**
    * PasswordStrength class
    */
   self.PasswordStrength = function() {
       'use strict';

       /**
        * @var {String}
        */
       var inputSelector = new String();

       /**
        * @var {Object}
        */
       var LOWER = /[a-z]/,
           UPPER = /[A-Z]/,
           DIGIT = /[0-9]/,
           DIGITS = /[0-9].*[0-9]/,
           SPECIAL = /[^a-zA-Z0-9]/,
           SAME = /^(.)\1+$/;

       /**
        * @param (String} element
        * @return {PasswordStrength}
        */
       this.setInputSelector = function(element) {
           inputSelector = element;
           return this;
       };

       /**
        * @return {PasswordStrength}
        */
       this.initializeKeyUp = function() {
           $(inputSelector).keyup(function(event) {
               getRating();
           });
           return this;  
       };

       /**
        * @return {PasswordStrength}
        */
       this.check = function() {
           getRating();
           return this;  
       };

       /**
        * @return rating
        */
       function getRating() {
           var password = $(inputSelector).val(); 
           if(!password || password.length < 8) {
               return rating(0, 'too-short');
           } else if(SAME.test(password)) {
               return rating(1, 'very-weak');
           } else {
               var lower = LOWER.test(password),
               upper = UPPER.test(uncapitalize(password)),
               digit = DIGIT.test(password),
               digits = DIGITS.test(password),
               special = SPECIAL.test(password);

               if(lower && upper && digit || lower && digits || upper && digits || special) {
                   return rating(4, 'strong');
               } else if(lower && upper || lower && digit || upper && digit) {
                   return rating(3, 'good');
               } else {
                   return rating(2, 'weak');
               }  
           }
       }
       
       /**
        * @param {String} str
        * @returns {unresolved}
        */
       function uncapitalize(str) {
           return str.substring(0, 1).toLowerCase() + str.substring(1);
       }

       function rating(rate, message) {
           var meter = $('.password-meter');
           meter.find('.password-meter-bar').removeClass().addClass('password-meter-bar').addClass('password-meter-' + message);
           meter.find('.password-meter-message')
           .removeClass()
           .addClass('password-meter-message')
           .addClass('password-meter-message-' + message)
           .text(message);
       }
   };

   // Return module
   return self;
})(jQuery, _);