var gulp = require("gulp");
var preprocess = require('gulp-preprocess');
var spritesmith = require('gulp.spritesmith');
var connect = require('gulp-connect');
var less = require("gulp-less");

// WebServer
gulp.task('webserver', function () {
    connect.server({
        livereload: true
    });
});

gulp.task('reload', function () {
    gulp.src('home.html ')
        .pipe(connect.reload());
});

gulp.task('reload2', function () {
    gulp.src('style/*.css')
        .pipe(connect.reload());
});

gulp.task('watchMe', function () {
    gulp.watch('home.html', ['reload']);
	gulp.watch('style/*.css', ['reload2']);
});

gulp.task('default', ['webserver', "watchMe"]);


gulp.task('less', function() {
  gulp.src('style/style.less')
    .pipe(less())
    .pipe(gulp.dest('style'))
    .pipe(connect.reload());
});

// PNG Sprite Generator
gulp.task('sprite', function () {
    var mySprite = gulp
        .src('./images/all/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            cssFormat: "css", // less, sass
            cssVarMap: function (sprite) {
                // sprite. --> name, image(pfad), x, y, width, height, total_width, total_height
                sprite.name = 'sprite-' + sprite.name.replace(/\s/g, "");
                sprite.image = "../images/" + sprite.image;
            }
        }));
    mySprite.img.pipe(gulp.dest('./images'));
    mySprite.css.pipe(gulp.dest('./css'));
});

// Static HTML Builder
gulp.task('html', function () {
    gulp.src('./snips/*.html')
        .pipe(preprocess())
        .pipe(gulp.dest('./'))
});

gulp.task("watch", function () {
    gulp.watch("./snips/**/*.html", ["html"]);
});