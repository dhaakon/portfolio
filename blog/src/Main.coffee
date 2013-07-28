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
    console.log @app
    @startPoet()
        

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
      @setupExpress()


  setupExpress  :   ()->
    @app.set 'view engine', 'jade'
    @app.set 'views', __dirname + '/views'
    @app.use express.static __dirname + '/public'
    @app.use @app.router

    cb = (req, res) => 
      console.log res
      res.render 'index'

    @app.get '/', cb
    @app.listen @port 

new Blog()

