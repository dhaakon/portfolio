#<< Database

express = require 'express'
routes = require './routes'
user = require './routes/user'
http = require 'http'
path = require 'path'
poet = require 'poet'



class Blog
  app           :   null

  constructor   :   ()->
    @setupExpress()

  setupExpress  :   ()->
    @app = express()
    @app.set 'port', 3000
    @app.set 'views', __dirname + '/views'
    @app.set 'view engine', 'jade'
    @app.use express.favicon()
    @app.use express.logger 'dev'
    @app.use express.bodyParser()
    @app.use express.methodOverride()
    @app.use @app.router
    @app.use express.static path.join(__dirname, 'public')

    @app.get('/', routes.index)
    @app.get('/users', user.list)

    http.createServer(@app).listen @app.get('port'), ()=> console.log 'Express server listening on port ' + @app.get('port')

database = new Database()
new Blog()

