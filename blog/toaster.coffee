# => SRC FOLDER
toast 'src',

  # EXCLUDED FOLDERS (optional)
  exclude: ['src/site/']

  # => VENDORS (optional)
  # vendors: ['vendors/x.js', 'vendors/y.js', ... ]

  # => OPTIONS (optional, default values listed)
  bare:false 
  packaging: false 
  expose: ''
  minify: false

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: ''
  release: 'app/app.js'
  debug: 'app/app-debug.js'
