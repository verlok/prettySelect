var gulp = require("gulp");
var eslint = require("gulp-eslint");
var rollup = require("gulp-rollup");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");

var destFolder = "./dist";

gulp.task("lint", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			// ----------- linting --------------
			pipe(eslint()).
			pipe(eslint.format()).
			pipe(eslint.failAfterError()) // --> failing if errors
	);
});

gulp.task("dist-es", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "PrettySelect", format: "es" },
					input: "./src/prettySelect.js"
				})
			).
			pipe(rename("prettySelect.es2015.js")).
			pipe(gulp.dest(destFolder)) // --> writing rolledup
	);
});

gulp.task("dist-amd", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			pipe(sourcemaps.init()).
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "PrettySelect", format: "amd" },
					input: "./src/prettySelect.js"
				})
			).
			// ----------- babelizing --------------
			pipe(babel()).
			pipe(rename("prettySelect.amd.js")).
			pipe(gulp.dest(destFolder)). // --> writing babelized ES5
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("prettySelect.amd.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified
	);
});

gulp.task("dist-umd", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			pipe(sourcemaps.init()).
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "PrettySelect", format: "umd" },
					input: "./src/prettySelect.js"
				})
			).
			// ----------- babelizing --------------
			pipe(babel()).
			pipe(rename("prettySelect.js")).
			pipe(gulp.dest(destFolder)). // --> writing babelized ES5
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("prettySelect.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified
	);
});

gulp.task("dist-iife", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			pipe(sourcemaps.init()).
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "PrettySelect", format: "iife" },
					input: "./src/prettySelect.js"
				})
			).
			// ----------- babelizing --------------
			pipe(babel()).
			pipe(rename("prettySelect.iife.js")).
			pipe(gulp.dest(destFolder)). // --> writing babelized ES5
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("prettySelect.iife.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified
	);
});

gulp.task("watch", function() {
	gulp.watch("./src/**/*.js", [
		"lint",
		"dist-umd",
		"dist-es",
		"dist-amd",
		"dist-iife"
	]);
});

gulp.task("default", ["lint", "dist-umd", "dist-es", "dist-amd", "dist-iife"]);
