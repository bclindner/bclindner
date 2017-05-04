var fs = require('fs')
var posts = require('../../data/db.json').posts //static DB import
var markdown = require('markdown').markdown
module.exports = function(app){
  for(i=0;i=posts.length;i++){
    post.date = new Date(post.date*1000) //convert the date from UNIX time
  }
  // blog home page
  app.get('/blog',(req,res)=>{
    res.render('blog/index.pug',{posts: posts})
  })
  //blog post getter
  app.get('/blog/post/:id', (req,res) => {
    var post = posts[req.params.id] //get the post - we still have some processing to do
  })
}
