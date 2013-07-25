var Module,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Module = (function() {

  Module.prototype.container = null;

  Module.prototype.closeButton = document.getElementById('dhaakon-close');

  function Module(id) {
    this.id = id;
    this.closeClickHandler = __bind(this.closeClickHandler, this);

  }

  Module.prototype.start = function() {};

  Module.prototype.close = function() {};

  Module.prototype.addListeners = function() {};

  Module.prototype.createClose = function() {
    this.closeButton.style.display = 'block';
    Animations.fade('in', this.closeButton, 0.6, 0.2);
    return this.closeButton.onclick = this.closeClickHandler;
  };

  Module.prototype.closeClickHandler = function(e) {
    var cb,
      _this = this;
    cb = function() {
      _this.closeButton.style.display = "none";
      window.location.hash = "main";
      return EventManager.emitEvent(Events.CLOSE_EVENT);
    };
    return Animations.fade('out', this.closeButton, 0, 0.1, cb);
  };

  return Module;

})();
