
// basic
var gulp = require('gulp');
var browserSync = require('browser-sync');
var webpack = require('webpack');

// gulp plugins
var gconcat = require('gulp-concat');
var gutil = require('gulp-util');
var swig = require('gulp-swig');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

const baseTarget    = __dirname + '/public';
const assetsTarget  = baseTarget + '/assets';
const stylesTarget  = assetsTarget + '/css';
const scriptsTarget = assetsTarget + '/scripts';
const fontsTarget   = assetsTarget + '/fonts';
const imagesTarget  = assetsTarget + '/images';
const baseSource    = __dirname + '/src'
const pageSource    = baseSource + '/pages';
const pageLayoutSrc = baseSource + '/layouts';
const pageIncludes  = baseSource + '/pages/includes';
const stylesSource  = baseSource + '/css';
const scriptsSource = baseSource + '/scripts'
const fontsSource   = baseSource + '/fonts';
const imagesSource  = baseSource + '/images';

// watch the public files
// hot reload if there is changes
gulp.task('serve-dev', function() {
  var files = [
    baseTarget    + '/**/*.html',
    stylesTarget  + '/**/*.css',
    scriptsTarget + '/**/*.js'
  ];
  browserSync.init(files, {
    server: {
      baseDir: baseTarget
    }
  });
});

// watch the source files
// generates public files
gulp.task('watch', function() {
  watch([
    stylesSource + '/**/*.sass',
    stylesSource + '/**/*.scss'
  ], function () {
    gulp.run('styles');
  });
  watch([
    pageSource + '/**/*.html',
    pageLayoutSrc + '/**/*.html'
  ], function () {
    gulp.run('templates');
  });
  watch(scriptsSource + '/**/*.*', function () {
    gulp.run('webpack');
  });
});

// convert styles
gulp.task('styles', function() {
  gulp.src(stylesSource + '/*.sass')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(minifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(stylesTarget));

  gulp.src(stylesSource + '/*.scss')
    .pipe(sass())
    .pipe(minifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(stylesTarget));
});

// convert html
gulp.task('templates', function() {
  gulp.src(
    pageSource + '/**/*.html')
   .pipe(swig())
   .pipe(gulp.dest(baseTarget));
//  gulp.src([
//      pageSource + '/**/*.jade',
//      '!' + pageIncludes + '/**/*.jade'
//    ])
//    .pipe(jade({
//      locals: {}
//    }))
//    .pipe(gulp.dest(baseTarget));
});

// bundle scripts
gulp.task('webpack', function(callback) {
  // run webpack
  var webpackCfg = require('./configs/webpack.config');
  webpack(webpackCfg, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    callback();
  });
});

// concat and mangle vendor scripts
gulp.task('vendors', function() {
  return gulp.src([
      scriptsSource + '/vendors/bootstrap.min.js',
      scriptsSource + '/vendors/ga.js',
    ])
    .pipe(gconcat('vendors.js'))
    .pipe(gulp.dest(scriptsTarget))
    .pipe(rename('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsTarget));
});

gulp.task('images', function() {
  return gulp.src(imagesSource + '/**/*.*')
    .pipe(gulp.dest(imagesTarget));
});

gulp.task('fonts', function() {
  return gulp.src(fontsSource + '/**/*.*')
    .pipe(gulp.dest(fontsTarget));
});

// build the source files
gulp.task('build', [
  'styles',
  'templates',
  'images',
  'fonts',
  'vendors',
  'webpack'
]);

// dev default task(s)
gulp.task('dev', [
  'build',
  'watch',
  'serve-dev'
]);

// define default task(s)
gulp.task('run', ['dev']);
