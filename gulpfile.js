(function() {
    'use strict';
    var gulp = require('gulp');
    var browserify = require('gulp-browserify');
    var uglify = require('gulp-uglify');
    var uglifycss = require('gulp-uglifycss');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var concat = require('gulp-concat');
    var rename = require('gulp-rename');
    var sass = require('gulp-sass');
    var stripCssComments = require('gulp-strip-css-comments');
    var googleWebFonts = require('gulp-google-webfonts');
    // Define distribution directory by determining if an environment 
    // variable has been set otherwise build in current project.
    var dist = process.env.PYLON_HOME || './dist';
    var imageFormats = '{gif,png,ico,svg}';
    var fontFormats = '{ttf,woff,eof,svg,otf,eot}';
    // Max lin length
    var maxLineLength = 8000;
    // Uglify optinos
    var uglifyJsOptions = {
        compress: {
            drop_console: true
        },
        output: {
            max_line_len: maxLineLength
        }
    };
    var uglifyCssOptions = {
        maxLineLength: maxLineLength,
        uglyComments: true
    };

    /*----------------------------------------------------------------------------------------------
     * TASKS
     *--------------------------------------------------------------------------------------------*/

    // Task for building the theme UI
    gulp.task('theme', function() {
        themeCss();
        themeJs();
        copyThemeImages();
        copyThemeFonts();
    });

    // Task for building the theme JS
    gulp.task('themeJs', function() {
        themeJs();
    });

    // Task for building the theme CSS
    gulp.task('themeCss', function() {
        themeCss();
    });

    // Define task batch processes (a task that runs an array of tasks)
    gulp.task('default', ['theme']);
    gulp.task('js', ['themeJs']);
    gulp.task('css', ['themeCss']);
    gulp.task('fonts', function() {
        buildFonts();
    });

    /*----------------------------------------------------------------------------------------------
     * TASK HELPER FUNCTIONS
     *--------------------------------------------------------------------------------------------*/

    /**
     * Builds the theme JS.
     */
    function themeJs () {
        // Build JS using browserify and minify
        gulp.src('./src/theme/js/build.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(rename({
            basename: 'application.min',
            extname: '.js'
        }))
        .pipe(buffer()) // Convert from streaming to buffered vinyl file object
        .pipe(uglify(uglifyJsOptions))
        .pipe(gulp.dest(dist + '/src/main/webapp/assets/js'));
    }

    /**
     * Builds the theme CSS.
     */
    function themeCss() {
        // Build CSS UI using SASS and minify
        gulp.src('./src/theme/sass/build.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            basename: 'application.min',
            extname: '.css'
        }))
        .pipe(stripCssComments({
            'all': true // Strip all comments including: /*!
        }))
        .pipe(uglifycss(uglifyCssOptions))
        .pipe(gulp.dest(dist + '/src/main/webapp/assets/css'));
    }

    /**
     * Builds google web fonts
     */
    function buildFonts() {
        var options = {};
        gulp.src('./src/theme/fonts/fonts.list')
            .pipe(googleWebFonts(options))
            .pipe(gulp.dest(dist + '/src/main/webapp/assets/fonts'));
    }

    /**
     * Copies the theme fonts
     */
    function copyThemeFonts() {
        copy('./src/theme/fonts/**/*.' + fontFormats, dist + '/src/main/webapp/assets/fonts');
    }

    /**
     * Copies the theme images
     */
    function copyThemeImages() {
        copy('./src/theme/img/**/*.' + imageFormats, dist + '/src/main/webapp/assets/img');
    }

    /**
     * @param {String}
     * @param {String}
     */
    function copy(src, dest) {
        gulp.src(src)
            .pipe(gulp.dest(dest));
    }
})();