var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var named = require('vinyl-named');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');
var webpack_stream = require('webpack-stream');
var webpack2 = require('webpack');
var argv = require('yargs').argv;

var cssFiles = ['node_modules/bulma/css/bulma.css', 'Resources/public/css/app.css'];

var getWebpackConf = function (env) {
    var conf = {};
    conf.plugins = [];
    conf.sourceMap = "eval-source-map";
    if (env === "prod") {
        console.log('*** Using prod conf ***');
        conf.plugins = [
            new webpack2.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack2
                .optimize
                .UglifyJsPlugin({
                    compress: {
                        warnings: false,
                        screw_ie8: true,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true
                    },
                    output: {
                        comments: false
                    }
                })
        ];
        conf.sourceMap = "";
    }
    return conf;
};

var compile = function (entry, dest) {
    var conf = getWebpackConf(argv.env);
    return gulp
        .src(entry)
        .pipe(named())
        .pipe(webpack_stream({
            devtool: conf.sourceMap,
            cache: true,
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: ['babel-loader']
                    }
                ]
            },
            resolve: {
                unsafeCache: true
            },
            plugins: conf.plugins
        }, webpack2))
        .pipe(gulp.dest(dest));
};

gulp.task('build:css', [], function () {
    return gulp
        .src(cssFiles)
        .pipe(cleanCss({"relativeTo": false, "target": 'dist/public/css'}))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./dist/public/css/'));
});

gulp.task('build:js', function (callback) {
    return compile('./public/js/App.jsx', './dist/public/js/');
});

gulp.task('watch', function () {
    gulp.watch(['./public/js/components/*.js*', './public/js/App.jsx'], ['build:js']);
});

gulp.task('default', ['build:css', 'build:js']);
