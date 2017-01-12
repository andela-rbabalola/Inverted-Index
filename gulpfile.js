var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();


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
});