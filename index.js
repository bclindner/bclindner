var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')
var app = express()
app.set('view engine', 'pug')
app.use('/static',express.static('static'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(compression())

//validator widget
require('./routes/widgets/validate.js')(app,require('csslint').CSSLint)
//plagiarism checker widget
require('./routes/widgets/pcheck.js')(app)
//index page
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(31415, () =>{
  console.log('listening on port 31415')
})
