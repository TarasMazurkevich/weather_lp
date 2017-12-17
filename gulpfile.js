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
const reload = browserSync.reload;


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { // Пути откуда брать исходники
        template: 'source/template/index.pug',
        js: 'source/js/main.js',
        style: 'source/style/main.sass',
        img: 'source/img/**/*.*', 
        fonts: 'source/fonts/**/*.*'
    },
    watch: { // Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        template: 'source/template/**/*.pug',
        js: 'source/js/**/*.js',
        style: 'source/style/**/*.sass',
        img: 'source/img/**/*.*',
        fonts: 'source/fonts/**/*.*'
    },
    clean: './build'
};


/* ------------ Server ------------- */
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};


/* ------------ HTML build ------------- */
gulp.task('html:build', function buildHTML() {
	return gulp.src(path.src.template)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.html));
});


/* ------------ js build ------------- */
gulp.task('js:build', function () {
    gulp.src(path.src.js) // Найдем наш main файл
        .pipe(rigger()) // Прогоним через rigger
        .pipe(sourcemaps.init()) // Инициализируем sourcemap
        .pipe(uglify()) // Сожмем наш js
        .pipe(sourcemaps.write()) // Пропишем карты
        .pipe(gulp.dest(path.build.js)) // Выплюнем готовый файл в build
        .pipe(reload({stream: true})); // И перезагрузим сервер
});


/* ------------ Style build ------------- */
gulp.task('style:build', function () {
    gulp.src(path.src.style) // Выберем наш main.scss
        .pipe(sourcemaps.init()) // То же самое что и с js
        .pipe(sass()) // Скомпилируем
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(cssmin()) // Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) // И в build
        .pipe(reload({stream: true}));
});


/* ------------ Image build ------------- */
gulp.task('image:build', function () {
    gulp.src(path.src.img) // Выберем наши картинки
        .pipe(imagemin({ // Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) // И бросим в build
        .pipe(reload({stream: true}));
});


/* ------------ Fonts build ------------- */
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});


/* ------------ Building ------------- */
gulp.task('build', function(){
    return [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
    ];
});


/* ------------ Watchers ------------- */
gulp.task('watch', function(){
    watch([path.watch.template], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


/* ------------ Local sserver for livereload ------------- */
gulp.task('webserver', function () {
    browserSync(config);
});


/* ------------ Clean ------------- */
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


/* ------------ Start ------------- */
// gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('default', gulp.series(
    gulp.parallel('build', 'webserver', 'watch')
));