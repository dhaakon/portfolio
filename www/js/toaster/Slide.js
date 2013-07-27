var Slide,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Slide = (function() {

  Slide.prototype.ID_PREFIX = "slide-";

  Slide.prototype.SLIDE_CLASSNAME = 'slide';

  Slide.prototype.IMAGE_WIDTH = 703;

  Slide.prototype.IMAGE_HEIGHT = 359;

  Slide.prototype.SLIDESHOW_DELAY = 140;

  Slide.prototype.SLIDE_MOVE_DURATION = 0.6;

  Slide.prototype.SLIDE_MOVE_DELAY = 0.5;

  Slide.prototype.DIM = 0.4;

  Slide.prototype.LIGHT = 1;

  Slide.prototype.container = null;

  Slide.prototype.title = null;

  Slide.prototype.button = null;

  Slide.prototype.currentImage = 0;

  Slide.prototype.images = null;

  Slide.prototype.imagesContainer = null;

  Slide.prototype.imagesSlideshow = null;

  Slide.prototype.startX = 0;

  Slide.prototype.endX = 0;

  Slide.prototype.timer = 0;

  Slide.prototype.isActive = null;

  function Slide(proj, id) {
    this.proj = proj;
    this.onVideoClose = __bind(this.onVideoClose, this);

    this.id = id;
    this.createContainer();
    this.createTitle();
    this.createButton();
    this.createImages();
    this.isActive = false;
    this.addListeners();
  }

  Slide.prototype.createContainer = function() {
    this.container = document.createElement('li');
    this.container.className = this.SLIDE_CLASSNAME;
    this.width = $(this.container).width();
    return this.container.id = this.ID_PREFIX + this.proj.name.replace(' ', '-');
  };

  Slide.prototype.createTitle = function() {
    this.title = document.createElement('h2');
    this.title.innerHTML = this.proj.name;
    return this.container.appendChild(this.title);
  };

  Slide.prototype.createButton = function() {
    var _this = this;
    if (this.proj.link === "") {
      return;
    }
    this.button = document.createElement('button');
    this.button.innerHTML = "go";
    this.container.appendChild(this.button);
    return this.button.onclick = function() {
      return _this.goToLink();
    };
  };

  Slide.prototype.goToLink = function() {
    if (this.proj.link.split('http').length > 1) {
      return window.open(this.proj.link, '_blank');
    } else {
      return this.showVideo();
    }
  };

  Slide.prototype.showVideo = function() {
    this.removeListeners();
    EventManager.addListener(Events.VIDEO_CLOSE, this.onVideoClose);
    return EventManager.emitEvent(Events.BUTTON_GO_EVENT, [this.proj]);
  };

  Slide.prototype.createImages = function() {
    var image, img, vignette, _i, _len, _ref, _width;
    vignette = new Image();
    vignette.className = "vignette";
    vignette.src = "img/vignette.png";
    this.imagesContainer = document.createElement('div');
    this.imagesContainer.id = 'image-container';
    this.imagesSlideshow = document.createElement('div');
    this.imagesSlideshow.id = 'image-slideshow';
    this.container.appendChild(this.imagesContainer);
    this.imagesContainer.appendChild(this.imagesSlideshow);
    this.imagesLength = this.proj.images.length;
    if (this.proj.images.length === 0) {
      return;
    }
    this.maxImages = this.proj.images.length;
    _width = 0;
    _ref = this.proj.images;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      image = _ref[_i];
      img = new Image();
      img.src = image;
      img.width = this.IMAGE_WIDTH;
      _width += this.IMAGE_WIDTH;
      this.imagesSlideshow.appendChild(img);
    }
    return this.imagesSlideshow.style.width = _width + this.proj.images.length + "px";
  };

  Slide.prototype.activate = function() {
    this.isActive = true;
    this.startSlideshow();
    Animations.tween('opacity', this.imagesSlideshow, 0.5, 0.5, this.LIGHT);
    Animations.tween('opacity', this.title, 0.47, 0.5, this.LIGHT);
    return Animations.tween('opacity', this.button, 0.5, 0.4, this.LIGHT);
  };

  Slide.prototype.deactivate = function() {
    this.isActive = false;
    window.cancelAnimationFrame(this.animFrame);
    this.timer = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = null;
    this.move(0);
    Animations.tween('opacity', this.imagesSlideshow, 0, 0.3, this.DIM);
    Animations.tween('opacity', this.title, 0, 0.3, this.DIM);
    return Animations.tween('opacity', this.button, 0, 0.3, this.DIM);
  };

  Slide.prototype.update = function() {
    var _this = this;
    this.cb = function() {
      return _this.update();
    };
    this.animFrame = window.requestAnimationFrame(this.cb);
    if (!this.isActive) {
      window.cancelAnimationFrame(this.animFrame);
      return;
    }
    if (this.timer <= this.SLIDESHOW_DELAY) {
      return this.timer++;
    } else {
      this.timer = 0;
      if (this.currentImage + 1 < this.maxImages) {
        return this.move(this.currentImage + 1);
      } else {
        return this.move(0);
      }
    }
  };

  Slide.prototype.startSlideshow = function() {
    var cb,
      _this = this;
    this.update();
    return;
    cb = function() {
      if (!_this.isActive) {
        clearInterval(_this.interval);
        return;
      }
      if (_this.currentImage + 1 < _this.maxImages) {
        return _this.move(_this.currentImage + 1);
      } else {
        return _this.move(0);
      }
    };
    return this.interval = setInterval((function() {
      return cb();
    }), this.SLIDESHOW_DELAY);
  };

  Slide.prototype.move = function(targetImage) {
    var factor;
    this.startX = -this.currentImage * this.IMAGE_WIDTH;
    this.endX = -targetImage * this.IMAGE_WIDTH;
    factor = Math.max(Math.abs(targetImage - this.currentImage), 1);
    Animations.move(this.imagesSlideshow, this.SLIDE_MOVE_DELAY, this.SLIDE_MOVE_DURATION, {
      y: 0,
      x: [this.startX, this.endX]
    });
    return this.currentImage = targetImage;
  };

  Slide.prototype.addListeners = function() {
    var _this = this;
    return this.container.onclick = function(e) {
      var opts;
      opts = {
        id: _this.id,
        x: $(_this.container).position().left
      };
      return EventManager.emitEvent(Events.SLIDE_EVENT_CLICK, [opts]);
    };
  };

  Slide.prototype.removeListeners = function() {};

  Slide.prototype.onVideoClose = function() {
    EventManager.addListener(Events.VIDEO_CLOSE, this.onVideoClose);
    return this.addListeners();
  };

  return Slide;

})();

(function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (w.requestAnimationFrame) {
      break;
    }
    w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
    w.cancelAnimationFrame = w["" + vendor + "CancelAnimationFrame"] || w["" + vendor + "CancelRequestAnimationFrame"];
  }
  targetTime = 0;
  w.requestAnimationFrame || (w.requestAnimationFrame = function(callback) {
    var currentTime;
    targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
    return w.setTimeout((function() {
      return callback(+(new Date));
    }), targetTime - currentTime);
  });
  return w.cancelAnimationFrame || (w.cancelAnimationFrame = function(id) {
    return clearTimeout(id);
  });
})();
