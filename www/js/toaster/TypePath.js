var TypePath;

TypePath = (function() {

  TypePath.prototype.STEP_SIZE = 5;

  TypePath.prototype.ctx = null;

  TypePath.prototype.lines = [];

  TypePath.prototype.images = ParticleImages;

  TypePath.prototype.imagesData = [];

  TypePath.prototype.paths = [];

  function TypePath() {
    var group, image, path, _i, _image, _j, _len, _len1, _path, _ref, _ref1;
    this.svg = new SVG('svgElement');
    _ref = this.images;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      image = _ref[_i];
      group = this.svg.group();
      _image = {
        paths: [],
        name: image.name,
        points: [],
        offset: image.offset
      };
      _ref1 = image.paths;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        path = _ref1[_j];
        _path = group.path();
        _path.attr('d', path);
        _image.paths.push(_path);
      }
      this.imagesData.push(_image);
    }
    this.getPoints();
  }

  TypePath.prototype.getPoints = function() {
    var imageData, line, path, pathData, point, totalLength, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = this.imagesData;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imageData = _ref[_i];
      _ref1 = imageData.paths;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        line = _ref1[_j];
        path = {};
        totalLength = path.totalLength = ~~line.node.getTotalLength();
        pathData = [];
        while (totalLength > 0) {
          point = line.node.getPointAtLength(totalLength);
          pathData.push(point);
          totalLength -= this.STEP_SIZE;
        }
        path.pathData = pathData;
        imageData.points.push(path);
      }
      _results.push(this.paths.push(imageData));
    }
    return _results;
  };

  TypePath.prototype.getPaths = function() {
    return this.paths;
  };

  return TypePath;

})();
