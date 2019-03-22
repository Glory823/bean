const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webserver = require("gulp-webserver");


//开发  启动服务
gulp.task("webserver", () => {
    return gulp.src("./src/")
        .pipe(webserver({
            port: 2020,
            livereload: true
        }))
})



//开发   编译scss  且压缩css
gulp.task("scss", () => {
    return gulp.src("./src/css/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest("./src/css/"))
})


//开发  压缩js 
gulp.task("js", () => {
    return gulp.src("./src/js/index.js")
        .pipe(babel({
            presets: "es2015"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./src/js/js"))
})


//css文件监听，自动执行对应的任务
gulp.task("watch", () => {
    gulp.watch("./src/css/scss/*.scss", gulp.series("scss"));
})

//默认执行webserver服务，js，css，watch任务
gulp.task("default", gulp.series("webserver", "watch"));



// 打包  html
gulp.task("devHtml", () => {
    return gulp.src("./src/index.html")
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./dist"))
})


//打包css
gulp.task("devCss", () => {
    return gulp.src("./src/css/style.css")
        .pipe(gulp.dest("./dist/css"))
})


//打包js
gulp.task("devJs", () => {
    return gulp.src("./src/js/*.js")
        .pipe(gulp.dest("./dist/js"))
})


//打包  图片
gulp.task("devImg", () => {
    return gulp.src("./src/img/*.jpg")
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/img/"))
})

//指向js,css任务，并把文件生成到dist文件夹
gulp.task("build", gulp.parallel("devHtml", "devCss", "devJs", "devImg"));