var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    csso    = require('gulp-csso'),
    gutil   = require('gulp-util'),
    prefix  = require('gulp-autoprefixer');

//compass (scss)
gulp.task('sass', function() {
  return gulp.src(['src/sass/*.scss', 'src/sass/*.sass'])
        .pipe(sass())
        .pipe(prefix("last 2 versions", "> 1%", "Explorer 7"))
        .on('error', function(error) { gutil.log('Sass Compile Error', error) })
        .pipe(csso())
        .pipe(gulp.dest('www/css'));
})
