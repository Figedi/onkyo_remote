var gulp        = require("gulp");
var browserSync = require('browser-sync');
var config      = require('../config');

gulp.task('serve', ['build'], function() {


  browserSync.init([config.root+'/www/**'], {
    server: {
      baseDir: config.root+'/www'
    }
  });

});
