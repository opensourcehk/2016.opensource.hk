'use strict';

// basic
import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import fs from 'fs';
import net from 'net';
import path from 'path';
import chalk from 'chalk';
import 'babel-polyfill';
import moment from 'moment';
import ls from 'ls';
import deepFreeze from 'deep-freeze';

// some config files
import webpackCfg from './configs/webpack.babel.config';

// gulp plugins
import gconcat   from 'gulp-concat';
import gutil     from 'gulp-util';
import swig      from 'gulp-swig';
import rename    from 'gulp-rename';
import sass      from 'gulp-sass';
import uglify    from 'gulp-uglify';
import htmlmin   from 'gulp-html-minifier';
import minifyCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';

import helperFuncs from './src/scripts/utils/helperFuncs';

const baseTarget    = `${__dirname}/public`;
const assetsTarget  = `${baseTarget}/assets`;
const stylesTarget  = `${assetsTarget}/css`;
const scriptsTarget = `${assetsTarget}/scripts`;
const fontsTarget   = `${assetsTarget}/fonts`;
const imagesTarget  = `${assetsTarget}/images`;
const baseSource    = `${__dirname}/src`;
const pageSource    = `${baseSource}/pages`;
const pageLayoutSrc = `${baseSource}/layouts`;
const pageIncludes  = `${baseSource}/pages/includes`;
const stylesSource  = `${baseSource}/css`;
const scriptsSource = `${baseSource}/scripts`;
const dataSource    = `${baseSource}/data`;
const fontsSource   = `${baseSource}/fonts`;
const imagesSource  = `${baseSource}/images`;

function parseJSON(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    throw `Failed parsing ${filename} error: ${err}`;
  }
}

function timeHash() {
  let buffer = new Buffer(Date.now().toString()).toString('base64')
  return buffer
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=+$/, '')
    .split("").reverse().join("")
    .slice(0,6);
}

// getData read those files everytime with fs
// instead of `require` (will cache the file)
function getData(dataSource) {
  let data = {
    "now":       moment().utcOffset("+08:00"),
    "timeHash":  timeHash(),
    "site_host": "http://2016.opensource.hk"
  };

  // read every json file in the dataSource directory
  for (let file of ls(`${dataSource}/*.json`)) {
    // i.e. hello.json will be imported into data["hello"]
    gutil.log(`getData parse: '${dataSource}/${chalk.magenta(file.name)}.json'`);
    data[file.name] = parseJSON(file.full, 'utf8');
  }
  return data;
}

function getErrorCatcher (msg) {
  return function (e) {
    console.error(e);
    gutil.log(`${msg}\n${e}`);
  }
}


// TODO: add pre-rendered Programmes app (initial state) to the programmes page

// watch the public files
// hot reload if there is changes
gulp.task('serve-dev', function() {

  const hostname = process.env.HOSTNAME || "127.0.0.1";
  const port = process.env.PORT || 3000;

  let devConfig = {
    devtool: 'eval',
    entry: [
      `webpack-dev-server/client?http://${hostname}:${port}`,
      'webpack/hot/only-dev-server',
      './src/scripts/client'
    ],
    output: {
      path: path.join(__dirname, 'public/assets/scripts'),
      filename: 'bundle.js',
      publicPath: '/assets/scripts/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['react-hot', 'babel'],
          include: path.join(__dirname, 'src')
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    }
  };

  let server = new WebpackDevServer(webpack(devConfig), {
    contentBase: "./public",
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: false,
    stats: { colors: true }
  });

  var portInUse = function(port, hostname, callback) {
    var server = net.createServer(function(socket) {
      socket.write('Echo server\r\n');
      socket.pipe(socket);
    });

    server.listen(port, hostname);
    server.on('error', function (e) {
      callback(true, hostname, port);
    });

    server.on('listening', function (e) {
      server.close();
      callback(false, hostname, port);
    });
  };

  // test if port in use
  portInUse(port, hostname, function (inUse, hostname, port) {
    if (inUse) {
      gutil.log('Port ' + chalk.magenta(`${hostname}:${port}`) + ' is in use. ' + chalk.red.bold('[failed]'));
      process.exit(1); // quit with fail code
    }
    server.listen(port, hostname, function (err, result) {
      if (err) {
        return console.log(err);
      }

      gutil.log('Listening at ' + chalk.magenta(`http://${hostname}:${port}/`) + ' ' + chalk.green.bold('[success]'));
    });
  });

});

