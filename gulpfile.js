const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const jasmineBrowser = require('gulp-jasmine-browser');
const watch = require('gulp-watch');
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');

gulp.task('browserSync', ['build', 'watch'], () => {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000,
    ghostMode: false
  });
});

gulp.task('build', ['sass']);
gulp.task('default', ['browserSync', 'scripts']);

gulp.task('sass', () => {
  gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', () => {
  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./css/*.css', browserSync.reload);
  gulp.watch('index.html', browserSync.reload);
  gulp.watch(['./src/*.js', '/spec/jasmine/*.js'], browserSync.reload);
  // spec/jasmine/*.js
});


gulp.task('jasmine', () => {
  const filesForTest = ['/spec/jasmine/less/**/*']; // 'spec/jasmine/less/**/*'
  gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless());
});

gulp.task('scripts', () => {
  gulp.src('spec/inverted-index-test.js')
    .pipe(browserify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('spec/jasmine/build'));
});

// eslint task
gulp.task('lint', () => gulp.src(['./src/**/**.js', '!node_modules/**', './spec/jasmine/inverted-index-test.js'])
    .pipe(eslint())
    .pipe(eslint.format()));
