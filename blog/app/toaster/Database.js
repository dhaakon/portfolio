(function() {
  var Database;

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

}).call(this);
