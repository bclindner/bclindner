module.exports = function(app,linter){
//validation widget
app.route('/validate') //this uses both GET and POST so we're using .route()
  .get( (req,res) => {
    res.render('widgets/validate') //send the app to the user
  })
  .post( (req, res) => { //they sent data back; presumably for CSS validation
    if (req.body == {}) return res.sendStatus(400) //if the data's bad return 400; simple as that
    else {
      //i'm worried that taking raw CSS input from the user and processing it is a bad idea. can this be abused?
      var result = linter.verify(req.body.css) //anyways - verify it
      res.json(result) //give the user the resulting JSON object
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
