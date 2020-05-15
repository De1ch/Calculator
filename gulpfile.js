const { src, dest, parallel, watch } = require('gulp');
let gulp = require("gulp"),
    stylus = require("gulp-stylus"),
    concat = require("gulp-concat"),
    cssnano = require("gulp-cssnano"),
    rename = require("gulp-rename"),
    autoprefixer = require("gulp-autoprefixer"),
    minify = require('gulp-minify');

function assets() {
    return src([
            "./assets/css/fonts.css",
            "./assets/css/reset.css",
            "./assets/vendor/formstyler/jquery.formstyler.css",
            "./assets/vendor/slick/slick.css",
            "./assets/vendor/slick/slick-theme.css",
            "./assets/vendor/simplebar/simplebar.min.css",
            'node_modules/select2/dist/css/select2.min.css',
            'assets/vendor/scroll/perfect-scrollbar.css',
        ])
        .pipe(concat("assets.css"))
        .pipe(gulp.dest("css"))
        .pipe(cssnano({
            zindex: false,
            padding: false,
            minifyFontValues: false,
            discardUnused: false,
        }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("css"))
        // .pipe(gulp.dest("C:/OSPanel/domains/gis-show.loc/templates/gis.show/css"))
}

function stylusCss() {
    return src([
            //"./css/reset.css",
            //"./css/fonts.css",
            "./assets/stylus/style.styl",
            "./assets/stylus/calculator.styl",
            "./assets/stylus/mobile.styl",
        ])
        .pipe(concat("style.styl"))
        .pipe(stylus())
        .pipe(
            autoprefixer(["last 15 versions", "> 1%", "ie 8"], {
                cascade: true
            })
        )
        .pipe(concat("style.css"))
        .pipe(gulp.dest("css"))
        .pipe(cssnano({
            zindex: false
        }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("css"))
        //.pipe(gulp.dest("C:/OSPanel/domains/gis-show.loc/templates/gis.show/css"))
}

function js() {
    return src([
            'assets/vendor/jquery.min.js',
            'assets/vendor/formstyler/jquery.formstyler.min.js',
            'assets/vendor/slick/slick.min.js',
            'assets/vendor/jquery.inputmask.bundle.min.js',
            "assets/vendor/simplebar/simplebar.min.js",
            'assets/vendor/jquery-ui-custom.min.js',
            'assets/js/calculator.js',
            'node_modules/select2/dist/js/select2.min.js',
            'assets/vendor/scroll/perfect-scrollbar.min.js',
            'assets/js/script.js',
            'assets/js/jquery-clickables.js',
        ])
        .pipe(concat('script.js'))
        .pipe(minify({
            ext:{
                min: '.min.js'
            },
        }))
        .pipe(dest('js'))
        //.pipe(dest("C:/OSPanel/domains/gis-show.loc/templates/gis.show/js"));
}

function images() {
    return src([
            /*'assets/vendor/fancybox/source/fancybox_loading.gif',
            'assets/vendor/fancybox/source/fancybox_overlay.png',
            'assets/vendor/fancybox/source/fancybox_sprite.png',
            'assets/vendor/fancybox/source/blank.gif',*/
            'assets/vendor/slick/ajax-loader.gif',
        ])
        .pipe(gulp.dest("css"))
}

assets();
images();

exports.watch = function() {
    watch("./assets/stylus/*.styl", stylusCss);
    watch("./assets/js/*.js", js);
}
