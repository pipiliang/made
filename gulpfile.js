var gulp = require('gulp');
var path = require('path');
var packager = require('electron-packager');

gulp.task('test', function() {
    // "pack": "electron-packager ./made --platform=win32 --arch=ia32 --version=1.4.12 --out=dist/ --overwrite --ignore=node_modules/electron-* --ignore=node_modules/.bin --ignore=.git --ignore=dist --prune"
	//"pack": "electron-packager . --platform=win32 --arch=all --version=1.4.12 --out=dist/"
	console.log("test project here...");
});

gulp.task('pack', () => {
  var opts = {
    name: 'made',
    dir: path.join(__dirname, '.'),
    arch: 'all',
    platform: 'win32,linux',
    version: '1.4.12',
    overwrite: true,
    out: path.join(__dirname, './dist'),
    asar: true,
    ignore: ['node_modules', '.git'],
  };

  return packager(opts, (err, appPath) => {
    if (err) {
      console.log("appPath:" + appPath);
      console.log("err:" + err);
    }
  })
});