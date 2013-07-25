var PhysicsDemo,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PhysicsDemo = (function() {

  PhysicsDemo.prototype.AVOID_MOUSE_STRENGTH = 25000;

  PhysicsDemo.prototype.SPEED = 2;

  PhysicsDemo.prototype.MIN_SPEED = 1.3;

  PhysicsDemo.prototype.X_OFFSET = 300;

  PhysicsDemo.prototype.Y_OFFSET = 470;

  PhysicsDemo.prototype.DESTROY_SIZE = 0.45;

  PhysicsDemo.prototype.engine = null;

  PhysicsDemo.prototype.sketch = null;

  PhysicsDemo.prototype.min_mass = 5;

  PhysicsDemo.prototype.max_mass = 25;

  PhysicsDemo.prototype.destroy = false;

  PhysicsDemo.prototype.renderer = null;

  PhysicsDemo.prototype.isDrawingParticles = true;

  PhysicsDemo.prototype.isPhysicsRunning = true;

  PhysicsDemo.prototype.counter = 0;

  PhysicsDemo.prototype.max_count = 175;

  PhysicsDemo.prototype.timeline = null;

  PhysicsDemo.prototype.currentIndex = 0;

  function PhysicsDemo(pathImages) {
    this.pathImages = pathImages;
    this.onmousemove = __bind(this.onmousemove, this);

    this.draw = __bind(this.draw, this);

    this.redistributeParticles = __bind(this.redistributeParticles, this);

    this.onresize = __bind(this.onresize, this);

    this.onTimelineComplete = __bind(this.onTimelineComplete, this);

    this.avoidMouse = new Attraction();
    this.createSketch();
    this.max_index = this.pathImages.length;
  }

  PhysicsDemo.prototype.changeImage = function(index) {
    this.currentIndex = index;
    this.X_OFFSET = this.pathImages[this.currentIndex].offset.x;
    this.Y_OFFSET = this.pathImages[this.currentIndex].offset.y;
    return this.createParticles(this.pathImages[this.currentIndex].points);
  };

  PhysicsDemo.prototype.destroySketch = function(cb) {
    var _this = this;
    this.destroy = true;
    EventManager.removeListener(Events.WINDOW_RESIZE, this.onresize);
    if (this.timeline._duration === 0) {
      this.reset();
    }
    this.timeline.eventCallback('onReverseComplete', function() {
      _this.destroy = false;
      _this.reset();
      if (cb) {
        return cb();
      }
    });
    this.timeline.timeScale(5.3);
    return this.timeline.reverse();
  };

  PhysicsDemo.prototype.reset = function() {
    this.counter = 0;
    this.sketch.stop();
    this.sketch.clear();
    this.sketch.destroy();
    return this.destroyParticles();
  };

  PhysicsDemo.prototype.destroyParticles = function() {
    return this.engine.destroy();
  };

  PhysicsDemo.prototype.setupGUI = function() {
    return this.gui.add(this, 'AVOID_MOUSE_STRENGTH', 5000, 15000);
  };

  PhysicsDemo.prototype.onTimelineComplete = function() {
    return this.isPhysicsRunning = true;
  };

  PhysicsDemo.prototype.onresize = function() {
    this.sketch.height = window.innerHeight;
    this.sketch.width = window.innerWidth;
    return this.redistributeParticles();
  };

  PhysicsDemo.prototype.redistributeParticles = function() {
    var particle, target, _i, _len, _ref, _results;
    _ref = this.engine.particles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      particle = _ref[_i];
      target = particle.behaviours[1].target;
      target.x = particle.destX + ((this.sketch.width / 2) - this.X_OFFSET);
      target.y = particle.destY + ((this.sketch.height / 2) - this.Y_OFFSET);
      _results.push(particle.moveTo(target));
    }
    return _results;
  };

  PhysicsDemo.prototype.createSketch = function() {
    var idx;
    this.sketch = Sketch.create({
      container: document.getElementById("dhaakon-sketch-container")
    });
    this.sketch.mousemove = this.onmousemove;
    this.sketch.draw = this.draw;
    this.timeline = new TimelineMax({
      align: "start",
      onComplete: this.onTimelineComplete,
      stagger: 3.5,
      ease: SlowMo.ease
    });
    this.timeline.timeScale(1.4);
    EventManager.addListener(Events.WINDOW_RESIZE, this.onresize);
    if (this.currentIndex + 1 < this.max_index) {
      idx = this.currentIndex + 1;
    } else {
      idx = 0;
    }
    return this.changeImage(idx);
  };

  PhysicsDemo.prototype.tweenIn = function() {
    var cb, particle, randX, randY, _i, _len, _onUpdate, _ref, _speed,
      _this = this;
    _ref = this.engine.particles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      particle = _ref[_i];
      cb = function(e) {
        return e.moveTo(e.pos);
      };
      _onUpdate = function(e) {
        return cb(e);
      };
      randX = Math.random() * 0;
      randY = Math.random() * 0;
      _speed = particle.mass / particle.radius / 10;
      this.timeline.insert(TweenLite.to(particle.pos, _speed, {
        x: particle.behaviours[1].target.x - randX,
        y: particle.behaviours[1].target.y - randY,
        delay: Math.random(),
        onUpdate: _onUpdate,
        onUpdateParams: [particle]
      }));
    }
    return this.timeline.play();
  };

  PhysicsDemo.prototype.createParticles = function(paths) {
    var count, particle, path, pathData, position, pull, _i, _j, _len, _len1, _ref;
    this.engine = new Physics();
    this.engine.integrator = new Verlet();
    count = 0;
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      _ref = path.pathData;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        pathData = _ref[_j];
        particle = new Particle(max(this.min_mass, random(this.max_mass)));
        position = new Vector(random(this.sketch.width), random(this.sketch.height));
        this.count++;
        particle.endRadius = random(8);
        particle.setRadius = 0;
        particle.moveTo(position);
        particle.destX = pathData.x;
        particle.destY = pathData.y;
        pull = new Attraction();
        pull.target.x = pathData.x + ((this.sketch.width / 2) - this.X_OFFSET);
        pull.target.y = pathData.y + ((this.sketch.height / 2) - this.Y_OFFSET);
        pull.strength = Math.max(5000 * Math.random(), 3000);
        particle.behaviours.push(this.avoidMouse, pull);
        this.engine.particles.push(particle);
      }
    }
    this.avoidMouse.setRadius(100);
    this.avoidMouse.strength = -this.AVOID_MOUSE_STRENGTH;
    return this.tweenIn();
  };

  PhysicsDemo.prototype.timerCallback = function() {
    var _this = this;
    return this.destroySketch((function() {
      return _this.createSketch();
    }));
  };

  PhysicsDemo.prototype.draw = function() {
    if (this.isPhysicsRunning) {
      this.engine.step();
    }
    if (this.counter < this.max_count) {
      this.counter++;
    } else {
      this.counter = 0;
      this.timerCallback();
    }
    this.avoidMouse.strength = -this.AVOID_MOUSE_STRENGTH;
    if (this.isDrawingParticles) {
      return this.drawParticles();
    }
  };

  PhysicsDemo.prototype.drawParticles = function() {
    var particle, _i, _len, _ref, _results, _type;
    _ref = this.engine.particles;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      particle = _ref[_i];
      if (this.destroy) {
        if (particle.radius > 0) {
          particle.radius -= this.DESTROY_SIZE;
        }
      } else {
        if (particle.radius < particle.endRadius) {
          particle.radius += this.DESTROY_SIZE;
        }
      }
      if (particle.radius > 0) {
        if (this.destroy) {
          _type = "stroke";
        } else {
          _type = "fill";
        }
        _results.push(this.drawCircle(particle.pos.x, particle.pos.y, particle.radius, "fill"));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  PhysicsDemo.prototype.drawCircle = function(x, y, radius, type) {
    this.sketch.beginPath();
    this.sketch.arc(x, y, radius, 0, Math.PI * 2);
    return this.sketch[type]();
  };

  PhysicsDemo.prototype.onmousemove = function() {
    this.avoidMouse.target.x = this.sketch.mouse.x;
    return this.avoidMouse.target.y = this.sketch.mouse.y;
  };

  PhysicsDemo.prototype.getSketch = function() {
    return this.sketch;
  };

  return PhysicsDemo;

})();