// watch the source files
// generates public files
gulp.task('watch', function() {
  gulp.watch([
    `${stylesSource}/**/*.sass`,
    `${stylesSource}/**/*.scss`
  ], ["styles"]);
  gulp.watch([
    `${pageSource}/**/*.html`,
    `${pageLayoutSrc}/**/*.html`,
    `${dataSource}/*.json`
  ], ["pages"]);
  gulp.watch([
    `${imagesSource}/**/*.*`
  ], ["images"]);
});

// convert styles
gulp.task('styles', function() {
  gulp.src(`${stylesSource}/*.scss`)
    .pipe(sass().on('error', getErrorCatcher("Error compiling sass file")))
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(minifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(stylesTarget));

  gulp.src(stylesSource + '/*.scss')
    .pipe(sass().on('error', getErrorCatcher("Error compiling scss file")))
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(minifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(stylesTarget));
});

// convert html
gulp.task('pages', function() {

  // get data from JSON every compile time
  const rawData = getData(dataSource);

  // extend data with topicsByType
  const data = Object.assign(
    {
      data: rawData,
      defaultScripts: [
        "https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react-dom.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/redux/3.5.2/redux.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/react-redux/4.4.5/react-redux.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js",
        "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js",
        "/assets/scripts/vendors.js",
        "/assets/scripts/bundle.js?" + rawData.timeHash
      ]
    },
    rawData,
    {
      "topicsByType": {
        "Keynotes":        helperFuncs.toArray(rawData.topics).filter(helperFuncs.filterBy('type', 'keynote')),
        "Talks":           helperFuncs.toArray(rawData.topics).filter(helperFuncs.filterBy('type', 'talk')),
        "Workshops":       helperFuncs.toArray(rawData.topics).filter(helperFuncs.filterBy('type', 'workshop')),
        "Lightning Talks": helperFuncs.toArray(rawData.topics).filter(helperFuncs.filterBy('type', 'lightening-talk'))
      }
    }
  );

  // freeze all objects within data
  deepFreeze(data);

  var catchError = getErrorCatcher("Error compiling swig template");

  // most pages
  gulp.src([
      `${pageSource}/**/*.html`,
      `!/**/_*.html`
    ])
    .pipe(swig({
      defaults: { cache: false },
      data: Object.assign(
        {},
        data,
        helperFuncs
      )
    }).on('error', catchError))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(baseTarget));

  // generate topic pages
  for (let topic_id in data.topics) {
    var topic = data.topics[topic_id];
    gutil.log('Generate: \'/topics/' + chalk.magenta(topic_id) + '/index.html\'')
    gulp.src(`${pageSource}/topics/_topic.html`)
      .pipe(swig({
        defaults: {cache: false},
        load_json: false,
        data: Object.assign(
          {
            "topic_id": topic_id,
            "topic": topic
          },
          data,
          helperFuncs
        )
      }).on('error', catchError))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(rename(`${topic_id}/index.html`))
      .pipe(gulp.dest(`${baseTarget}/topics/`));
  }


});

// bundle scripts
gulp.task('scripts-bundle', function(callback) {
  // run webpack
  webpack(webpackCfg, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
      colors: true
    }));

    // use setImmediate prevent Stack overflow
    // By Effective Javascript.
    setImmediate(callback);
  });
});

// concat and mangle vendor scripts
gulp.task('scripts-vendors', function() {
  return gulp.src([
      `${scriptsSource}/vendors/bootstrap.min.js`,
      `${scriptsSource} + '/vendors/ga.js`
    ])
    .pipe(gconcat('vendors.js'))
    .pipe(gulp.dest(scriptsTarget))
    .pipe(rename('vendors.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(scriptsTarget));
});

gulp.task('images', function() {
  return gulp.src(`${imagesSource}/**/*.*`)
    .pipe(gulp.dest(imagesTarget));
});

gulp.task('fonts', function() {
  return gulp.src(`${fontsSource}/**/*.*`)
    .pipe(gulp.dest(fontsTarget));
});

// build all static source files
gulp.task('build-assets', [
  'styles',
  'pages',
  'images',
  'fonts',
  'scripts-vendors'
])

// build statics and javascripts
gulp.task('build', [
  'build-assets',
  'scripts-bundle'
]);

// dev default task(s)
gulp.task('dev', [
  'build-assets',
  'watch',
  'serve-dev'
]);

// define default task(s)
gulp.task('run', ['dev']);

gulp.task('default', ['dev']);
