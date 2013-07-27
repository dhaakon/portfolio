var Animations;

Animations = {
  fade: function(direction, obj, delay, duration, cb, end) {
    var tween;
    if (!end) {
      end = 1;
    }
    if (direction === 'in') {
      tween = TweenLite.to(obj, duration, {
        delay: delay,
        opacity: end,
        onComplete: cb
      });
    } else {
      tween = TweenLite.to(obj, duration, {
        delay: delay,
        opacity: 0,
        onComplete: cb
      });
    }
    return tween.play();
  },
  tween: function(prop, obj, delay, duration, dist, cb) {
    var tween;
    if (prop === 'opacity') {
      return tween = TweenLite.to(obj, duration, {
        delay: delay,
        opacity: dist,
        onComplete: cb
      });
    }
  },
  move: function(obj, delay, duration, dist, cb, z) {
    var onUpdate, opts, tween,
      _this = this;
    opts = {
      object: obj,
      x: dist.x[0],
      y: dist.y
    };
    onUpdate = function() {
      if (z) {
        return Utils.transform(opts.object, new CSSMatrix().translate(opts.x, opts.y, z).toString());
      } else {
        return Utils.transform(opts.object, new CSSMatrix().translate(opts.x, opts.y).toString());
      }
    };
    return tween = TweenLite.to(opts, duration, {
      delay: delay,
      x: dist.x[1],
      onUpdate: onUpdate,
      onComplete: cb
    });
  }
};
