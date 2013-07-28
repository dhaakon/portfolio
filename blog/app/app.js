(function() {
  var Blog, Database, express, http, path, poet, routes, user;

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

    Blog.prototype.database = null;

    Blog.prototype.poet = null;

    Blog.prototype.port = null;

    function Blog() {
      this.port = process.env.PORT || 3000;
      this.app = express();
      console.log(this.app);
      this.startPoet();
    }

    Blog.prototype.startPoet = function() {
      var _this = this;
      this.poet = require('poet')(this.app, {
        postsPerPage: 3,
        posts: './_posts',
        metaFormat: 'json',
        routes: {
          '/posts/:post': 'post',
          '/pagination/:page': 'page',
          '/mytags/:tag': 'tag',
          '/mycategories/:category': 'category'
        }
      });
      return this.poet.init().then(function() {
        return _this.setupExpress();
      });
    };

    Blog.prototype.setupExpress = function() {
      var cb,
        _this = this;
      this.app.set('view engine', 'jade');
      this.app.set('views', __dirname + '/views');
      this.app.use(express["static"](__dirname + '/public'));
      this.app.use(this.app.router);
      cb = function(req, res) {
        console.log(res);
        return res.render('index');
      };
      this.app.get('/', cb);
      return this.app.listen(this.port);
    };

    return Blog;

  })();

  new Blog();

}).call(this);
