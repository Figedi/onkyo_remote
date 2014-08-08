var gulp    = require('gulp'),
    args    = require('yargs').argv,
    config  = require('../config'),
    version = args.wversion || config.version,
    output  = "build/versions/"+version+"/onkyo_remote.wdgt",
    files   = ['www/vendor/**/*','www/js/*.js', 'www/css/*.css', 'www/index.html', 'www/html/*.html', 'www/img/*'];
gulp.task('build', [ 'coffee', 'sass', 'images', 'jade', 'copy-dep' ], function () {
  //copy js, css, img, html to new widget
  gulp.src('build/.reference_widget.wdgt/**/*')
  .pipe(gulp.dest(output));
  return gulp.src(files, { base: './www'})
         .pipe(gulp.dest(output));
});
