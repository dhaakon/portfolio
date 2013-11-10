(function() {
  var Blog, Database, express, http, moment, path, poet, routes, user;

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

  moment = require('moment');

  Blog = (function() {

    Blog.prototype.app = null;

    Blog.prototype.database = null;

    Blog.prototype.poet = null;

    Blog.prototype.port = null;

    Blog.prototype.maxPosts = 0;

    function Blog() {
      this.port = process.env.PORT || 3000;
      this.app = express();
      this.startPoet();
    }

    Blog.prototype.startPoet = function() {
      var _this = this;
      this.options = {
        routes: {
          '/posts/:post': 'post'
        }
      };
      this.poet = require('poet')(this.app, this.options);
      return this.poet.watch().init().then(function() {
        _this.indexPosts();
        return _this.setupExpress();
      });
    };

    Blog.prototype.indexPosts = function() {
      var post, thisPost, tmpPosts, _i, _ref,
        _this = this;
      tmpPosts = [];
      for (post in this.poet.posts) {
        thisPost = this.poet.posts[post];
        thisPost.chron = moment(thisPost.date).format('l').split('/')[0] + moment(thisPost.date).format('l').split('/')[1];
        tmpPosts.push(thisPost);
      }
      tmpPosts.sort(function(a, b) {
        return a.chron - b.chron;
      });
      for (post = _i = 1, _ref = tmpPosts.length; 1 <= _ref ? _i <= _ref : _i >= _ref; post = 1 <= _ref ? ++_i : --_i) {
        tmpPosts[post - 1].index = post;
      }
      return this.maxPosts = tmpPosts.length;
    };

    Blog.prototype.getPostByIndex = function(index) {
      var post, thisPost;
      for (post in this.poet.posts) {
        thisPost = this.poet.posts[post];
        if (thisPost.index === index) {
          return thisPost;
        }
      }
      throw new Error('Index out of Bounds');
    };

    Blog.prototype.addPostRoute = function() {
      var cb,
        _this = this;
      cb = function(req, res) {
        var nextPost, options, post, prevPost;
        post = _this.poet.helpers.getPost(req.params.post);
        if (post.index < _this.maxPosts) {
          nextPost = _this.getPostByIndex(post.index + 1).url;
        }
        if (post.index > 1) {
          prevPost = _this.getPostByIndex(post.index - 1).url;
        }
        options = {
          post: post,
          nextPost: nextPost,
          prevPost: prevPost
        };
        console.log(options.nextPost);
        if (post != null) {
          return res.render('post', options);
        } else {
          return res.send(404);
        }
      };
      return this.poet.addRoute('/posts/:post', cb);
    };

    Blog.prototype.addCustomRoutes = function() {
      return this.addPostRoute();
    };

    Blog.prototype.setupExpress = function() {
      var cb,
        _this = this;
      this.app.set('view engine', 'jade');
      this.app.set('view options', {
        layout: false
      });
      this.app.set({
        title: 'dhaakon'
      });
      this.app.set('views', __dirname + '/views');
      this.app.use(express["static"](__dirname + '/public'));
      this.addCustomRoutes();
      cb = function(req, res) {
        return res.render('index', {
          title: 'dhaakon'
        });
      };
      this.app.get('/', cb);
      return this.app.listen(this.port);
    };

    return Blog;

  })();

  new Blog();

}).call(this);
