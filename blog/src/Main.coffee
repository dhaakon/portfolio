#<< Database
express = require 'express'
routes  = require './routes'
user    = require './routes/user'
http    = require 'http'
path    = require 'path'
poet    = require 'poet'
moment  = require 'moment'

class Blog
  app           :   null
  database      :   null
  poet          :   null
  port          :   null
  maxPosts      :   0

  constructor   :   ()->
    # Port on the server environment or 3000 for localhost
    @port = process.env.PORT or 3000

    # new Express instance to be set up after poet has relayed its
    # content
    @app = express() 

    @startPoet()

  ##
  # startPoet - Set's up the blog content by creating a poet instance
  #
  ##
        
  startPoet     :   ()->
    @options =
      routes  :
        '/posts/:post' : 'post'

    @poet = require('poet')(@app, @options)

    @poet.watch().init().then ()=>
      @indexPosts()
      @setupExpress()
  ##
  # indexPosts - Index the posts for navigation purposes
  #
  ##
    
  indexPosts      : () ->
    # Container used to sort posts
    tmpPosts = []
  
    # Iterate through the posts object and add a chron weight property
    for post of @poet.posts
      thisPost = @poet.posts[post]
      thisPost.chron = moment(thisPost.date).format('l').split('/')[0] +  moment(thisPost.date).format('l').split('/')[1]
      tmpPosts.push thisPost

    # Sort based on the date posted
    tmpPosts.sort (a,b)=> return a.chron - b.chron

    # Assign the index
    for post in [1 .. tmpPosts.length]
      tmpPosts[post - 1].index = post

    # Set the max post
    @maxPosts = tmpPosts.length

  ##
  # getPostByIndex - helper function to get a blog post by it's index.
  # @param {int} - index of the post to grab
  # @return {Object} - Returns the post based on the given index unless
  # it is out of bounds.
  ##

  getPostByIndex  : (index) ->
    for post of @poet.posts
      thisPost = @poet.posts[post]
      if thisPost.index == index
        return thisPost

    return throw new Error 'Index out of Bounds'

  ##
  # addPostRoute - This is the custom route for the posts. It passes to
  # the view a previous and next post for navigation purposes  
  ##

  addPostRoute    : ()->
    # callback to send to the view
    cb = (req, res) =>
      post = @poet.helpers.getPost req.params.post

      # If its not the last or the first post add a next or previous link
      if post.index < @maxPosts
        nextPost = @getPostByIndex(post.index + 1).url
      if post.index > 1
        prevPost = @getPostByIndex(post.index - 1).url

       options =
        post     : post
        nextPost : nextPost
        prevPost : prevPost

      console.log options.nextPost
      
      if post? then res.render 'post', options else res.send 404
    
    @poet.addRoute '/posts/:post', cb

  # See https://github.com/jsantell/poet/blob/master/examples/customRoutes.js
  addCustomRoutes : ()->
    @addPostRoute()

  ##
  # setupExpress - Sets up a simple express server
  ##

  setupExpress  :   ()->
    @app.set 'view engine', 'jade'
    @app.set 'view options', layout: false
    @app.set title: 'dhaakon'
    @app.set 'views', __dirname + '/views'
    @app.use express.static __dirname + '/public'

    @addCustomRoutes()

    cb = (req, res) => 
      res.render 'index', title: 'dhaakon'

    @app.get '/', cb
    @app.listen @port 

new Blog()

