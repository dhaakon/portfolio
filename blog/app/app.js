(function() {
  var Blog, Database, database, express, http, path, poet, routes, user;

  Database = (function() {

    Database.prototype.mysql = require('mysql');

    Database.prototype.host = process.env.RDS_HOSTNAME;

    Database.prototype.user = process.env.RDS_USERNAME;

    Database.prototype.password = process.env.RDS_PASSWORD;

    Database.prototype.port = process.env.RDS_PORT;

    function Database() {
      this.connect();
    }

    Database.prototype.connect = function() {
      var options;
      options = {
        host: this.host,
        user: this.user,
        password: this.password,
        port: this.port
      };
      return this.connection = this.mysql.createConnection(options);
    };

    return Database;

  })();

  express = require('express');

  routes = require('./routes');

  user = require('./routes/user');

  http = require('http');

  path = require('path');

  poet = require('poet');

  Blog = (function() {

    Blog.prototype.app = null;

    function Blog() {
      this.setupExpress();
    }

    Blog.prototype.setupExpress = function() {
      var _this = this;
      this.app = express();
      this.app.set('port', 3000);
      this.app.set('views', __dirname + '/views');
      this.app.set('view engine', 'jade');
      this.app.use(express.favicon());
      this.app.use(express.logger('dev'));
      this.app.use(express.bodyParser());
      this.app.use(express.methodOverride());
      this.app.use(this.app.router);
      this.app.use(express["static"](path.join(__dirname, 'public')));
      this.app.get('/', routes.index);
      this.app.get('/users', user.list);
      return http.createServer(this.app).listen(this.app.get('port'), function() {
        return console.log('Express server listening on port ' + _this.app.get('port'));
      });
    };

    return Blog;

  })();

  database = new Database();

  new Blog();

}).call(this);
