'use strict';

// basic
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import fs from 'fs';

// some config files
import webpackCfg from './configs/webpack.babel.config';

// gulp plugins
var gconcat = require('gulp-concat');
var gutil = require('gulp-util');
var swig = require('gulp-swig');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-html-minifier');
var minifyCss = require('gulp-clean-css');

const baseTarget    = __dirname + '/public';
const topicTgt      = baseTarget + '/topics';
const assetsTarget  = baseTarget + '/assets';
const stylesTarget  = assetsTarget + '/css';
const scriptsTarget = assetsTarget + '/scripts';
const fontsTarget   = assetsTarget + '/fonts';
const imagesTarget  = assetsTarget + '/images';
const baseSource    = __dirname + '/src';
const pageSource    = baseSource + '/pages';
const pageLayoutSrc = baseSource + '/layouts';
const topicSrc      = baseSource + '/topics';
const pageIncludes  = baseSource + '/pages/includes';
const stylesSource  = baseSource + '/css';
const scriptsSource = baseSource + '/scripts';
const dataSource    = baseSource + '/data';
const fontsSource   = baseSource + '/fonts';
const imagesSource  = baseSource + '/images';

function parseJSON(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    throw "Failed parsing "+filename+" error: "+err;
  }
}

// topicURL generator
function topicURL (type, id) {
  if (type == 'topic') {
    return '/topics/' + id + '/';
  }
}

// filterBy filters object (e.g. topic) by the given
// property name and value
function filterBy (name, value) {
  return function (obj) {
    return obj[name] === value;
  }
}

// turn an object into an array
function toArray (obj) {
  var arr = [];
  for ( var key in obj ) {
      arr.push(obj[key]);
  }
  return arr
}

// formatting (or not formatting) description strings
function displayDesc (input) {
  if (Array.isArray(input)) {
    return input.join(' ');
  }
  return input;
}

// capitalize string
function capitalize(type) {
  return type[0].toUpperCase() + type.slice(1);
}

const data = {
  "timeHash":  new Buffer(Date.now().toString()).toString('base64').slice(0,6),
  "site_host": "http://2016.opensource.hk",

  // read those files everytime with fs
  // instead of `require` (will cache the file)
  "topics":   parseJSON(dataSource + '/topics.json',   'utf8'),
  "tags":     parseJSON(dataSource + '/tags.json',     'utf8'),
  "speakers": parseJSON(dataSource + '/speakers.json', 'utf8'),
  "langs":    parseJSON(dataSource + '/langs.json',    'utf8'),
  "levels":   parseJSON(dataSource + '/levels.json',   'utf8'),
  "sponsors": parseJSON(dataSource + '/sponsors.json', 'utf8'),
  "news":     parseJSON(dataSource + '/news.json',     'utf8')
};

const dataExtended = {
  "topicsByType": {
    "Keynotes": toArray(data.topics).filter(filterBy('type', 'keynote')),
    "Talks": toArray(data.topics).filter(filterBy('type', 'talk')),
    "Workshops": toArray(data.topics).filter(filterBy('type', 'workshop')),
    "Lightning Talks": toArray(data.topics).filter(filterBy('type', 'lightening-talk'))
  }
};

const helperFuncs = {
  "capitalize": capitalize,
  "displayDesc": displayDesc,
  "filterBy": filterBy,
  "toArray": toArray,
  "topicURL": topicURL
};

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
  gulp.watch([
    stylesSource + '/**/*.sass',
    stylesSource + '/**/*.scss'
  ], ["styles"]);
  gulp.watch([
    topicSrc + '/**/*.html',
    dataSource + '/*.json'
  ], ["topics"]);
  gulp.watch([
    pageSource + '/**/*.html',
    pageLayoutSrc + '/**/*.html',
    dataSource + '/*.json'
  ], ["templates"]);
  gulp.watch(scriptsSource + '/**/*.*', ['webpack']);
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
   .pipe(swig({
     defaults: { cache: false },
     data: Object.assign(
       {},
       data,
       dataExtended,
       helperFuncs
     )
   }))
   .pipe(htmlmin({collapseWhitespace: true}))
   .pipe(gulp.dest(baseTarget));
});

// convert topic from templates
gulp.task('topics', function() {

  // generate topic index
  gulp.src(topicSrc + '/topics.html')
    .pipe(swig({
      defaults: {cache: false},
      load_json: false,
      data: Object.assign(
        {},
        data,
        dataExtended,
        helperFuncs
      )
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename('/index.html'))
    .pipe(gulp.dest(topicTgt));

  // generate topic pages
  Object.keys(data.topics).forEach(function (topic_id) {
    var topic = data.topics[topic_id];
    gulp.src(topicSrc + '/topic.html')
      .pipe(swig({
        defaults: {cache: false},
        load_json: false,
        data: Object.assign(
          {
            "topic_id": topic_id,
            "topic": topic
          },
          data,
          dataExtended,
          helperFuncs
        )
      }))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(rename(topic_id + '/index.html'))
      .pipe(gulp.dest(topicTgt));
  });
});

// bundle scripts
gulp.task('webpack', function(callback) {
  // run webpack
  webpack(webpackCfg, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));

    // use setImmediate prevent Stack overflow
    // By Effective Javascript.
    setImmediate(callback);
  });
});

// concat and mangle vendor scripts
gulp.task('vendors', function() {
  return gulp.src([
      scriptsSource + '/vendors/bootstrap.min.js',
      scriptsSource + '/vendors/ga.js'
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
  'topics',
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

gulp.task('default', ['dev']);
