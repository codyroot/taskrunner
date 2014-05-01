var gulp = require("gulp");
var preprocess = require("gulp-preprocess");
var spritesmith = require("gulp.spritesmith");
var connect = require("gulp-connect");
var less = require("gulp-less");
var path = {
    css: "./style/",
    less: "./style/",
    html: {
        root: "",
        src: "./tmp/",
        dest: "./"
    },
    sprite: {
        src: "./img/all/*.png",
        dest: "./img",
        name: "sprite-",
        imgLocation: "../img/",
        cssFormat: "css"
    }
};

/* 
 ******************************************************************************* 
 * WebServer
 ******************************************************************************* 
 */
gulp.task("webserver", function () {
    connect.server({
        livereload: true,
        //root: "",
        port: 8080//,
        //host: "dev"
    });
});

/*
 ******************************************************************************* 
 * Static HTML Builder + Reload bei index.html Änderung
 ******************************************************************************* 
 */

// Builder
gulp.task("html", function () {
    gulp.src(path.html.src + "*.html")
        .pipe(preprocess())
        .pipe(gulp.dest(path.html.dest));
});

// Reload
gulp.task("reload", function () {
    gulp.src(path.html.root + "*.html").pipe(connect.reload());
});

/* 
 ******************************************************************************* 
 * LESS Compiler
 ******************************************************************************* 
 */
gulp.task("less", function() {
  gulp.src(path.less + "/style.less")
    .pipe(less({
        sourceMap: true
    }))
    .pipe(gulp.dest(path.css))
});

/* 
 ******************************************************************************* 
 * PNG Sprite Generator
 ******************************************************************************* 
 */
gulp.task("sprite", function () {
    var mySprite = gulp
        .src(path.sprite.src)
        .pipe(spritesmith({
            imgName: "sprite.png",
            cssName: "sprite.css",
            cssFormat: path.sprite.cssFormat, // less, sass
            cssVarMap: function (sprite) {
                // sprite. --> name, image(pfad), x, y, width, height, total_width, total_height
                sprite.name = path.sprite.name + sprite.name.replace(/\s/g, "");
                sprite.image = path.sprite.imgLocation + sprite.image;
            }
        }));
    mySprite.img.pipe(gulp.dest(path.sprite.dest));
    mySprite.css.pipe(gulp.dest(path.css));
});

/* 
 ******************************************************************************* 
 * Watcher
 ******************************************************************************* 
 */
gulp.task("watch", function () {
    gulp.watch("./tmp/**/*.html", ["html"]);
    gulp.watch(path.less + "*.less", ["less"]);
    gulp.watch("index.html", ["reload"]);
    gulp.watch(path.css + "*.css", ["reload"]);
});

/* 
 ******************************************************************************* 
 * Tasks
 ******************************************************************************* 
 */
gulp.task("default", ["webserver", "watch"]);

gulp.task("image", ["sprite"]);