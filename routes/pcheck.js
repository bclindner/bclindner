module.exports = function(app){
//validation widget
app.get('/pcheck', (req,res) => {
    res.render('pcheck.pug')
})

}
