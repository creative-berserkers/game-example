//gulpfile.js
var gulp = require('gulp');
var babel = require('gulp-babel');
var jasmine = require('gulp-jasmine');

gulp.task('test-js', function(){
  return gulp.src(['node_modules/babel-core/browser-polyfill.js','game/test/**/*.js'])
    .pipe(jasmine());
});
gulp.task("watch", function(){
    gulp.watch('game/**/*.js', ['test-js'])
});
