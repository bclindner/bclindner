module.exports = function(app,linter){
//validation widget
app.route('/validate')
  .get( (req,res) => {
    res.render('widgets/validate')
  })
  .post( (req, res) => {
    if (req.body == {}) return res.sendStatus(400)
    else {
      var result = linter.verify(req.body.css)
      res.json(result)
    }
  })
//legacy validate url redirection
app.get('/validate.html', (req, res) =>{
  res.redirect('/validate')
})
//validation about page
app.get('/validate/about', (req, res) => {
  res.render('widgets/validate-about')
})

}
