'use strict';
var gulp = require('gulp');
var path = require('path');
var packager = require('electron-packager');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var Instrumenter = require('isparta').Instrumenter;
var del = require('del');
var zip = require('gulp-zip');
var minimist = require('minimist');
var pkg = require('./package.json');

var src = 'app/js/**.js';

gulp.task('clean', function (cb) {
  del(['coverage', 'dist', 'out', 'tmp'], cb);
});

gulp.task('mocha', function () {
  return gulp.src('test/**test.js')
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('coverage:instrument', function () {
  return gulp.src(src)
    .pipe(istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
})

gulp.task('coverage:report', function () {
  return gulp.src(src)
    .pipe(istanbul.writeReports())
})

gulp.task('coverage', ['coverage:instrument', 'mocha', 'coverage:report'], function () { })

gulp.task('lint', function () {
  return gulp.src('./app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
      filename: path.join(__dirname, '/out/jshint-output.html'),
      createMissingFolders: true
    }));
});

gulp.task('pack', () => {
  del(['tmp']);
  var knownOptions = {
    string: 'platform',
    default: { platform: process.env.NODE_ENV || 'linux' }
  };
  var options = minimist(process.argv.slice(2), knownOptions);
  var icon = path.join(__dirname, '/app/images/made.png');
  if(options.platform === 'win32'){
    icon = path.join(__dirname, '/app/images/made.ico');
  }
  var opts = {
    dir: path.join(__dirname, '.'),
    arch: 'x64',
    platform: options.platform,
    version: '1.4.12',
    overwrite: true,
    out: path.join(__dirname, 'tmp'),
    asar: true,
    prune: true,
    icon: icon,
    ignore: ['src', 'test', 'e2e', '.vscode', 'dist', './node_modules', 'test', './out', '.git', './coverage', 'tmp', '.gitignore', '.travis.yml', '.codeclimate.yml', 'gulpfile.js']
  };
  var zipName = pkg.name + '-' + pkg.version + '-' + options.platform + '-' + opts.arch + '.zip'
  return packager(opts, (err, path) => {
    if (err) {
      console.log(err);
    } else {
      console.log(path);
      gulp.src(path + '/**/*')
        .pipe(zip(zipName))
        .pipe(gulp.dest('dist'));
    }
  })
});