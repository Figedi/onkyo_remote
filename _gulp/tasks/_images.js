var gulp     = require('gulp'),
    cache    = require('gulp-cache'),
    imagemin = require('gulp-imagemin');
//images
gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('www/img'));
});
