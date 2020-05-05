import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autoprefixed from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

sass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  image: {
    src: "src/img/**/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build", ".publish"]);

const img = () =>
  gulp.src(routes.image.src).pipe(image()).pipe(gulp.dest(routes.image.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixed())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

// gulp를 babel로 사용하고 있어서 babelify 사용해야함
const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
  // 용량이 큰 이미지들까지 watch 할 필요가 있는지 생각해보기
  //   gulp.watch(routes.image.src, img);
};

const devServer = () =>
  gulp.src("build").pipe(
    ws({
      livereload: true,
      open: true,
    })
  );

const githubDeploy = () => gulp.src("build/**/*").pipe(ghPages());
const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

// const devServerStart = gulp.series([devServer, watch]);
// task 병렬 수행
const devServerStart = gulp.parallel([devServer, watch]);

export const build = gulp.series([prepare, assets]);

export const dev = gulp.series([build, devServerStart]);

export const deploy = gulp.series([build, githubDeploy, clean]);
