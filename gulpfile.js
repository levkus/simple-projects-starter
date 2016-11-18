var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload;

var cssProcessing = [
        autoprefixer( {browsers: ['last 2 versions']} ),
        cssnano({safe: true})
    ];

// Run Browser-Sync

gulp.task('browser-sync', function() {
    browserSync.init({
        // proxy: {
        //     target: 'localhost:8888/pivnica/dist',
        // }
        server: {
            baseDir: './dist/',
            routes: {
                '/fonts' : 'fonts'
            }
        }
    });
});

// HTML

gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(reload({stream: true}));
});

// Images

gulp.task('images', function() {
    gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(reload({stream: true}));
});

// PostCSS + Autoprefixer + cssnano

gulp.task('css', function() {
    gulp.src('src/scss/[^_]*.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'CSS Error',
                    message: err.message
                };
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss( cssProcessing ))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream: true}));
});

// JS Concat + Uglify

gulp.task('js', function() {
    gulp.src(['src/js/**/*.js'])
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'JS Error',
                    message: err.message
                };
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});

// Watch

gulp.task('watch', function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch(['src/img/**/*.jpg', 'src/img/**/*.png'], ['images']);
    gulp.watch('src/scss/**/*.scss', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('default', ['browser-sync', 'watch']);
