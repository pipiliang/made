var gulp = require('gulp');
var path = require('path');
var packager = require('electron-packager');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('test', function () {
  gulp.src('test/made.test.js')
    .pipe(jasmine({
      reporter: new reporters.JUnitXmlReporter()
    }))
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