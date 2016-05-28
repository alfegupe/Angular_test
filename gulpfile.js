var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('default', function(){
    // Styles
    gulp.task('styles', function() {
        return gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/font-awesome/css/font-awesome.min.css'
        ])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('app/dist/css'))
        .pipe(cssmin())
        .pipe(gulp.dest('app/dist/css'));
    });

    // JS
    gulp.task('vendors-js', function() {
        return gulp.src([
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-route/angular-route.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
        ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('app/dist/js'))
    });

    gulp.task('app-js', function() {
        return gulp.src([
            'app/js/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/dist/js'))
        .pipe(uglify({'mangle': false}))
        .pipe(gulp.dest('app/dist/js'));
    });

    // Move fonts folder

    gulp.task('move_fonts', function() {
        return gulp.src([
            'bower_components/bootstrap/dist/fonts/**',
            'bower_components/font-awesome/fonts/**'
        ])
        .pipe(gulp.dest('app/dist/fonts'));
    });

    gulp.task('minify-html', function() {
        var opts = {
            empty: true,
            cdata: true,
            comments: true,
            quotes: true,
            loose: true,
            conditionals: true,
            spare:true
        };

        return gulp.src('./app/views/**/*.html')
            .pipe(minifyHTML(opts))
            .pipe(gulp.dest('./app/dist/html/'));
    });

    // Inject assets

    gulp.task('inject-assets', function () {
        var target = gulp.src('./app/index.html');
        var sources = gulp.src(
            [
                './app/dist/js/vendors.js',
                './app/dist/js/app.js',
                './app/dist/css/app.css'
            ], {read: true}
        );

        return target.pipe(inject(sources, {relative: true}))
            .pipe(gulp.dest('app'));
    });

    gulp.task('clean-old-assets', function (cb) {
        return del([
            './app/dist/js/*',
            './app/dist/css/*',
            './app/dist/html/**/*'
        ], cb);
    });

    gulp.task('build', function(cb) {
        runSequence('clean-old-assets', 'vendors-js', ['app-js', 'styles', 'move_fonts', 'minify-html'], 'inject-assets', cb);
    });

    // place code for your default task here
    gulp.run('build');

});
