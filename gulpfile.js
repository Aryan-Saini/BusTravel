const gulp = require('gulp');
const cleanCss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync').create();

function sync() {
  browserSync.init({
    browser: "Brave",
    server: {
      baseDir: "./dist"
    }
  })
}

function minifyJs() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
}

function minifyCss() {
  return gulp.src('src/*.css')
    .pipe(cleanCss())
    .pipe(gulp.dest('dist'));
}


function copyHtml() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
}

function watch() {
  gulp.watch("src/*.css", minifyCss).on("change", browserSync.reload);
  gulp.watch("src/*.js", minifyJs).on("change", browserSync.reload);
  gulp.watch("src/index.html", copyHtml).on("change", browserSync.reload);
}

exports.default = gulp.series(gulp.parallel(copyHtml, minifyCss, minifyJs), gulp.parallel(sync, watch));