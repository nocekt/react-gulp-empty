"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // run server
var open = require('gulp-open'); // open browser
var browserify = require('browserify'); // bundles JS
var browserifyCss = require('browserify-css'); // bundles CSS
var babelify = require("babelify"); // react JSX -> JS
var source = require('vinyl-source-stream');  // text streams
var concat = require('gulp-concat'); // concats files

var config = {
    port: 8080,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        mainjs: './src/main.js',
        css: './src/css/*',
        dist: './dist'
    }
}

gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
        .pipe(open({ uri: config.devBaseUrl + ":" + config.port + "/" }));
});


gulp.task('html',function(){
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    browserify(config.paths.mainjs)
        .transform(browserifyCss)
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('css', function(){
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.css, ['css']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('compile', ['js', 'css',  'html']);

gulp.task('default', ['open', 'compile', 'watch']);