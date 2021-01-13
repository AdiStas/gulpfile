const gulp = require('gulp');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const del = require("del");
const sync = require("browser-sync").create();
const terser = require('gulp-terser');
const babel = require('gulp-babel');

const pugToHtml = () => {
    return gulp.src('src/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('build'))
}

exports.pugToHtml = pugToHtml;

const styles = () => {
    return gulp.src("src/scss/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("./src/css"))
        .pipe(sync.stream())
        .pipe(csso())
        .pipe(sourcemap.write("."))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("./src/css"))
}

exports.styles = styles;

const scripts = () => {
    return gulp.src("src/js/script.js")
        .pipe(sourcemap.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(sourcemap.write())
        .pipe(rename("script.min.js"))
        .pipe(gulp.dest("build/js"))
}

exports.scripts = scripts;

const images = () => {
    return gulp.src("src/img/**/*.{jpg,png,svg}")
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.svgo()
        ]))
}
exports.images = images;

const copy = () => {
    return gulp.src([
        "src/fonts/**/*.{woff,woff2}",
        "src/img/**",
        "src/*.html"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
};

exports.copy = copy;

const clean = () => {
    return del("build");
};

exports.clean = clean;

const serve = (done) => {
    sync.init({
        server: "./",
        cors: true,
        notify: false,
        ui: false,
    });
    done();

    gulp.watch("src/sass/**/*.scss", gulp.series('styles'));
    gulp.watch("./*.html").on('change', sync.reload);
    gulp.watch("build/js/*.js").on('change', sync.reload);
}

exports.serve = serve;