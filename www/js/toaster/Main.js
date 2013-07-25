var Portfolio,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  _this = this;

Portfolio = (function() {

  Portfolio.prototype.MIN_HEIGHT = 768;

  Portfolio.prototype.MIN_WIDTH = 1024;

  Portfolio.prototype.BODY_BACKGROUND = ["radial-gradient(ellipse at center, rgba(175,30,30,1.0) 0%,#0e0e0e 100%)", "-moz-radial-gradient(center, ellipse cover, rgba(175,30,30,1.0) 0%, #0e0e0e 100%)", "-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(175,30,30,1.0)), color-stop(100%,#0e0e0e))", "-webkit-radial-gradient(center, ellipse cover,rgba(175,30,30,1.0) 0%,#0e0e0e 100%)"];

  Portfolio.prototype.heading = document.getElementById('dhaakon-heading');

  Portfolio.prototype.footer = document.querySelectorAll('footer')[0];

  Portfolio.prototype.title = document.getElementById('dhaakon-heading').querySelectorAll('h1')[0];

  Portfolio.prototype.navigationLinks = document.getElementById('dhaakon-title-navigation');

  Portfolio.prototype.sketchContainer = document.getElementById('dhaakon-sketch-container');

  Portfolio.prototype.info = document.getElementById('dhaakon-info');

  Portfolio.prototype.portfolioVideo = null;

  Portfolio.prototype.heightOffset = 80;

  Portfolio.prototype.Modules = {
    'work': Work,
    'experiments': Experiments,
    'about': About
  };

  Portfolio.prototype.activeModules = {
    'work': null,
    'experiments': null,
    'about': null
  };

  Portfolio.prototype.Utils = Utils;

  Portfolio.prototype.physix = null;

  Portfolio.prototype.isActive = true;

  function Portfolio() {
    this.onShowVideo = __bind(this.onShowVideo, this);

    this.onModuleClose = __bind(this.onModuleClose, this);

    this.onResize = __bind(this.onResize, this);

    this.navigateToLink = __bind(this.navigateToLink, this);

    this.onURLChange = __bind(this.onURLChange, this);

    var bg, _i, _len, _ref;
    _ref = this.BODY_BACKGROUND;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bg = _ref[_i];
      document.body.style.background = bg;
    }
    this.setupNavigationLinks();
    this.setupTitleBar();
    this.setupInfo();
    this.sketchContainer.style.height = (window.innerHeight - this.heightOffset) + "px";
    this.sketchContainer.style.width = window.innerWidth + "px";
    this.portfolioVideo = new PortfolioVideo();
    Animations.fade('in', this.sketchContainer, 0.1, 0.4);
    this.addListeners();
  }

  Portfolio.prototype.addListeners = function() {
    EventManager.addListener(Events.WINDOW_RESIZE, this.onResize);
    EventManager.addListener(Events.CLOSE_EVENT, this.onModuleClose);
    EventManager.addListener(Events.BUTTON_GO_EVENT, this.onShowVideo);
    return EventManager.addListener(Events.URL_CHANGE, this.onURLChange);
  };

  Portfolio.prototype.onURLChange = function(e) {
    return console.log(e);
  };

  Portfolio.prototype.setupInfo = function() {
    var _this = this;
    return this.info.onclick = function() {
      return Animations.fade('out', _this.info, 0, 0.1);
    };
  };

  Portfolio.prototype.setupTitleBar = function() {
    Animations.fade('in', this.title, 0.4, 0.1);
    this.heading.style.top = '0px';
    return this.footer.style.bottom = '0px';
  };

  Portfolio.prototype.setupNavigationLinks = function() {
    Animations.fade('in', this.navigationLinks, 0.8, 0.3);
    return this.addNavigationListeners();
  };

  Portfolio.prototype.addNavigationListeners = function() {
    var event;
    this.navigationLinks.onclick = this.navigateToLink;
    event = {
      target: {
        href: window.location.href
      }
    };
    if (window.location.hash === "") {
      event.target.href += "#main";
    }
    return this.navigateToLink(event);
  };

  Portfolio.prototype.navigateToLink = function(e) {
    var cb, destName,
      _this = this;
    if (!this.isActive) {
      return;
    }
    if (e.target.href != null) {

    } else {
      return;
    }
    destName = e.target.href.split('#')[1];
    if (destName != null) {

    } else {
      return;
    }
    if (destName === "main") {
      if (!this.physix) {
        this.typePath = new TypePath(document.getElementById('svgElement'));
        this.physix = new PhysicsDemo(this.typePath.getPaths());
      }
      return;
    }
    if (this.physix != null) {
      this.physix.destroySketch();
    }
    this.isActive = false;
    this.createModule(destName);
    cb = function() {
      return _this.navigationLinks.style.display = 'none';
    };
    return Animations.fade('out', this.navigationLinks, 0, 0.2, cb);
  };

  Portfolio.prototype.createModule = function(str) {
    var module;
    if (!this.activeModules[str]) {
      module = new this.Modules[str](str);
      this.activeModules[str] = module;
    } else {
      module = this.activeModules[str];
    }
    return module.start();
  };

  Portfolio.prototype.restartPhysix = function() {
    return this.physix.createSketch();
  };

  Portfolio.prototype.onResize = function(event) {
    this.sketchContainer.style.height = (window.innerHeight - this.heightOffset) + "px";
    return this.sketchContainer.style.width = window.innerWidth + "px";
  };

  Portfolio.prototype.onModuleClose = function(event) {
    this.isActive = true;
    if (this.physix != null) {
      this.restartPhysix();
    }
    if (!this.physix) {
      this.typePath = new TypePath(document.getElementById('svgElement'));
      this.physix = new PhysicsDemo(this.typePath.getPaths());
    }
    this.navigationLinks.style.display = "block";
    return Animations.fade('in', this.navigationLinks, 0.2, 0.2);
  };

  Portfolio.prototype.onShowVideo = function(proj) {
    this.portfolioVideo.changeVideo(proj.link);
    this.portfolioVideo.changeTitle(proj.name);
    this.portfolioVideo.videoJS.play();
    return this.portfolioVideo.show();
  };

  return Portfolio;

})();

window.onload = (function() {
  return new Portfolio();
});
