var fs = require('fs')
var posts = require('../data/db.json').posts //static DB import
module.exports.getPost = function(id){
  var post = posts[id] //get the post - we still have some processing to do
  post.date = new Date(post.date) //convert the date from UNIX time
  fs.readFile("views/blog/posts/"+post.slug+".md", "utf-8",(err, data) =>{
    if(err){throw err} //because what's the point of getting a post if the post doesn't have any content
    post.content = data
    return post
  })
}
