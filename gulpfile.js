/**
 * Created by kevin on 16/11/16.
 */
var gulp = require('gulp')
var apidoc = require('gulp-apidoc')

gulp.task('apidoc', function(done) {
    apidoc({
        src: "back/routes/api/",
        dest: "dist/doc/",
        // config: "back/config/apidoc",
        debug: true
    }, done);
})