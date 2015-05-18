var gulp = require('gulp');
//var browserSync = require('browser-sync');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
//var qunit = require( 'gulp-qunit');
var qunit = require('node-qunit-phantomjs');
var sass = require('gulp-ruby-sass');
var sass = require('gulp-sass');
//var server = lr();
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
//var uglify = require('gulp-uglify');

var jsSources     = ['./*.js', './js/**/*.js', '!./gulpfile.js', '!./node_modules/**/*', '!./vendor/**/*', '!./generated/**/*'];
var sassSources   = ['./sass/**/*.scss'];
var coffeeSources = ['./coffee/**/*.coffee'];
var testSources   = ['./tests/**/*.js'];
var reloadSources = ['./**/*.html', './**/*.css', './**/*.js', './img/**/*', '!./node_modules/**/*', '!./vendor/**/*'];


gulp.task('qunit', function() {
    gulp.src(testSources)
    .pipe(concat('./combined_tests.js'))
    .pipe(gulp.dest('./generated'));
    qunit('./tests/fixture.html', { 'verbose': false });
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    //.pipe(sourcemaps.init())
    .pipe(coffee({ bare: true}).on('error', gutil.log))
    //.pipe(sourcemaps.write())
    //.pipe(concat('./combined_cofee.js'))
    .pipe(gulp.dest('./generated'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    //.pipe(concat('combined.js'))
    //.pipe(uglify())
    //.pipe(gulp.dest('./generated'))
    .pipe(livereload());
    qunit('./tests/fixture.html', { 'verbose': false });
});

gulp.task('sass', function() {
  gulp.src(sassSources)
    .pipe(sass({style: 'expanded', lineNumbers: true}))
    .on('error', gutil.log)
    .pipe(concat('./combined_sass.css'))
    .pipe(gulp.dest('./generated'))
    .pipe(livereload());
});


//gulp.task('browser-sync', function () {
//   browserSync.init(reloadSources, {server: {baseDir: './'}});
//   //browserSync.init(reloadSources, {proxy: "localhost:8888"});
//});

gulp.task('cat_coffescript_output', function() {
  gulp.watch('generated/coffee.js', shell.task([
      'echo',
      'pygmentize -f terminal256 -O style=native -g generated/coffee.js',
      'echo'
  ]));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(testSources, ['qunit']);
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(sassSources, ['sass']);

  var server = livereload();
  gulp.watch(reloadSources, function(e) {
    console.log(e.path + ': ' + e.type); // logs added, changed, or deleted
    server.changed(e.path);
  });

});

gulp.task('default', ['sass','js','coffee','watch']);
                       //browser-sync   'cat_coffescript_output'

/*
<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
*/
