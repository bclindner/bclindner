// bclindner site
module.exports = function(app){
// static index page
app.get('/', (req,res) => {
    res.render('main/index.pug')
})

}
