module.exports = function(app){
  db = require('../../controllers/blog.js')
  //index page: display recent posts
app.get('/blog',(req,res)=>{
  res.render('blog/index.pug',{posts: posts})
})
app.get('/blog/post/:id', (req,res) => {
    var postId = req.params.id
    var post = require('../../data/db.json').posts[postId]
    if(post){
      //render the post markdown to HTML to be added to the template
      res.render('blog/viewpost.pug',post)
    }
    else{res.status(404).render('404.pug')}

})

}
