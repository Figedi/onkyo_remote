var gulp  = require('gulp'),
    jade  = require('gulp-jade'),
    gutil = require('gulp-util');

// Compile jade files to root
gulp.task('jade', function() {
    gulp.src('src/jade/index.jade')
    .pipe(jade())
    .on('error', function(error) { gutil.log(error) })
    .pipe(gulp.dest('www/'));
    return gulp.src(['src/jade/*.jade', '!src/jade/index.jade'])
        .pipe(jade())
        .on('error', function(error) { gutil.log(error) })
        .pipe(gulp.dest('www/html'));
});

