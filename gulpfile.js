const gulp = require('gulp');
const run = require('gulp-run')
const babel = require('gulp-babel');
const exec = require('child_process').exec


gulp.task('build', () =>
  gulp.src('src/**')
  .pipe(babel({
    presets: ['env', 'flow']
  }))
  .pipe(gulp.dest('build'))
)
gulp.task('start', (cb) => {
  exec('node ./build/index.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });

})
gulp.task('watch', () => {
  gulp.watch('src/**', ['build', 'start'])
})



gulp.task('flow', (cb) => {
  exec('./node_modules/.bin/flow check --traces 50', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  })

})

gulp.task('flow-watch', () => {
  gulp.watch('src/**', ['flow'])
})
