// const gulp = require('gulp');
// const glob = require('glob');
// const fs = require('fs');
// // gulp.task('html', function () {
// //     return gulp.src('client/templates/*.pug')
// //         .pipe(pug())
// //         .pipe(gulp.dest('build/html'))
// // });

// const outFile = "./manifest.json";

// // 获得文件列表
// gulp.task('getfiles', function () {
//     glob("bin/js/**/*.js", null, function (er, files) {
//         console.log(files);
//         str = "[";
//         for (let i = 0; i < files.length; i++) {
//             if (i < files.length - 1) {
//                 str += "\"" + files[i] + "\",\n";
//             } else {
//                 str += "\"" + files[i] + "\"\n ";
//             }
//         }
//         str += "]"
//         fs.writeFile(outFile, str, () => { console.log("write success"); });

//         decode(files);
//     })

//     return null;
// });


// gulp.task(`createfile`, function (data) {
//     // 输出文件
//     fs.writeFile(outFile, data, () => { console.log("write success"); });
// })

// let count = 0;
// const decode = function (files) {

//     const reg = /[A-Za-z0-9._\-\u4e00-\u9fa5]+.ts/g;
//     for (let i = 0; i < files.length; i++) {
//         const match = files[i].match(reg);
//         if (match) {
//             count++;
//             // console.log("match:",match[0].replace(".ts",""));
//         }
//     }
//     console.log(count)
// }


// gulp.task('default', ['getfiles']);

// var gulp = require('gulp');

// var filesort = require('gulp-typescript-filesort');
// var filelist = require('gulp-filelist');
// var gulp = require("gulp");
// var shell = require('gulp-shell')
// var fs = require('fs');
// var glob = require("glob");
// var ts = require("gulp-typescript"); // 需要安装包
// var sorter = require("gulp-typescript-sort");
// var watch = require("gulp-watch");
// var path = require("path");
// var del = require("del");
// var sd = require("silly-datetime");
// var colors = require("colors");
// var through = require("through2");
// var tsProj = ts.createProject('tsconfig.json');
// var tsProjT = ts.createProject({
//         module: "amd",
//         outFile: "bin/js/game.js",
//         target: "es5",
//         //rootDir: "src",
//         //allowNonTsExtensions: true,
//         //isolatedModules: true,
//         lib:[
//             "es5",
//             "dom",
//             "es2015.promise"
//         ]
//     });
// var concat = require('gulp-concat'); // 需要安装包
// var uglify = require('gulp-uglify'); // 需要安装包
// var rename = require('gulp-rename'); // 需要安装包
// var merge = require("merge-stream");
// var sourcemaps = require('gulp-sourcemaps'); // 需要安装包

// var nodemon = require("gulp-nodemon");
// var tinyPng = require("gulp-tinypng");
// var requireDir = require("require-dir");
// require('gulp-awaitable-tasks')(gulp);

// var minimist = require('minimist');

// var knownOptions = {
//   string: 'path',
//   default: ""
// };

// var options = minimist(process.argv.slice(2), knownOptions);
// var compiling = false;

// gulp.task('ts-filelist', function () {
//     return gulp.src("src/**/*.ts")
//         .pipe(filesort())
//         .pipe(filelist('filelist.json'))
//         .pipe(gulp.dest("tmp/"));
// });



// function compileTSFile() {
//     if (compiling == true) return;
//     var startTime = sd.format(new Date(), 'HH:mm:ss').yellow;
//     console.log(`[${startTime}] TS File Start Compile`);
//     compiling = true;

//     var linkUrls = "";
//     gulp.src([
//         "libs/*.ts",
//         "src/**/*.ts"
//     ])
//         .pipe(sorter(true))
//         .pipe(tsProj())
//         .pipe(gulp.dest("release"))
//         .on('end', function (... args) {
//             compiling = false;
//             console.log(`[${args}] TS File End Compile`);
//             console.log(`[${startTime}] TS File End Compile`);
//         });;
// }

// gulp.task('tsc', function (args, args2) {
//     compileTSFile();
// });


var gulp = require("gulp");
var ts = require("gulp-typescript");
var filesort = require('gulp-typescript-filesort');
var filelist = require('gulp-filelist');
var gulp = require("gulp");
var shell = require('gulp-shell')
var fs = require('fs');
var glob = require("glob");
var sd = require("silly-datetime");
var tsProject = ts.createProject("tsconfig.json");
var sorter = require("gulp-typescript-sort");
var tsProj = ts.createProject('tsconfig.json');
var minimist = require('minimist');
var tsify = require("tsify");

// var bundle = require('bundle');
var options = minimist(process.argv.slice(2), knownOptions);
var knownOptions = {
    string: 'path',
    default: ""
};



gulp.task("test", function () {

    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('sort', function () {
    // return gulp.src("src/**/*.ts")
    //     .pipe(filesort())
    // .pipe(tsProject())
    // .js.pipe(gulp.dest("dist"))
    // .pipe(filelist('filelist.json'))
    // .pipe(gulp.dest("tmp/"));
    var result = gulp.src(["libs/*.ts", "src/**/*.ts"])
        .pipe(filesort())
        .pipe(tsProject())
        .js.pipe(gulp.dest("bin/js"))
        .pipe(filelist('filelist.json'))
        .pipe(gulp.dest("tmp/"));
    return result;
});



var compiling = false;
function compileTSFile() {
    if (compiling == true) return;
    var startTime = sd.format(new Date(), 'HH:mm:ss').yellow;
    console.log(`[${startTime}] TS File Start Compile`);
    compiling = true;

    var linkUrls = "";
    gulp.src([
        "libs/*.ts",
        "src/**/*.ts"
    ])
        .pipe(sorter(true))
        .pipe(tsProj())
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("temp"))
        .on('end', function () {
            compiling = false;
            console.log(`[${startTime}] TS File End Compile`);
        });;
}

function compileTSFile2() {
    if (compiling == true) return;
    var startTime = sd.format(new Date(), 'HH:mm:ss').yellow;
    console.log(`[${startTime}] TS File Start Compile`);
    compiling = true;

    var linkUrls = "";
   return gulp.src([
        "libs/*.ts",
        "src/**/*.ts"
    ])
        .pipe(sorter(true))
        .pipe(tsProj())
        .pipe(filelist('filelist.json'))
        .pipe(gulp.dest("bin/tmp/"));
    // .pipe(tsProj())
    // .bundle()
    //   browserify({
    //     basedir: '.',
    //     debug: true,
    //     entries: ['src/main.ts'],
    //     cache: {},
    //     packageCache: {}
    // })
    // .plugin(tsify)
    // .bundle()
    // .pipe(source('bundle.js'))
    // .pipe(gulp.dest("dist"));
}


gulp.task('tsc', function (args, args2) {
    // compileTSFile();
   return compileTSFile2();
});

