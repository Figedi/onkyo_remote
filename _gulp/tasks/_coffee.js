var gulp       = require('gulp'),
    uglify     = require('gulp-uglify'),
    gutil      = require('gulp-util'),
    browserify = require('gulp-browserify'),
    concat     = require('gulp-concat'),
    config     = require('../config');

//Resolve dependencies and compress sources
gulp.task('coffee', function() {
    return gulp.src('src/coffee/app.coffee', { read: false })
        .pipe(browserify({
            transform: ['coffeeify'],
            extensions: ['.coffee'],
            shim: config.shim
        }))
        .on('error', function(error) { gutil.log(error) })
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/js'));
});
