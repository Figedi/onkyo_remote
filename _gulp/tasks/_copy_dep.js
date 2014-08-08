var gulp       = require('gulp'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    csso       = require('gulp-csso')
    gutil      = require('gulp-util'),
    bower      = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    rename     = require('gulp-rename');

var DEST       = 'www/vendor';

gulp.task('copy-dep', function() {
  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');
  var fontRegex = /\.(eot|svg|ttf|woff|otf)$/;
  return gulp.src(bower())
    .pipe(jsFilter)
    .pipe(uglify({mangle: false, compress: false}))
    .pipe(concat('js/vendor.min.js'))
    .pipe(gulp.dest(DEST))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    //.pipe(csso()) // deactivate csso for now, since onsen ui has a css bug in css components
    .pipe(concat('css/vendor.min.css'))
    .pipe(gulp.dest(DEST))
    .pipe(cssFilter.restore())
    .pipe(rename(function(path) {
       if (fontRegex.test(path.extname)) {
         path.dirname = '/fonts'
       }
    }))
    //write fonts to destination
    .pipe(gulp.dest(DEST));
});
