const gulp = require('gulp'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  modifyCssUrls = require('gulp-modify-css-urls');

gulp.task('stylus', ()=> {
  gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('stylus-lib', ()=> {
  gulp.src([
      './src/libs/font-awesome/css/font-awesome.css',
      './src/libs/bootstrap/dist/css/bootstrap.css'
    ])
    .pipe(concat('lib.css'))
    .pipe(modifyCssUrls({
      modify: (url, filePath)=>
        url.replace(new RegExp(/(\.\.)\//, 'g'), '')
          .replace('font/', 'fonts/')
    }))
    .pipe(gulp.dest('./dist/libs/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts', ()=> {
  gulp.src('./src/css/fonts/*')
    .pipe(gulp.dest('./dist/css/fonts'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('fonts-lib', ()=> {
  gulp.src([
      './src/libs/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('./dist/libs/fonts'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', ()=> {
  gulp.src([
      './src/js/**/*.js',
      './src/js/*.js'
    ])
    .pipe(babel({
      presets: [
        ['es2015', {modules: false}]
      ],
      compact: false
    }))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task("libs", ()=>
  gulp.src([
      './src/libs/angular/angular.min.js',
      './src/libs/lodash/dist/lodash.js',
      './src/libs/socket.io-client/dist/socket.io.js'
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./dist/libs'))
);

gulp.task('jade', ()=> {
  gulp.src('./src/views/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .on('error', console.log)
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', ()=> {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('watch', ()=> {

  gulp.watch('./src/css/*.css', ['stylus', browserSync.reload]);
  gulp.watch(['./src/views/*.jade', './src/views/partials/*.jade', './src/views/partials/**/*.jade'], ['jade', browserSync.reload]);
  gulp.watch(['./src/js/**/*.js', './src/js/*.js'], ['js', browserSync.reload]);
  gulp.watch(['./src/images/**/*', './src/images/*'], ['images', browserSync.reload]);
});

gulp.task('build', ['stylus', 'jade', 'js', 'libs', 'fonts', 'stylus-lib', 'fonts-lib']);

gulp.task('start', ['browser-sync', 'build', 'watch']);

