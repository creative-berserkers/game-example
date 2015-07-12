//gulpfile.js
var gulp = require("gulp");
var babel = require("gulp-babel");
var jasmine = require('gulp-jasmine');

gulp.task("build-js", function () {
  return gulp.src('game/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});
gulp.task("test-js", function(){
  return gulp.src('dist/test/**/*.js')
    .pipe(jasmine());
});
gulp.task("watch", function(){
    gulp.watch('game/**/*.js', ['build-js'])
});
