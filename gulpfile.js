'use strict';


const gulp = require('gulp');
const watch = require('gulp-watch');
const prefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rigger = require('gulp-rigger');
const cssmin = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const browserSync = require("browser-sync");


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: './build',
        js: './build/js',
        css: './build/css',
        img: './build/img',
        fonts: './build/fonts'
    },
    src: { // Пути откуда брать исходники
        template: './source/template/index.pug',
        js: './source/js/main.js',
        style: './source/style/main.sass',
        img: './source/img/**/*.*', 
        fonts: './source/fonts/**/*.*'
    },
    watch: { // Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        template: './source/template/**/*.pug',
        js: './source/js/**/*.js',
        style: './source/style/**/*.sass',
        img: './source/img/**/*.*',
        fonts: './source/fonts/**/*.*'
    },
    clean: './build'
};


/* ------------ HTML build ------------- */
gulp.task('html:build', function buildHTML() {
	return gulp.src(path.src.template)
        .pipe(pug())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
});


/* ------------ js build ------------- */
gulp.task('js:build', function () {
    return gulp.src(path.src.js) // Найдем наш main файл
        .pipe(rigger()) // Прогоним через rigger
        .pipe(sourcemaps.init()) // Инициализируем sourcemap
        .pipe(uglify()) // Сожмем наш js
        .pipe(sourcemaps.write()) // Пропишем карты
        .pipe(gulp.dest(path.build.js)) // Выплюнем готовый файл в build
        .pipe(browserSync.reload({stream: true})); // И перезагрузим сервер
});


/* ------------ Style build ------------- */
gulp.task('style:build', function () {
    return gulp.src(path.src.style) // Выберем наш main.scss
        .pipe(sourcemaps.init()) // То же самое что и с js
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Скомпилируем
        .pipe(sourcemaps.write())
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(cssmin()) // Сожмем
        .pipe(gulp.dest(path.build.css)) // И в build
        .pipe(browserSync.reload({stream: true}));
});


/* ------------ Image build ------------- */
gulp.task('image:build', function () {
    return gulp.src(path.src.img) // Выберем наши картинки
        .pipe(imagemin({ // Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) // И бросим в build
        .pipe(browserSync.reload({stream: true}));
});


/* ------------ Fonts build ------------- */
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});


gulp.task('browser-sync', function(){
    browserSync.init({
        server: "./build",
        port: 8080
    });
    browserSync({server: true}, function(err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });
});


gulp.task('watch', function(){
    gulp.watch(path.watch.style, gulp.series('style:build'));
    gulp.watch(path.watch.template, gulp.series('html:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('default', gulp.series('clean', 
        gulp.parallel('style:build', 'html:build', 'js:build', 'image:build', 'fonts:build'),
        gulp.parallel('watch', 'browser-sync')
    )
);