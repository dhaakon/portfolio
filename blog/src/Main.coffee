#<< Database
express = require 'express'
routes = require './routes'
user = require './routes/user'
http = require 'http'
path = require 'path'
poet = require 'poet'

class Blog
  app           :   null
  database      :   null
  poet          :   null
  port          :   null
  maxPosts      :   0
  constructor   :   ()->
    @port = process.env.PORT or 3000
    @app = express() 

    @startPoet()
        

  startPoet     :   ()->
    @options =
      routes  :
        '/posts/:post' : 'post'

    @poet = require('poet')(@app, @options)

    @poet.watch().init().then ()=>
      @indexPosts()
      @setupExpress()
  ##
  # Index the posts for navigation purposes
  #
  ##
    
  indexPosts      : () ->
    count = 0
    for post of @poet.posts
      count++
      thisPost = @poet.posts[post]
      thisPost.index = count
    
    @maxPosts = count

  ##
  # getPostByIndex - helper function to get a blog post by it's index.
  #
  ##

  getPostByIndex  : (index) ->
    for post of @poet.posts
      thisPost = @poet.posts[post]
      if thisPost.index == index
        return thisPost

    return null

  addPostRoute    : ()->
    cb = (req, res) =>
      post = @poet.helpers.getPost req.params.post

      console.log post.index

      if post.index < @maxPosts
        nextPost = @getPostByIndex(post.index + 1).url
      if post.index > 1
        prevPost = @getPostByIndex(post.index - 1).url

      console.log nextPost, prevPost

      options =
        post     : post
        nextPost : nextPost
        prevPost : prevPost
      
      if post? then res.render 'post', options else res.send 404
    @poet.addRoute '/posts/:post', cb

  # See https://github.com/jsantell/poet/blob/master/examples/customRoutes.js
  addCustomRoutes : ()->
    @addPostRoute()

  setupExpress  :   ()->
    @app.set 'view engine', 'jade'
    @app.set title: 'dhaakon'
    @app.set 'views', __dirname + '/views'
    @app.use express.static __dirname + '/public'

    @addCustomRoutes()

    cb = (req, res) => 
      res.render 'index', title: 'dhaakon'

    @app.get '/', cb
    @app.listen @port 

new Blog()

