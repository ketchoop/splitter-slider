'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  jshint = require('gulp-jshint'),
  jscpd = require('gulp-jscpd'),
  jscs = require('gulp-jscs'),
  jsdoc = require('gulp-jsdoc3'),
  //config
  paths = {
    css: {
      folder: './app/assets/css/',
      mainfile: 'main.*',
      from: './app/assets/css/main.*',
      to: './dist/'
    },
    js: {
      folder: './app/assets/js/',
      mainfile: 'Splitter.js',
      from: './app/assets/js/Splitter.js',
      to: './dist/'
    }
  };

gulp.task('css', function () {
  return gulp.src(paths.css.from)
    .pipe(gulp.dest(paths.css.to));
});

gulp.task('lint', function () {
  return gulp.src(`${paths.js.folder}*`)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscpd', function () {
  return gulp.src(`${paths.js.folder}*.js`)
    .pipe(jscpd());
});

gulp.task('jscs', function () {
  return gulp.src(`${paths.js.folder}*.js`)
    .pipe(jscs({
      "errorCount": 20
    }))
    .pipe(jscs.reporter());
});

gulp.task('jsdoc', function () {
  var jsDocConf = require('./jsdocConf.json');
  
  return gulp.src(`${paths.js.folder}*`, {read: false})
    .pipe(jsdoc());
});

gulp.task('before-test', function () {
  return gulp.src(`${paths.js.folder}*`)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['before-test'],function () {
  return gulp.src('./test/*')
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 60 }}));
});

gulp.task('js', ['lint', 'jscpd', 'jscs'], function () {
  return browserifyBundle()
    .pipe(gulp.dest(paths.js.to));
});

gulp.task('build', ['lint', 'jscpd', 'jscs', 'test', 'js', 'css', 'jsdoc']);

gulp.task('default', ['js', 'css']);

gulp.task('watch', function () {
  gulp.watch([`${paths.js.folder}*`, `${paths.css.folder}*`], ['js', 'css']);
});

function browserifyBundle() {
  var browerifyBundle = browserify(paths.js.from, {
    debug: true
  }).transform(babelify, {
    presets: ['es2015']
  });

  return browerifyBundle.bundle().on('error', logger)
    .pipe(source(paths.js.mainfile));
}

function logger(err) {

  //Inspired by Vsevolod Rodionov(http://habrahabr.ru/users/Jabher/)
  console.log(
        [
            '',
            '=====================ERROR====================',
            '' + err.name + ' in ' + err.plugin + '',
            err.message,
            '==============================================',
            ''

        ].join('\n')
  );
  this.emit('end');
}