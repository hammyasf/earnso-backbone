var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var jade = require('gulp-jade');
var autoprefixer = require('gulp-autoprefixer');
var gls = require('gulp-live-server');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

gulp.task('serve', function() {
	var server = gls.static('dist', 3000);
	server.start();
	gulp.watch(['dist/*.html', 'dist/js/*.js', 'dist/css/*.css'], function(file) {
		server.notify.apply(server, [file]);
	});
});

gulp.task('images', function() {
	return gulp.src('images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
		}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('scripts', function() {
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});
 
gulp.task('styles', function() {
	return sass('sass/**/*.sass', {
		style: 'compressed',
	})
		.on('error', sass.logError)
		.pipe(gulp.dest('bin/css'));
});

gulp.task('autoprefixer', function() {
	return gulp.src('bin/css/*.css')
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('jade',  function() {
	return gulp.src('templates/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('js/*.js', ['scripts']);
	gulp.watch('sass/**/*.sass', ['styles']);
	gulp.watch('bin/css/*.css', ['autoprefixer']);
	gulp.watch('templates/**/*.jade', ['jade']);
});

gulp.task('default', ['scripts', 'styles', 'autoprefixer', 'jade', 'watch']);