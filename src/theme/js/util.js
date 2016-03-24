module.exports = (function($, _) {
    /*----------------------------------------------------------------------------------------------
     * UTIL INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Define object of this module
    var self = {};
    
    /*----------------------------------------------------------------------------------------------
     * UTIL FUNCTIONS
     *--------------------------------------------------------------------------------------------*/

    /**
     * Builds the uri for exporting data to csv
     *
     * @example
     * // Define export data row
     * var exportDataRow = {'column1':'value1','column2':'value2','column3':'value3'};
     * // Add rows to export data
     * var exportData = [exportDataRow, exportDataRow, exportDataRow];
     * // Define column headers, the keys in the export data row above must match with the column header names
     * var columnHeaders = ['column1','column2','column3'];
     * // Call export function
     * uri = self.exportCsv(exportData,columnHeaders, true);
     * // Build anchor tag to csv export
     * var anchor = $('<a>').attr({
     *      'download': 'export.csv',
     *      'href': uri,
     *      'target': '_blank'
     *  }).text('download csv');
     * @param {Array} exportData one dimensional array of objects to be exported.
     * @param {Object} exportColumns one dimensional array of strings.
     * Each string is the name of a property of the objects contained in the array that are to be exported.
     * @param {Boolean} includeHeaders boolean indicating if the first row of the CSV should be the column names.
     * @returns {String} uri with data to export
     */
    self.exportCsv = function(exportData, exportColumns, includeHeaders) {
        includeHeaders = typeof includeHeaders !== 'undefined' ? includeHeaders : true;
        var csvData = [];
        if(exportData.length > 0 && exportColumns.length > 0) {
            // Determine if include headers is true
            if(includeHeaders) {
                csvData = [_.chain(exportData[0]).pick(exportColumns).keys().value().join(', ')];
            }
            _(exportData).each(function(element, index, list){
                csvData.push(_.chain(element).pick(exportColumns).values().value().join(', '));
            });
        }
        var output = csvData.join('\n');
        var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(output);
        return uri;
    };
     
    /**
     * Hides the url bar inside mobile devices
     * 
     * @returns {undefined}
     */
    self.hideUrlBar = function() {
        if (window.location.hash.indexOf('#') === -1) {
            window.scrollTo(0, 1);
        }
    };

    /**
     * @returns {Object} url parameters
     */
    self.getUrlParameters = function() {
        var searchString = window.location.search.substring(1)
            , params = searchString.split("&")
            , hash = {}
            ;

        for (var i = 0; i < params.length; i++) {
          var val = params[i].split("=");
          hash[unescape(val[0])] = unescape(val[1]);
        }
        return hash;
    };
    
    /**
     * Live jQuery hover function.
     * The parent selector should contain the child DOM element (childSelector).
     * The parent selector allows the hover event to be live.
     * 
     * @param {String} parentSelector
     * @param {String} childSelector
     * @param {Function} mouseEnter
     * @param {Function} mouseLeave
     * @returns {undefined}
     */
    self.hover = function(parentSelector, childSelector, mouseEnter, mouseLeave) {
       $(parentSelector).on({
           mouseenter: function() {
               if(mouseEnter !== null) {
                   mouseEnter(this);
               }
           },
           mouseleave: function() {
               if(mouseLeave !== null) {
                   mouseLeave(this);
               }
           }
       }, childSelector);
    };

    /**
     * Used to prevent window scrolling without css
     * Using CSS can cause the window to adjust when the bar vanishes or reappears causing bad 
     * UI experience in some browsers.
     * If you want to scroll the element you're over and prevent the window to scroll,
     * you can pass a jQuery selector of the elemnt you want to allow to scroll
     * 
     * @param {String} excludingSelector, the DOM elment you want to 
     * @returns {undefined}
     */
    self.preventWindowScroll = function(excludingSelector) {
        if(excludingSelector) {
            $(excludingSelector).on('DOMMouseScroll mousewheel', function(ev) {
                var $this = $(this),
                    scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = $this.height(),
                    delta = (ev.type == 'DOMMouseScroll' ?
                        ev.originalEvent.detail * -40 :
                        ev.originalEvent.wheelDelta),
                    up = delta > 0;

                var prevent = function() {
                    ev.stopPropagation();
                    ev.preventDefault();
                    ev.returnValue = false;
                    return false;
                }

                if (!up && -delta > scrollHeight - height - scrollTop) {
                    // Scrolling down, but this will take us past the bottom.
                    $this.scrollTop(scrollHeight);

                    return prevent();
                } else if (up && delta > scrollTop) {
                    // Scrolling up, but this will take us past the top.
                    $this.scrollTop(0);
                    return prevent();
                }
            });
        } else {
           // Prevent all scrolling
           $('html').on('DOMMouseScroll mousewheel', function(event) {
                // Prevent window scroll
                event.preventDefault();
            }); 
        }
    };
    
    /**
     * Disables any events bound to DOMMouseScroll or mousewheel on the html.
     * This is often used in conjunction with self.preventWindowScroll above for pop up
     * menus.
     * 
     * @returns {undefined}
     */
    self.enableWindowScroll = function() {
        $('html').off('DOMMouseScroll mousewheel');
    };
    
    /**
     * Enables hide/show functionality on a menu item
     * 
     * @param {Object} opitions
     * @param {String|Object} opitions.parentSelector the DOM element that wraps the trigger and menu
     * @param {String|Object} opitions.triggerSelector the DOM element that triggers the menus
     * @example
     *      <a class="main-menu-trigger">Navigate</a>
     * @param {String|Object} opitions.menuSelector the menus DOM element
     * @example
     *      <nav class="main-menu">Anchor elements...</nav>
     * @param {Function} opitions.initializeCallback fires when enable head mensu is called
     * @param {Function} opitions.triggerOpenCallback fires when the menus is triggered
     * @param {Function} opitions.triggerCloseCallback fires when the menus is closed
     * @returns {undefined}
     */
    self.enableHeadMenus = function(options) {
        // Click event for showing menu
        $(options.parentSelector).on('click touchstart touch', options.triggerSelector, function(event) {
            event.preventDefault();
            if(options.triggerOpenCallback !== undefined) { options.triggerOpenCallback.call(this); }
            // Turn off any previous one events to prevent stacking
            $(window).off('resize');
            var target = $(this).data('target');
            var objContext = this;
            if($(target).attr('aria-hidden') === 'true') {
                $(target).attr('aria-hidden', false);
                $(target).fadeIn(100);
                $(objContext).append($('<div>').addClass('carrot hide').fadeIn(100));
                // Scroll to top of menus
                $(options.menuSelector).scrollTop(0);
                // Create one reset display event for resize
                $(window).one('resize', function() {
                    $(target).attr('aria-hidden', true);
                    $(target).hide();
                    $(objContext).find('div.carrot').remove();
                    // Call menus close callback
                    if(options.triggerCloseCallback !== undefined) { options.triggerCloseCallback.call(this); }
                });
                one.call(objContext, target);
            } else {
                $(target).attr('aria-hidden', true);
                $(target).hide();
                $(objContext).find('div.carrot').remove();
                // Call menus close callback
                if(options.triggerCloseCallback !== undefined) { options.triggerCloseCallback.call(this); }
            }
        });
        // Define mouse enter for hover event
        function mouseEnter() {
            self.preventWindowScroll(options.menuSelector);
        }
        // Define mouse leave for hover event
        function mouseLeave() {
            self.enableWindowScroll();
        }
        // Hover event for main menus to control window scrolling
        self.hover(options.parentSelector, options.menuSelector, mouseEnter, mouseLeave);
        // Use to control when to hide the opened menus
        function one(target) {
            // Turn off any previous one events to prevent stacking
            $(document).off('click touchstart touch');
            // Delay the creation of the one event below because any previous click events registering
            // function one cascade to fire the event below after it's created.
            setTimeout(function() {
                // Create one reset display event on content slide
                $(document).one('click touchstart touch', function(event) {
                    event.stopImmediatePropagation();
                    if($(event.target).parents(options.menuSelector).first().get(0) != $(target).get(0)
                        && $(event.target).first().get(0) != $(target).get(0)) {
                        $(target).attr('aria-hidden', true);
                        $(target).hide();
                        $(this).find('div.carrot').remove();
                        // Call menus close callback
                        if(options.triggerCloseCallback !== undefined) { options.triggerCloseCallback.call(this); }
                    } else {
                        // Recursion
                        one(target);
                    }
                });
            }, 1);
        }
        // Kick off initialize callback
        if(options.initializeCallback !== undefined) { options.initializeCallback.call(this); }
    };

    /**
     * Sends the client back one page
     * 
     * @returns {undefined}
     */
    self.goBack = function() {
        window.history.back();
    };
    
    /**
     * Can be used to set a callback function which is called before the browser window
     * state is going to change (IE, back, redirect, reload, forward and etc).
     * 
     * @param {Function} callback
     * @returns {undefined}
     */
    self.beforeWindowUnload = function(callback) {
        // Define default callback if callback undefinied
        callback = callback || function() {
            return "You have attempted to leave this page. " +
                "If you have made any changes to the fields without clicking the Save button, " + 
                "your changes will be lost.  Are you sure you want to exit this page?";
        };
        // Set callback
        window.onbeforeunload = callback;
    };
    
    /**
     * Define function for sorting options.
     * This function will determine if there is a
     * selected option by attribute and empty value.
     * This selected option will be excluded from the sorting
     * and pushed to the top of the options list.
     * If the selected option has a value, 
     * it is sorted with the rest of the option items.
     * This function can sort multiple selects in one call.
     *
     * @param {String|jQueryObject} selector
     * @example: 
     *  namespace.self.sortOptions('select');
     * @example:
     *  var jquerySelectObject = $('select');
     *  namespace.self.sortOptions(jquerySelectObject);
     */
    self.sortOptions = function(selector) {
        // Define jquery object
        var jqueryObject = $(selector);
        jqueryObject.each(function(index, value) {
            var jquerySelectOption = $(value);
            // Define selected option
            var selectedOption = jquerySelectOption.find('option:selected');
            // Define options
            var options = new Array();
            // Define value attribute
            // Jquery will default to option text value if the attribute doesn't exist
            // when using .val
            var valueAttribute = selectedOption.attr('value');
            // Determine if the selected element is a top level option element
            // Based on if the value is empty
            if(selectedOption.length > 0 &&
                (valueAttribute === undefined || valueAttribute === '')) {
                // We don't know the selected option order
                // So we grab all it's siblings
                options = selectedOption.siblings();
            } else {
                // Grab all the options
                options = jquerySelectOption.find('option');
            }
            // Sort options
            options.sort(function(a, b) {
                return a.text > b.text ? 1 : -1;
            });
            // Empty current select
            jquerySelectOption.empty();
            // Append top level selected element if it exists
            if(selectedOption.length > 0 &&
                (valueAttribute === undefined || valueAttribute === '')) {
                    jquerySelectOption.append(selectedOption);
                    // Must force remove selected attribute for ie8
                    // Jquery option object continues to take the option
                    // from the top and make it selected if there isn't a selected object
                    options.removeAttr('selected');
            }
            // Append the sorted options back to the list
            jquerySelectOption.append(options);
        });
    };
    
    /**
     * RFC 2822
     * @param {String} email
     * @returns {RegExp}
     */
    self.isEmail = function(email) {
        return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
    };

    /**
    * StickyElement will make an element fixed based on the scroll position and parameters provided.
    * It also will return the element back to it's static position based on the scroll position and parameters provided.
    * 
    * @param selector string
    * @param topOffSet int
    * @param heightControlModifier int
    * @param marginTopFixed string
    * @param marginTopStatic string
    * @param marginLeftFixed string
    * @param marginLeftStatic string
    * @author Andre Crouch
    */
    self.stickyElement = function(selector, topOffSet, heightControlModifier, marginTopFixed, marginTopStatic, marginLeftFixed, marginLeftStatic) {
       var obj = $(selector);
       $(window).scroll(function() {
           /**
            * So here's the deal, if your browser window is too small, the sticky elements displays improperly.
            * The scroll also acts very glithcy when the window is positioned so there is a minimal amount of scroll required.
            * So to solve for these problems we need to know the total height of the sticky element
            * The if statement checks if the total height is larger than the window height.
            * If that's the case, the sticky object remains static.
            */
           //if(obj.height() + heightControlModifier >= $(window).height()) {
               obj.css({
                   marginTop: marginTopStatic,
                   marginLeft: marginLeftStatic,
                   position: 'static'
               });
           //} else {
               var scrollTop = $(window).scrollTop();
               if (scrollTop < topOffSet){
                   obj.css({
                       marginTop: marginTopStatic,
                       marginLeft: marginLeftStatic,
                       position: 'static'
                   });
               }
               if (scrollTop >= topOffSet){

                   obj.css({
                       marginTop: marginTopFixed,
                       marginLeft: marginLeftFixed,
                       position: 'fixed'
                   });
               }
           //}
       });    
    };
    
    // Set tzOffset cookie for server to use
    self.setTimezoneCookie = function() {
        var tzOffset = 'tzOffset';
        var expires = new Date(new Date().getTime() + parseInt(365) * 1000 * 60 * 60 * 24);
        // If the timezone cookie not exists create one.
        if (!$.cookie(tzOffset)) { 
            // Check if the browser supports cookie
            var testCookie = 'testCookie';
            $.cookie(testCookie, true);
            // Browser supports cookie
            if ($.cookie(testCookie)) {
                // Delete the test cookie
                $.cookie(testCookie, null);
                // Create a new cookie
                $.cookie(tzOffset, new Date().getTimezoneOffset(), { expires: expires, path: '/', domain: '.' + window.location.host, secure: false });
                // Re-load the page
                location.reload();
            }
        } else {    
            // If the current timezone and the one stored in cookie are different
            // then store the new timezone in the cookie and refresh the page.  
            var storedOffset = parseInt($.cookie(tzOffset));
            var currentOffset = new Date().getTimezoneOffset();
            // User may have changed the timezone
            if (storedOffset !== currentOffset) { 
                // Create a new cookie
                $.cookie(tzOffset, new Date().getTimezoneOffset(), { expires: expires, path: '/', domain: '.' + window.location.host, secure: false });
                location.reload();
            }
        }
    };
    
    /**
     * Ellipsis creater for multiline.
     * 
     * @param {String} text
     * @param {Number} maxLength
     */
   self.shorten = function(text, maxLength) {
       var ret = text;
       if (ret.length > maxLength) {
           ret = ret.substr(0,maxLength-3) + "...";
       }
       return ret;
   };

   return self;
})(jQuery, _);
