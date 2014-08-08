var gulp       = require('gulp'),
    config     = require('../config'),
    gutil      = require('gulp-util');

gulp.task('watch', function() {
    gulp.watch('src/coffee/**/*.coffee', ['coffee']);
    gulp.watch(['src/sass/*.scss', 'src/sass/*.sass'], ['sass']);
    gulp.watch('src/jade/*.jade', ['jade']);
    gulp.watch('src/img/*', ['images']);
});
