Animations =
  fade : (direction, obj, delay, duration, cb, end) ->
    if !end then end = 1
    if direction is 'in' 
      #console.log delay
      tween = TweenLite.to obj, duration, {delay:delay, opacity:end, onComplete:cb }
    else
      tween = TweenLite.to obj, duration, {delay:delay, opacity:0, onComplete:cb }

    tween.play()

    return 
    opts =
      node      : obj
      delay     : delay
      duration  : duration
      curve     : if direction is 'in' then [0,1] else [1,0]
      onAnimate : (c) ->
        @node.style.opacity = c
    if cb 
      opts._callbacks =
        onComplete:[
          ()=>cb()
        ]

    tween = new Tween opts
    tween.play()

  drop : (direction, obj, delay, duration, cb) ->
    if direction is "down" then cssProperty = "top" else cssProperty = "bottom"

    dist = Utils.getCSS obj, cssProperty
    #console.log obj
    opts =
      node      : obj
      delay     : delay
      duration  : duration
      curve     : [parseInt dist.split('px')[0], 0]
      onAnimate : (c) ->
        @node.style[cssProperty] = c + "px"

    tween = new Tween opts
    tween.play()

  tween  : (prop, obj, delay, duration, dist, cb) ->
    if prop == 'opacity'
      tween = TweenLite.to obj, duration, {delay:delay, opacity:dist, onComplete:cb}

  move  : (obj, delay, duration, dist, cb, z) ->
    opts =
      object : obj
      x : dist.x[0]
      y : dist.y

    onUpdate = () =>
      if z 
        Utils.transform opts.object, new CSSMatrix().translate(opts.x, opts.y, z).toString() 
      else
        Utils.transform opts.object, new CSSMatrix().translate(opts.x, opts.y).toString()

        

    tween = TweenLite.to opts, duration, {delay:delay, x:dist.x[1], onUpdate:onUpdate, onComplete:cb}
    #@container.style.webkitTransform = new CSSMatrix().translate(@calcXOffset(@currentSlide), 0, 0).toString()

    #tween.play()

    #opts =
      #node      : obj
      #delay     : delay
      #duration  : duration
      #curve     : dist
      #easing    : Tween.Easing.Quad.easeIn
      #onAnimate : (c) ->
        #Utils.transform @node, new CSSMatrix().translate(c, 0, 0).toString()

    #if cb 
      #opts._callbacks =
        #onComplete:[
          #()=>
            #console.log 'complete'
            #cb()
        #]

    #tween = new Tween opts
    #tween.play()


