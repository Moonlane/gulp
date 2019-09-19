var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify-es').default,
    cleancss       = require('gulp-clean-css'),
    cache          = require('gulp-cache'),
    imagemin       = require('gulp-imagemin'), 
    jpegrecompress = require('imagemin-jpeg-recompress'), 
    pngquant       = require('imagemin-pngquant'), 
    autoprefixer   = require('gulp-autoprefixer');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }))
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js', // Optional jQuery plug-in (npm i --save-dev jquery)
		'app/js/_custom.js', // Custom scripts. Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// watcher 
gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/_custom.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));

// build
gulp.task('html:build', function(done) {
    gulp.src('app/*.html') 
        .pipe(gulp.dest('dist/')) 
    done();
});

gulp.task('scripts:build', function(done) {
    gulp.src('app/js/scripts.min.js')
        .pipe(gulp.dest('dist/js')); 
    done();
});

gulp.task('styles:build', function(done) {
    gulp.src('app/css/styles.min.css')
        .pipe(gulp.dest('dist/css')); 
    done();
});

gulp.task('fonts:build', function(done) {
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
    done();
});

gulp.task('image:build', function(done) {
    gulp.src('app/img/*') 
        .pipe(cache(imagemin([ 
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest('dist/img'));
    done();
});

gulp.task('build', gulp.series('html:build', 'styles:build', 'scripts:build', 'fonts:build', 'image:build', function(done) {
    done();
}));