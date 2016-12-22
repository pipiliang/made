var gulp = require('gulp');
var path = require('path');
var packager = require('electron-packager');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var jshint = require('gulp-jshint');

gulp.task('test', function () {
  return gulp.src('test/*.js')
    .pipe(jasmine({
      reporter: new reporters.JUnitXmlReporter({
        savePath: __dirname + '/out',
        consolidateAll: false,
        filePrefix: 'junit-'
      })
    }))
});

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
    name: 'made',
    dir: path.join(__dirname, '.'),
    arch: 'x64',
    platform: 'linux',
    version: '1.4.12',
    overwrite: true,
    out: path.join(__dirname, './dist'),
    asar: true,
    ignore: ['node_modules', '.git'],
  };

  return packager(opts, (err, appPath) => {
    if (err) {
      console.log(err);
    }
  })
});