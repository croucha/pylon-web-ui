// Node npm modules
window.moment = require('moment');
window._ = require("underscore");
window.$ = require('jquery');
window.jQuery = window.$;
require('jquery-ui');
require('jquery.cookie');
require('qtip2');
// Application library modules
require('../../lib/bootstrap/bootstrap.min.js');
// Application modules
(function(window, _) {
    var underscoreDeepExtend = require('underscore-deep-extend');
    _.mixin({deepExtend: underscoreDeepExtend(_)});
    var app = require('./application.js');
    app.util = require('./util.js');
    app.client = require('./client.js');
    // Expose
    window.app = _.deepExtend(app, window.app);
})(window, _);