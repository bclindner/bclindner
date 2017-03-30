var express = require('express') // web server framework
var bodyParser = require('body-parser') // for POST parsing
var compression = require('compression') // for performance
var helmet = require('helmet') // for security
var sassMiddleware = require('node-sass-middleware') // for CSS ease-of-use
var app = express() // javascript is weird
var port = ((process.env.NODE_ENV == "production") ? 80 : 8000) // set port based on production or development

// express setup
app.set('view engine', 'pug') // set pug to our view engine
app.use(bodyParser.urlencoded({extended: false})) // initialize our body parser stuff so it can be used
app.use(compression()) // self-explanatory
app.use(helmet()) // do some stuff for security purposes to not get completely wrecked by Shodan immediately
app.use(sassMiddleware({
  src: __dirname + '/', // take uncompiled SASS/SCSS files from /sass
  dest: __dirname + '/static', // and compile them into /static/css on first run
  outputStyle: 'compressed',
  debug: true,
  indentedSyntax: true, //why do we have to do this?! i get SCSS is the de facto standard, but isn't SASS de jure??
  prefix: '/static'
}))
app.use('/static',express.static('static')) // use static files located at /static in the project


//validator widget
require('./routes/widgets/validate.js')(app,require('csslint').CSSLint)
//plagiarism checker widget
require('./routes/widgets/pcheck.js')(app)
//main site static routes
require('./routes/main/static.js')(app)
//blog functionality
require('./routes/main/blog.js')(app)
//server listen
app.listen(port, () =>{
  console.log('listening on port '+port)
})
