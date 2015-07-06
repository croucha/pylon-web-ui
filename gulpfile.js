(function() {
    'use strict';
    var gulp = require('gulp');
    var browserify = require('gulp-browserify');
    var uglify = require('gulp-uglify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var concat = require('gulp-concat');
    var rename = require('gulp-rename');
    var sass = require('gulp-sass');
    var minifyCss = require('gulp-minify-css');
    var stripCssComments = require('gulp-strip-css-comments');
    // Define distribution directory by determining if an environment 
    // variable has been set otherwise build in current project.
    var dist = process.env.PYLON_HOME || './dist';

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

    /*----------------------------------------------------------------------------------------------
     * TASK HELPER FUNCTIONS
     *--------------------------------------------------------------------------------------------*/

    /**
     * Builds the theme JS.
     */
    function themeJs () {
        // Build JS using browserify and minify
        gulp.src('./src/theme/js/main.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(rename({
            basename: 'application.min',
            extname: '.js'
        }))
        .pipe(buffer()) // Convert from streaming to buffered vinyl file object
        .pipe(uglify())
        .pipe(gulp.dest(dist + '/src/main/webapp/assets/js'));
    }

    /**
     * Builds the theme CSS.
     */
    function themeCss() {
        // Build CSS UI using SASS and minify
        gulp.src('./src/theme/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            basename: 'application.min',
            extname: '.css'
        }))
        .pipe(stripCssComments({
            'all': true // Strip all comments including: /*!
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(dist + '/src/main/webapp/assets/css'));
    }

    /**
     * Copies the theme fonts
     */
    function copyThemeFonts() {
        gulp.src('./src/theme/fonts/**/*.{ttf,woff,eof,svg,otf,eot}')
        .pipe(gulp.dest(dist + '/src/main/webapp/assets/fonts'));
    }

    /**
     * Copies the theme images
     */
    function copyThemeImages() {
        gulp.src('./src/theme/img/**/*.{gif,png,ico}')
        .pipe(gulp.dest(dist + '/src/main/webapp/assets/img'));
    }
})();