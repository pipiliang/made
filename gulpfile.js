var gulp = require('gulp');
var path = require('path');
var packager = require('electron-packager');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var Instrumenter = require('isparta').Instrumenter;
var del = require('del');

var src = 'app/js/**.js';

gulp.task('clean', function (cb) {
  del(['coverage', 'dist', 'out'], cb);
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
      filename: __dirname + '/out/jshint-output.html',
      createMissingFolders: true
    }));
});

gulp.task('pack', () => {
  var opts = {
    dir: path.join(__dirname, '.'),
    arch: 'x64',
    platform: 'linux',
    version: '1.4.12',
    overwrite: true,
    out: path.join(__dirname, './dist'),
    asar: true,
    ignore: ['./node_modules', '.git', './out', '.gitignore', '.travis.yml', './coverage'],
  };

  return packager(opts, (err, appPath) => {
    if (err) {
      console.log(err);
    }
  })
});