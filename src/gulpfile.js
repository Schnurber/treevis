
var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require('gulp-concat');
var minify = require('gulp-minify');

gulp.task("default", function () {
  return gulp.src([
    "p5.treevis.js",
    "Treevis.js",
	 "Treemap.js",
	 "Sunburst.js",
  	])
  .pipe(babel({
          presets: ['babel-preset-es2015']
    }))
    .pipe(concat("p5.treevis.js"))
    .pipe(gulp.dest("../addons"))
    .pipe(minify());
});


