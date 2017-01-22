const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const jasmineBrowser = require('gulp-jasmine-browser');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');

gulp.task('browserSync', ['build', 'watch'], function() {
  browserSync.init({
      server:{
        baseDir: './',
        index: 'index.html'
      },
      port:3000,
      ghostMode: false
  });
});

gulp.task('build', ['sass']);
gulp.task('default', ['browserSync', 'scripts']);

gulp.task('sass', function() {
     gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function (){
  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./css/*.css', browserSync.reload);
  gulp.watch('index.html', browserSync.reload);
  gulp.watch(['./src/*.js', './jasmine/spec/*.js'], browserSync.reload);
});


gulp.task('jasmine', function(){
  const filesForTest = ['./jasmine/spec/less/**/*'];
    gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());

});

gulp.task('scripts', () => {
  gulp.src('spec/inverted-index-test.js')
    .pipe(browserify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('spec/jasmine/build'));
});