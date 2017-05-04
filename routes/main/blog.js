var fs = require('fs')
var datastore = require('@google-cloud/datastore')({ // initialize GCP Datastore
  projectId: "bclindner-servers-166603",
  keyFilename: "gcloudkey.json"
})
var postKind = "bclindnerPost"
module.exports = function(app){
  // blog home page
  app.get('/blog',(req,res)=>{
    // get 3 most recent posts
    var recentPostQuery = datastore.createQuery(postKind)
      .order('datePosted')
      .limit(5)
    datastore.runQuery(recentPostQuery)
      .then((posts) => {
	posts = posts[0] // come on, Google... seriously?
	res.render('blog/index.pug',{posts: posts})
      })
      .catch((err) =>{
	console.log("err: "+err)
	res.sendStatus(500)
      })
  })
  //blog post getter
  app.get('/blog/:slug', (req,res) => {
    var getPostQuery = datastore.createQuery(postKind)
      .filter('slug','=',req.params.slug)
      .limit(1)
    datastore.runQuery(getPostQuery)
      .then((post) => {
        post = post[0][0] // GOOGLE. COME ON. STOP.
        console.log(post)
        res.render("blog/posts/"+post.slug,{post: post})
      })
  })
}
