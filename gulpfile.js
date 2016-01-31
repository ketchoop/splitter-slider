'use strict';

var gulp = require('gulp'),
  babel = require('gulp-babel'),
  sass = require('gulp-sass'),
  mincss = require('gulp-minify-css'),
  autopref = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  shim = require('browserify-shim'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
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
  gulp.src(paths.css.from)
    .pipe(sass({
        includePath: './development/css/'
      })
      .on("error", sass.logError))
    .pipe(autopref())
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
  var jsDocConf = require('./jsdoc_conf.json');
  
  return gulp.src(`${paths.js.folder}*`, {read: false})
    .pipe(jsdoc());
});

gulp.task('js', ['lint', 'jscpd', 'jscs'], function () {
  return browserifyBundle()
    .pipe(gulp.dest(paths.js.to));
});

gulp.task('build', ['lint', 'jscpd', 'jscs', 'js', 'css', 'jsdoc']);

gulp.task('default', ['js', 'css']);

gulp.task('watch', function () {
  gulp.watch([`${paths.js.folder}*`, `${paths.css.folder}*`], ['js', 'css']);
});

function browserifyBundle() {
  var browerifyBundle = browserify(paths.js.from, {
    debug: true
  }).transform(babelify, {
    presets: ['es2015'],
    plugins: ["transform-object-assign"]
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