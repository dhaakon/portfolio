var Slideshow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Slideshow = (function(_super) {

  __extends(Slideshow, _super);

  Slideshow.prototype.SLIDE_DELAY = 0.1;

  Slideshow.prototype.SLIDE_DURATION = 0.3;

  Slideshow.prototype.OFFSET = 700;

  Slideshow.prototype.SLIDE_WIDTH = 740;

  Slideshow.prototype.SLIDE_PADDING = 42;

  Slideshow.prototype.SLIDE_BUFFER_SIZE = 2;

  Slideshow.prototype.FIRST_SLIDE = 2;

  Slideshow.prototype.MIN_HEIGHT = 768;

  Slideshow.prototype.MIN_WIDTH = 1024;

  Slideshow.prototype.isOnLastSlide = false;

  Slideshow.prototype.isOnFirstSlide = false;

  Slideshow.prototype.wrapper = null;

  Slideshow.prototype.container = null;

  Slideshow.prototype.slideContainer = null;

  Slideshow.prototype.data = null;

  Slideshow.prototype.slides = [];

  Slideshow.prototype.currentSlide = 2;

  Slideshow.prototype.maxSlides = 5;

  Slideshow.prototype.timer = 0;

  Slideshow.prototype.startX = 0;

  Slideshow.prototype.endX = 0;

  function Slideshow(data, wrapper, container, slideContainer) {
    this.move = __bind(this.move, this);

    this.close = __bind(this.close, this);

    this.onSlideClick = __bind(this.onSlideClick, this);

    this.onKeyPress = __bind(this.onKeyPress, this);

    this.onResize = __bind(this.onResize, this);

    this.onVideoClose = __bind(this.onVideoClose, this);

    this.onShowVideo = __bind(this.onShowVideo, this);
    Slideshow.__super__.constructor.call(this);
    EventManager.addListener(Events.WINDOW_RESIZE, this.onResize);
    this.data = data;
    this.wrapper = wrapper;
    this.container = container;
    this.slideContainer = slideContainer;
    this.slides = [];
    this.maxSlides = this.data.projects.length;
    if (this.slides.length === 0) {
      this.createSlides();
    }
  }

  Slideshow.prototype.onShowVideo = function() {
    this.removeListeners();
    return EventManager.addListener(Events.VIDEO_CLOSE, this.onVideoClose);
  };

  Slideshow.prototype.onVideoClose = function() {
    EventManager.removeListener(Events.VIDEO_CLOSE, this.onVideoClose);
    return this.addListeners();
  };

  Slideshow.prototype.addListeners = function() {
    EventManager.addListener(Events.CLOSE_EVENT, this.close);
    EventManager.addListener(Events.SLIDE_EVENT_CLICK, this.onSlideClick);
    EventManager.addListener(Events.KEYBOARD_EVENT, this.onKeyPress);
    return EventManager.addListener(Events.BUTTON_GO_EVENT, this.onShowVideo);
  };

  Slideshow.prototype.removeListeners = function() {
    EventManager.removeListener(Events.CLOSE_EVENT, this.close);
    EventManager.removeListener(Events.SLIDE_EVENT_CLICK, this.onSlideClick);
    EventManager.removeListener(Events.KEYBOARD_EVENT, this.onKeyPress);
    return EventManager.removeListener(Events.BUTTON_GO_EVENT, this.onShowVideo);
  };

  Slideshow.prototype.onResize = function() {
    this.wrapper.style.width = $(window).width() + "px";
    this.wrapper.style.height = $(window).height() + "px";
    Utils.transform(this.container, new CSSMatrix().translate(this.calcXOffset(this.currentSlide), this.calcYOffset(this.currentSlide)).toString());
    return this.startX = this.calcXOffset(this.currentSlide);
  };

  Slideshow.prototype.onKeyPress = function(e) {
    switch (e.keyCode) {
      case 37:
        return this.move(this.currentSlide - 1);
      case 39:
        return this.move(this.currentSlide + 1);
      case 32:
        if (this.slides[this.currentSlide].proj.link !== "") {
          return this.slides[this.currentSlide].goToLink();
        }
        break;
      case 27:
        this.close();
        return this.closeClickHandler(e);
    }
  };

  Slideshow.prototype.onSlideClick = function(e) {
    this.slides[this.currentSlide].deactivate();
    return this.move(e.id);
  };

  Slideshow.prototype.animateSlides = function() {
    var count, slide, _i, _len, _ref, _results;
    count = 0;
    _ref = this.slides;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slide = _ref[_i];
      count++;
      _results.push(Animations.fade('in', slide.container, count * 0.2 + this.SLIDE_DELAY, 0.5));
    }
    return _results;
  };

  Slideshow.prototype.createBufferSlide = function(slide, int) {
    var _slide;
    _slide = new Slide(slide, int);
    this.slides.push(_slide);
    return this.slideContainer.appendChild(_slide.container);
  };

  Slideshow.prototype.createSlides = function() {
    var bufferSlide, count, project, slide, _i, _j, _k, _len, _ref, _ref1, _ref2, _width;
    _width = this.SLIDE_WIDTH * 5;
    count = this.SLIDE_BUFFER_SIZE;
    for (bufferSlide = _i = _ref = this.data.projects.length - 2, _ref1 = this.data.projects.length - 1; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; bufferSlide = _ref <= _ref1 ? ++_i : --_i) {
      this.createBufferSlide(this.data.projects[bufferSlide], this.data.projects.length - bufferSlide);
    }
    _ref2 = this.data.projects;
    for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
      project = _ref2[_j];
      slide = new Slide(project, count);
      this.slides.push(slide);
      this.slideContainer.appendChild(slide.container);
      _width += this.SLIDE_WIDTH + (this.SLIDE_PADDING * 2);
      count++;
    }
    for (bufferSlide = _k = 0; _k <= 1; bufferSlide = ++_k) {
      this.createBufferSlide(this.data.projects[bufferSlide], this.slides.length + bufferSlide);
    }
    return this.container.style.width = _width + "px";
  };

  Slideshow.prototype.setupSlideNavigation = function() {
    var _this = this;
    return;
    this.navigation.previousButton.click(function() {
      if (_this.currentSlide !== 0) {
        return _this.move(_this.currentSlide - 1);
      }
    });
    return this.navigation.nextButton.click(function() {
      if (_this.currentSlide !== _this.slides.length) {
        return _this.move(_this.currentSlide + 1);
      }
    });
  };

  Slideshow.prototype.kill = function() {
    var cb,
      _this = this;
    this.removeListeners();
    cb = function() {
      return _this.wrapper.style.display = 'none';
    };
    Animations.fade('out', this.wrapper, 0, 0.25, cb);
    return this.currentSlide = this.FIRST_SLIDE;
  };

  Slideshow.prototype.close = function() {
    var cb, count, slide, _i, _len, _ref, _results,
      _this = this;
    this.slides[this.currentSlide].deactivate();
    this.kill();
    count = 0;
    _ref = this.slides;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slide = _ref[_i];
      count++;
      if (count === this.slides.length) {
        cb = function() {
          return _this.kill();
        };
      } else {
        cb = null;
      }
      _results.push(Animations.fade('out', slide.container, 0, 0.3, cb));
    }
    return _results;
  };

  Slideshow.prototype.start = function() {
    this.wrapper.style.display = "block";
    this.wrapper.style.left = '0px';
    this.wrapper.style.width = $(window).width() + "px";
    this.wrapper.style.height = $(window).height() + "px";
    Animations.fade('in', this.wrapper, 0, 0.4);
    this.setupSlideNavigation();
    this.addListeners();
    this.animateSlides();
    this.createClose();
    this.slides[this.FIRST_SLIDE].activate();
    return this.onResize();
  };

  Slideshow.prototype.move = function(targetSlide, duration) {
    var cb,
      _this = this;
    this.removeListeners();
    this.endX = this.calcXOffset(targetSlide);
    if (targetSlide === this.SLIDE_BUFFER_SIZE - 1) {
      this.isOnFirstSlide = true;
    }
    if (targetSlide === this.slides.length - this.SLIDE_BUFFER_SIZE) {
      this.isOnLastSlide = true;
    }
    this.slides[this.currentSlide].deactivate();
    cb = function() {
      var previousSlide;
      if (_this.isOnFirstSlide) {
        previousSlide = _this.currentSlide;
        _this.currentSlide = _this.slides.length - (_this.SLIDE_BUFFER_SIZE + 1);
        _this.isOnFirstSlide = false;
        _this.isOnLastSlide = false;
        _this.slides[previousSlide].deactivate();
        setTimeout((function() {
          return _this.onResize();
        }), 1);
        _this.slides[_this.currentSlide].activate();
      }
      if (_this.isOnLastSlide) {
        previousSlide = _this.currentSlide;
        _this.currentSlide = _this.SLIDE_BUFFER_SIZE;
        _this.isOnFirstSlide = false;
        _this.isOnLastSlide = false;
        _this.slides[previousSlide].deactivate();
        setTimeout((function() {
          return _this.onResize();
        }), 1);
        _this.slides[_this.currentSlide].activate();
      }
      _this.startX = _this.endX;
      return _this.addListeners();
    };
    if (duration === void 0) {
      duration = this.SLIDE_DURATION;
    }
    Animations.move(this.container, 0, duration, {
      y: this.calcYOffset(targetSlide),
      x: [this.startX, this.endX]
    }, cb, 10);
    this.currentSlide = targetSlide;
    return this.slides[this.currentSlide].activate();
  };

  Slideshow.prototype.calcXOffset = function(int) {
    var containerWidth, slideContainer, slideDiff, slideWidth, width, x;
    slideContainer = $(this.slides[int].container);
    containerWidth = $(this.container).width();
    width = $(window).width();
    slideWidth = slideContainer.width();
    x = slideContainer.position().left + this.SLIDE_PADDING;
    slideDiff = width - slideWidth;
    return -(x - slideDiff / 2);
  };

  Slideshow.prototype.calcYOffset = function(int) {
    var containerHeight, height, slideContainer, slideDiff, slideHeight, y;
    slideContainer = $(this.slides[int].container);
    containerHeight = $(this.container).height();
    height = $(window).height();
    slideHeight = slideContainer.height();
    y = slideContainer.position().top;
    slideDiff = height - slideHeight;
    return -(y - slideDiff / 2);
  };

  return Slideshow;

})(Module);
