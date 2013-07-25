var About, Experiments, Work,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

About = (function(_super) {

  __extends(About, _super);

  About.prototype.VIDEO_PLAYER_ID = "about-video-player";

  About.prototype.container = document.getElementById('dhaakon-about-container');

  About.prototype.sectionContainer = document.getElementById('about-content-section-container');

  About.prototype.videoContaienr = document.getElementById('video-section');

  About.prototype.videos = ['video/loop.mp4', 'video/post_slow.mp4', 'video/bike.mp4'];

  About.prototype.videoPlayer = null;

  About.prototype.currentIndex = 0;

  About.prototype.maxIndex = 0;

  About.prototype.close = function(e) {
    var cb,
      _this = this;
    this.removeListeners();
    this.videoPlayer.pause();
    cb = function() {
      return _this.container.style.display = 'none';
    };
    return Animations.fade('out', this.container, 0, 0.25, cb);
  };

  About.prototype.onVideoComplete = function(e) {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.videoJS.src(this.videos[this.currentIndex]);
    return this.videoJS.play();
  };

  About.prototype.addListeners = function() {
    EventManager.addListener(Events.CLOSE_EVENT, this.close);
    EventManager.addListener(Events.WINDOW_RESIZE, this.onResize);
    return EventManager.addListener(Events.KEYBOARD_EVENT, this.onKeyPress);
  };

  About.prototype.removeListeners = function() {
    EventManager.removeListener(Events.CLOSE_EVENT, this.close);
    EventManager.removeListener(Events.WINDOW_RESIZE, this.onResize);
    return EventManager.removeListener(Events.KEYBOARD_EVENT, this.onKeyPress);
  };

  About.prototype.start = function() {
    this.container.style.display = "block";
    Animations.fade('in', this.container, 0, 1.0);
    this.addListeners();
    this.createClose();
    if (!this.videoPlayer) {
      return this.createVideo();
    } else {
      return this.videoPlayer.play();
    }
  };

  About.prototype.createVideo = function() {
    var cb, source, videoOptions,
      _this = this;
    this.videoPlayer = document.createElement('video');
    this.videoPlayer.id = this.VIDEO_PLAYER_ID;
    source = document.createElement('source');
    source.type = 'video/mp4';
    source.src = this.videos[0];
    this.container.appendChild(this.videoPlayer);
    this.videoPlayer.appendChild(source);
    this.container.style.width = window.innerWidth + "px";
    this.container.style.height = window.innerHeight + "px";
    this.videoPlayer.style.width = window.innerWidth + "px";
    this.videoPlayer.style.height = window.innerHeight + "px";
    videoOptions = {
      'autoplay': true,
      'loop': false,
      'controls': false,
      'width': $(window).width(),
      'height': $(window).height()
    };
    cb = function() {
      Animations.fade('in', document.getElementById(_this.VIDEO_PLAYER_ID), 0.8, 1.2, null, 0.4);
      return setTimeout((function() {
        _this.onResize();
        return _this.videoJS.on('ended', _this.onVideoComplete);
      }), 700);
    };
    this.videoJS = videojs(this.VIDEO_PLAYER_ID, videoOptions, cb);
    return this.onResize();
  };

  function About() {
    this.onKeyPress = __bind(this.onKeyPress, this);

    this.onResize = __bind(this.onResize, this);

    this.onVideoComplete = __bind(this.onVideoComplete, this);

    this.close = __bind(this.close, this);
    this.maxIndex = this.videos.length - 1;
    About.__super__.constructor.call(this);
  }

  About.prototype.onResize = function(e) {
    var adjustment_ratio, cont, target_aspect_ratio, vid_container, video_aspect_ratio, vidplayer, win_height, win_width;
    cont = $(this.container);
    vidplayer = $(this.videoPlayer);
    win_height = $(window).height();
    win_width = $(window).width();
    cont.css('width', win_width);
    cont.css('height', win_height);
    vid_container = $(vidplayer.parentNode);
    video_aspect_ratio = vidplayer[0].videoWidth / vidplayer[0].videoHeight;
    target_aspect_ratio = win_width / win_height;
    adjustment_ratio = target_aspect_ratio / video_aspect_ratio;
    vid_container.css('width', win_width);
    vid_container.css('height', win_height);
    vidplayer.css('width', win_width);
    vidplayer.css('height', win_height);
    this.sectionContainer.style.marginTop = this.calcYOffset() + "px";
    if (video_aspect_ratio < target_aspect_ratio) {
      return vidplayer.css('-webkit-transform', 'scaleX(' + target_aspect_ratio / video_aspect_ratio + ')');
    } else {
      return vidplayer.css('-webkit-transform', 'scaleY(' + video_aspect_ratio / target_aspect_ratio + ')');
    }
  };

  About.prototype.onKeyPress = function(e) {
    switch (e.keyCode) {
      case 27:
        this.close();
        return this.closeClickHandler(e);
    }
  };

  About.prototype.calcYOffset = function(int) {
    var containerHeight, height, slideContainer, slideDiff, slideHeight, y;
    slideContainer = $(this.sectionContainer);
    containerHeight = $(this.container).height();
    height = $(window).height();
    slideHeight = slideContainer.height();
    y = slideContainer.position().top;
    slideDiff = height - slideHeight;
    return -(y - slideDiff / 2);
  };

  return About;

})(Module);

Work = (function(_super) {

  __extends(Work, _super);

  Work.prototype.wrapper = document.getElementById('dhaakon-work-container');

  Work.prototype.container = document.getElementById('portfolio-container');

  Work.prototype.slideContainer = document.getElementById('work-templates');

  Work.prototype.data = PortfolioData;

  function Work() {
    Work.__super__.constructor.call(this, this.data, this.wrapper, this.container, this.slideContainer);
  }

  return Work;

})(Slideshow);

Experiments = (function(_super) {

  __extends(Experiments, _super);

  Experiments.prototype.wrapper = document.getElementById('dhaakon-experiments-container');

  Experiments.prototype.container = document.getElementById('experiments-container');

  Experiments.prototype.slideContainer = document.getElementById('experiments-work-templates');

  Experiments.prototype.data = ExperimentsData;

  function Experiments() {
    Experiments.__super__.constructor.call(this, this.data, this.wrapper, this.container, this.slideContainer);
  }

  return Experiments;

})(Slideshow);
