Animations =
  fade : (direction, obj, delay, duration, cb, end) ->
    if !end then end = 1
    if direction is 'in' 
      #console.log delay
      tween = TweenLite.to obj, duration, {delay:delay, opacity:end, onComplete:cb }
    else
      tween = TweenLite.to obj, duration, {delay:delay, opacity:0, onComplete:cb }

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

