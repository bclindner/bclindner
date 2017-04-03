var fs = require('fs')
var posts = require('../../data/db.json').posts //static DB import
var markdown = require('markdown').markdown
module.exports = function(app){
  // blog home page
  app.get('/blog',(req,res)=>{
    res.render('blog/index.pug',{posts: posts})
  })
  //blog post getter
  app.get('/blog/post/:id', (req,res) => {
    var post = posts[req.params.id] //get the post - we still have some processing to do
    post.date = new Date(post.date*1000) //convert the date from UNIX time
    fs.readFile("views/blog/posts/"+post.slug+".md", "utf-8",(err, data) =>{
      if(err){throw err} //because what's the point of getting a post if the post doesn't have any content
      post.content = markdown.toHTML(data)
      res.render('blog/viewpost.pug',post)
    })
  })
}
