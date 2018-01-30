gulp = require 'gulp' 
sass = require 'gulp-sass'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
wrap = require 'gulp-wrap'
path = require 'path'
file = require 'gulp-file'
runSequence = require 'run-sequence'
os = require 'os'
## app folder name in docker image
#app_name = '../demo/app/calendar'
app_name = '../'


config = {	
	coffee: { from: '**/*.coffee', to: "#{app_name}" }
	
	xml: { from: '**/*.xml', to: "#{app_name}" } 
	sass: { from: '**/*.sass', to: "#{app_name}" }
}

watcher = (task) ->
		(evt) ->
			console.log 'run ' + evt.path
			gulp.start task
		
swallowError = (error) ->
	console.log(error.toString())
	@emit('end')

gulp.task 'compile:sass', ->	
	gulp.src(config.sass.from)
	.pipe(sass().on('error', swallowError))
	.pipe(gulp.dest(config.sass.to))


gulp.task 'compile:coffee', ->
	gulp.src(config.coffee.from)
	.pipe(coffee({bare: true, sourcemap: true})
		.on('error', swallowError))
	.pipe(gulp.dest(config.coffee.to))

gulp.task 'copy:xml', ->
	gulp.src(config.xml.from)
	.pipe(gulp.dest(config.xml.to))
	

gulp.task 'default', ->	
	gulp.start 'compile:sass', 'compile:coffee', 'copy:xml'

gulp.task 'watch:sass', ->
	gulp.watch config.sass.from, watcher 'compile:sass'

gulp.task 'watch:coffee', ->
	gulp.watch config.coffee.from, watcher 'compile:coffee'

gulp.task 'watch:xml', ->
	gulp.watch config.xml.from, watcher 'copy:xml'

gulp.task 'watch', ->
	gulp.start 'watch:sass', 'watch:coffee', 'watch:xml'		