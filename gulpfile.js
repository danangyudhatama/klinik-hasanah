var gulp = require('gulp');
var sass = require('gulp-sass'); // require the gulp-sass plugin
let uglify = require('gulp-uglify-es').default; // minified the es6 .js files
var useref = require('gulp-useref'); //concat all the included files (.js and .css)
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano'); // minified .css files
var imagemin = require('gulp-imagemin'); // optimasi gambar
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass()) // using gulp-sass
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('watch', ['browserSync','sass'], function() {
	gulp.watch('app/scss/**/*.scss',['sass']);
	gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/css/**/*.css', browserSync.reload);
});







var browserSync = require('browser-sync').create();
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: "app"
		},
	})
})

gulp.task("optimasi", function () {
  return gulp.src('app/*.html')
    	.pipe(useref())
    	.pipe(gulpIf('*.js', uglify()))		// minifies the js file
    	.pipe(gulpIf('*.css', cssnano())) // minifies only the css file
        .pipe(gulp.dest("dist"));
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(gulp.dest('dist/img'))
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'img'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})