# => SRC FOLDER
toast 'src',

  # EXCLUDED FOLDERS (optional)
   #exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

  # => VENDORS (optional)
  vendors: [
    # Dat GUI for prototyping
    'vendors/dat.gui.min.js',

    # Physics
    'vendors/physics.min.js',

    # Processing like prototyping
    'vendors/sketch.js'

    # Cross-browser CSS3 transitions
    'vendors/CSSMatrix.js'

    # Simple Tween
    'vendors/Tween.js'

    # Simple Timeline
    'vendors/Timeline.js'

    # Simple Tween object
    'vendors/TweenObject.js'
    
    # SVG
    'vendors/svg.min.js'

    # Event Management
    'vendors/EventEmitter-4.0.3.min.js'
  ]

  # => OPTIONS (optional, default values listed)
  bare: true
  packaging: false
  # expose: ''
  minify:true 

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: 'js'
  release: 'www/js/dhaakon-portfolio.js'
  debug: 'www/js/dhaakon-portfolio-debug.js'
