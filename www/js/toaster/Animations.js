var Animations;

Animations = {
  fade: function(direction, obj, delay, duration, cb, end) {
    var opts, tween,
      _this = this;
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
    tween.play();
    return;
    opts = {
      node: obj,
      delay: delay,
      duration: duration,
      curve: direction === 'in' ? [0, 1] : [1, 0],
      onAnimate: function(c) {
        return this.node.style.opacity = c;
      }
    };
    if (cb) {
      opts._callbacks = {
        onComplete: [
          function() {
            return cb();
          }
        ]
      };
    }
    tween = new Tween(opts);
    return tween.play();
  },
  drop: function(direction, obj, delay, duration, cb) {
    var cssProperty, dist, opts, tween;
    if (direction === "down") {
      cssProperty = "top";
    } else {
      cssProperty = "bottom";
    }
    dist = Utils.getCSS(obj, cssProperty);
    opts = {
      node: obj,
      delay: delay,
      duration: duration,
      curve: [parseInt(dist.split('px')[0], 0)],
      onAnimate: function(c) {
        return this.node.style[cssProperty] = c + "px";
      }
    };
    tween = new Tween(opts);
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
