class Database
  mysql : require 'mysql'
  host     : process.env.RDS_HOSTNAME
  user     : process.env.RDS_USERNAME
  password : process.env.RDS_PASSWORD
  port     : process.env.RDS_PORT

  constructor : () ->
    @connect()

  connect     : () ->
    options =       
      host      :   @host
      user      :   @user
      password  :   @password
      port      :   @port

    @connection = @mysql.createConnection options

