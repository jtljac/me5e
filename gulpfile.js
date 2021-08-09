const gulp = require('gulp');
const less = require('gulp-less');

/* ----------------------------------------- */
/*  Compile LESS
 /* ----------------------------------------- */

const ME5E_LESS = ["less/*.less"];

function compileLESS() {
    return gulp.src("less/me5e.less")
               .pipe(less())
               .pipe(gulp.dest("./"));
}

const css = gulp.series(compileLESS);

/* ----------------------------------------- */

/*  Watch Updates
 /* ----------------------------------------- */

function watchUpdates() {
    gulp.watch(ME5E_LESS, css);
}

/* ----------------------------------------- */
/*  Export Tasks
 /* ----------------------------------------- */

exports.default = gulp.series(
    gulp.parallel(css),
    watchUpdates
);
exports.css = css;
