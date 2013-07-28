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
  constructor   :   ()->
    @port = process.env.PORT or 3000
    @app = express() 

    @startPoet()
    @setupExpress()

  startPoet     :   ()->
    @poet = require('poet')(@app,   
        postsPerPage: 3,
        posts: './_posts',
        metaFormat: 'json',
        routes: {}=
          '/posts/:post': 'post',
          '/pagination/:page': 'page',
          '/mytags/:tag': 'tag',
          '/mycategories/:category': 'category'
    )
    @poet.init().then ()=> 
      console.log 'poet initialized'
      console.log @poet.posts

  setupExpress  :   ()->
    @app.set 'view engine', 'jade'
    @app.set 'views', __dirname + '/views'
    @app.use express.static __dirname + '/public'
    @app.use @app.router

    @app.get '/', (req, res)=> res.render 'index'

    @app.listen @port 

new Blog()

