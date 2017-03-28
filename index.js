var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
var app = express()
app.set('view engine', 'pug')
app.use('/static',express.static('static'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(compression())
app.use(helmet())

//validator widget
require('./routes/widgets/validate.js')(app,require('csslint').CSSLint)
//plagiarism checker widget
require('./routes/widgets/pcheck.js')(app)
//index page
app.get('/', (req, res) => {
  res.render('index')
})

//nextsite page
app.get('/next/', (req, res) => {
	res.render('./next/index.pug')
})

app.listen(80, () =>{
  console.log('listening on port 80')
})
