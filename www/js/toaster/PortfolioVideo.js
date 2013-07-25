var PortfolioVideo,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PortfolioVideo = (function() {

  PortfolioVideo.prototype.VIDEO_ID = "portfolio-video";

  PortfolioVideo.prototype.videoWidth = 960;

  PortfolioVideo.prototype.videoHeight = 540;

  PortfolioVideo.prototype.videoJS = null;

  PortfolioVideo.prototype.container = document.getElementById('dhaakon-video-container');

  PortfolioVideo.prototype.wrapper = document.getElementById('dhaakon-video-wrapper');

  PortfolioVideo.prototype.videoURL = null;

  PortfolioVideo.prototype.videoElement = null;

  PortfolioVideo.prototype.videos = null;

  PortfolioVideo.prototype.title = document.getElementById('dhaakon-video-title');

  PortfolioVideo.prototype.close = document.getElementById('close');

  PortfolioVideo.prototype.isActive = false;

  PortfolioVideo.prototype.show = function() {
    var cb,
      _this = this;
    this.addListeners();
    this.wrapper.style.display = "block";
    cb = function() {
      return _this.onResize();
    };
    return Animations.fade('in', this.wrapper, 0, 0.4, cb);
  };

  PortfolioVideo.prototype.hide = function() {
    var cb,
      _this = this;
    cb = function() {
      return _this.wrapper.style.display = "none";
    };
    Animations.fade('out', this.wrapper, 0, 0.4, cb);
    EventManager.emitEvent(Events.VIDEO_CLOSE);
    return this.removeListeners();
  };

  function PortfolioVideo() {
    this.onResize = __bind(this.onResize, this);

    this.onVideoComplete = __bind(this.onVideoComplete, this);

    this.onKeyboardPress = __bind(this.onKeyboardPress, this);
    this.createVideo();
  }

  PortfolioVideo.prototype.kill = function() {
    this.videoJS.pause();
    return this.hide();
  };

  PortfolioVideo.prototype.onKeyboardPress = function(e) {
    if (e.keyCode === 27) {
      return this.kill();
    }
  };

  PortfolioVideo.prototype.onVideoComplete = function() {
    return this.hide();
  };

  PortfolioVideo.prototype.createVideo = function() {
    var cb, source, videoOptions,
      _this = this;
    this.videoElement = document.createElement("video");
    this.videoElement.id = this.VIDEO_ID;
    this.videoElement.className = 'vjs-default-skin vid';
    source = document.createElement("source");
    source.type = 'video/mp4';
    source.src = 'video/ubs.mp4';
    this.container.appendChild(this.videoElement);
    this.videoElement.appendChild(source);
    videoOptions = {
      'autoplay': false,
      'loop': false,
      'controls': true,
      'width': this.videoWidth,
      'height': this.videoHeight
    };
    cb = function() {
      setTimeout((function() {
        return _this.videoJS.on('ended', _this.onVideoComplete);
      }), 10);
      return _this.onResize();
    };
    return this.videoJS = videojs(this.VIDEO_ID, videoOptions, cb);
  };

  PortfolioVideo.prototype.addListeners = function() {
    var _this = this;
    EventManager.addListener(Events.WINDOW_RESIZE, this.onResize);
    EventManager.addListener(Events.KEYBOARD_EVENT, this.onKeyboardPress);
    return this.close.onclick = function() {
      return _this.kill();
    };
  };

  PortfolioVideo.prototype.removeListeners = function() {
    EventManager.removeListener(Events.WINDOW_RESIZE, this.onResize);
    return EventManager.removeListener(Events.KEYBOARD_EVENT, this.onKeyboardPress);
  };

  PortfolioVideo.prototype.changeVideo = function(url) {
    return this.videoJS.src(url);
  };

  PortfolioVideo.prototype.changeTitle = function(title) {
    return this.title.innerHTML = title;
  };

  PortfolioVideo.prototype.onResize = function(e) {
    return this.container.style.marginTop = this.calcYOffset() + "px";
  };

  PortfolioVideo.prototype.calcYOffset = function(int) {
    var containerHeight, height, slideContainer, slideDiff, slideHeight, y;
    slideContainer = $(this.container);
    containerHeight = $(this.container).height();
    height = $(window).height();
    slideHeight = slideContainer.height();
    y = slideContainer.position().top;
    slideDiff = height - slideHeight;
    return -(y - slideDiff / 2);
  };

  return PortfolioVideo;

})();
