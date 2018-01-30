var app_name, coffee, concat, config, file, gulp, os, path, runSequence, sass, swallowError, watcher, wrap;

gulp = require('gulp');

sass = require('gulp-sass');

coffee = require('gulp-coffee');

concat = require('gulp-concat');

wrap = require('gulp-wrap');

path = require('path');

file = require('gulp-file');

runSequence = require('run-sequence');

os = require('os');

app_name = '../';

config = {
  coffee: {
    from: '**/*.coffee',
    to: "" + app_name
  },
  xml: {
    from: '**/*.xml',
    to: "" + app_name
  },
  sass: {
    from: '**/*.sass',
    to: "" + app_name
  }
};

watcher = function(task) {
  return function(evt) {
    console.log('run ' + evt.path);
    return gulp.start(task);
  };
};

swallowError = function(error) {
  console.log(error.toString());
  return this.emit('end');
};

gulp.task('compile:sass', function() {
  return gulp.src(config.sass.from).pipe(sass().on('error', swallowError)).pipe(gulp.dest(config.sass.to));
});

gulp.task('compile:coffee', function() {
  return gulp.src(config.coffee.from).pipe(coffee({
    bare: true,
    sourcemap: true
  }).on('error', swallowError)).pipe(gulp.dest(config.coffee.to));
});

gulp.task('copy:xml', function() {
  return gulp.src(config.xml.from).pipe(gulp.dest(config.xml.to));
});

gulp.task('default', function() {
  return gulp.start('compile:sass', 'compile:coffee', 'copy:xml');
});

gulp.task('watch:sass', function() {
  return gulp.watch(config.sass.from, watcher('compile:sass'));
});

gulp.task('watch:coffee', function() {
  return gulp.watch(config.coffee.from, watcher('compile:coffee'));
});

gulp.task('watch:xml', function() {
  return gulp.watch(config.xml.from, watcher('copy:xml'));
});

gulp.task('watch', function() {
  return gulp.start('watch:sass', 'watch:coffee', 'watch:xml');
});
