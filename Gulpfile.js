'use strict';
var gulp = require('gulp');
var sync = require('browser-sync');
var nodemon = require('gulp-nodemon');

// the paths to our app files
var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/app/**/*.js'],
  html: ['client/app/**/*.html', 'client/index.html'],
  styles: ['client/css/styles.css']
};

// any changes made to your
// client side code will automatically refresh your page
// with the new changes
gulp.task('start', ['serve'], function() {
  sync({
    notify: true,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'http://localhost:3000',
    port: 7000
  });
});

// start our node server using nodemon
gulp.task('serve', function() {
  nodemon({
    script: './server/server.js',
    ignore: 'node_modules/**/*.js'
  });
});

gulp.task('default', ['start']);