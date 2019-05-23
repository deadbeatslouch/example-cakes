"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var sourcemaps = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mincss = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var minhtml = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("style", function() {
	return gulp.src("less/style.less")
	.pipe(sourcemaps.init())
	.pipe(plumber())
	.pipe(less())
	.pipe(postcss([ autoprefixer() ]))	
	.pipe(sourcemaps.write())
	.pipe(gulp.dest("build/css"))
	.pipe(mincss())
	.pipe(rename("style.min.css"))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest("build/css"));
});

gulp.task("images", function() {
	return gulp.src("img/**/*.{jpg,png,svg}")
	.pipe(imagemin([
		imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.jpegtran({
      progressive: true
    })
	]))
	.pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
	return gulp.src("build/img/**/*.{png,jpg,jpeg}")
	.pipe(webp({quality: 90}))
	.pipe(gulp.dest("build/img/"));
});

gulp.task("sprite", function() {
	return gulp.src("build/img/icon-social-*.svg")
	.pipe(svgmin())
	.pipe(svgstore({
		inlineSvg: true
	}))
	.pipe(rename("sprite.svg"))
	.pipe(gulp.dest("build/img/"));
});

gulp.task("html", function() {
	return gulp.src("*.html")	
	.pipe(posthtml([
		include()
	]))
	.pipe(minhtml({ collapseWhitespace: true }))
	.pipe(gulp.dest("build"));
});

gulp.task("copy", function() {
	return gulp.src([
		"fonts/**/*.woff2",
		"js/**"
	], {
		base: "."
	})
	.pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
	return del("build")
});

gulp.task("build", gulp.series(
	"clean",
	"style",
	"images",
	"webp",
	"sprite",
	"html",
	"copy"
));