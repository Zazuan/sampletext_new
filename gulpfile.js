const gulp 			= require("gulp"),
	  less 			= require("gulp-less"),
	  pug 			= require("gulp-pug"),
	  plumber 		= require("gulp-plumber"),
	  argv 			= require("yargs").argv,
	  htmlValidator = require("gulp-w3c-html-validator"),
	  bemValidator 	= require("gulp-html-bem-validator"),
	  autoprefixer 	= require("gulp-autoprefixer"),
	  cleanCSS 		= require("gulp-clean-css"),
	  del 			= require("del"),
	  browserSync 	= require("browser-sync").create(),
	  fsync 		= require("gulp-files-sync"),
	  webpack 		= require("webpack-stream"),
	  sourcemaps 	= require("gulp-sourcemaps"),
	  gulpif 		= require("gulp-if"),
	  smartgrid 	= require("smart-grid");

let isDev = true; /* Debug - true; Release - false */
let isProd = !isDev;

let webpackconfig = {
	output: {
		filename: "app.js"
	},
	module: {
	  rules: [
	    {
	      test: /\.m?js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: "babel-loader",
	        options: {
	          presets: ["@babel/preset-env"]
	        }
	      }
	    }
	  ]
	},
	mode: isDev ? "development" : "production",
	devtool: isDev ? "eval-source-map" : "none"
};

var settings = {
    outputStyle: "less",
    columns: 12,
    offset: "66px",
    mobileFirst: false,
    container: {
        maxWidth: "1020px",
        fields: "66px"
    },
    breakPoints: {
        lg: {
            width: "11520px"
        },
        md: {
            width: "1440px"
        },
        sm: {
            width: "992px",
            fields: "15px"
        },
        xs: {
            width: "576px"
        }
    }
};
 
smartgrid("./dev/lisyan.blocks/libs", settings);

gulp.task("styles",function() {
	return gulp.src("./dev/lisyan.blocks/*.less")
		.pipe(less())
		.pipe(gulpif(isProd, cleanCSS({
			level: 2,
			compatibility: "ie8"
		})))
        .pipe(autoprefixer({
        	overrideBrowserslist: ["> 0.1%"],
            cascade: false
        }))	
		.pipe(gulp.dest("./dist/admin/assets/styles"));
})

gulp.task("img",function() {
  	return gulp.src("./dev/static/img/**/*")
    	.pipe(gulp.dest("./dist/admin/assets/img"))
    	.pipe(browserSync.stream());
})

gulp.task("scripts",function() {
	return gulp.src("./dev/lisyan.blocks/**/*.js")
		.pipe(webpack(webpackconfig))
		.pipe(gulp.dest("./dist/admin/assets/javascript"))
		.pipe(browserSync.stream());
})

gulp.task("templates",function() {
  	return gulp.src("./dev/*.pug")
  		.pipe(plumber())
  		.pipe(pug({pretty: true})) // Release - false
  		.pipe(plumber.stop())
  		.pipe(gulpif(argv.prod, htmlValidator()))
  		.pipe(bemValidator())
    	.pipe(gulp.dest("./dist"));
})

gulp.task("fonts",function() {
  	return gulp.src("./dev/static/fonts/**/*")
    	.pipe(gulp.dest("./dist/admin/assets/fonts"))
    	.pipe(browserSync.stream());
})

gulp.task("del",function() {
   	return del(["./dist/*"]);
})

gulp.task("favicon",function() {
	return gulp.src("./dev/*.ico")
		.pipe(gulp.dest("./dist/"))
		.pipe(browserSync.stream());
})

gulp.task("watch",function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        notify: false,
        tunnel: true
    });
	gulp.watch("./dev/lisyan.blocks/**/*.less", gulp.parallel("styles"));
	gulp.watch("./dev/lisyan.blocks/**/*.js", gulp.parallel("scripts"));
	gulp.watch("./dev/static/fonts/**/*", gulp.parallel("fonts"));
	gulp.watch("./dev/static/img/**/*", gulp.parallel("img"));
	gulp.watch("./dev/*.pug", gulp.parallel("templates"));
	gulp.watch("./dev/*.ico", gulp.parallel("favicon"));
	gulp.watch("./dist/").on("change", browserSync.reload);
})

gulp.task("build", gulp.series(["del"], gulp.parallel(["styles"], ["scripts"], ["img"], ["templates"], ["fonts"], ["favicon"])));
gulp.task("dev", gulp.series(["build"], ["watch"]));