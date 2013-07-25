var Utils;

Utils = {
  vendors: ['webkit', 'ms', 'Moz', 'o'],
  transform: function(obj, matrix) {
    var vendor, _i, _len, _ref, _results;
    _ref = this.vendors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      _results.push(obj.style[vendor + 'Transform'] = matrix);
    }
    return _results;
  },
  addCSSEventListener: function(obj, propName, cb) {
    var vendor, _i, _len, _ref, _results,
      _this = this;
    _ref = this.vendors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      _results.push(obj.addEventListener(vendor + "TransitionEnd", function(e) {
        if (e.propertyName === propName) {
          return cb(e);
        }
      }));
    }
    return _results;
  },
  setTransitionDelay: function(obj, delay) {
    var vendor, _i, _len, _ref, _results;
    _ref = this.vendors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      _results.push(obj.style[vendor + 'TransitionDelay'] = delay + 'ms');
    }
    return _results;
  },
  getCSS: function(obj, prop) {
    return obj.style[prop];
  },
  parseLocation: function() {
    var location, locationHash;
    if (window.location.hash) {
      locationHash = window.location.hash;
    } else {
      locationHash = "#" + window.location.href.split("#")[1];
    }
    location = locationHash;
    return location.split("#")[1];
  }
};
