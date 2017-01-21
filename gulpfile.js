/*jslint node: true */
'use strict';
let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync').create();
let jasmineBrowser = require('gulp-jasmine-browser');
let watch = require('gulp-watch');
const babel = require('gulp-babel');
const concat = require('gulp-concat');


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


//fsdfsdfsd

// gulp.task('jsTranspile', () => {
//     return gulp.src(['angular.min.js', 'src/app.js'])
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(concat('app.js'))
//         .pipe(gulp.dest('dist'));
// });


gulp.task('build', ['sass']);
gulp.task('default', ['browserSync']);

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
  let filesForTest = ['./jasmine/spec/less/**/*'];
    gulp.src(filesForTest)
    .pipe(watch(filesForTest))
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless());

});