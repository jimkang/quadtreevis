function exampleQuadtree(width, height, points) {
  var treeFactory = d3.geom.quadtree()
    .extent([[-1, -1], [width + 1, height + 1]]);

  var xFactor = (width > height) ? 1 : height/width;
  var yFactor = (height > width) ? 1 : width/height;

  function getX(d) {
    return d[0] * xFactor;
  };

  function getY(d) {
    return d[1] * yFactor;
  }

  treeFactory.x(getX);
  treeFactory.y(getY);

  var quadtree = treeFactory(points);
  var pointIndex = 0;
  var quadIndex = 0;

  function addLabel(node, x1, y1, x2, y2) {
      var labelPrefix = 'quad_';

      if (node.leaf) {
        node.label = 'point_' + node.point[0] + '_' + node.point[1];
        node.color = 'red'; //colorDealer.pointColorForIndex(pointIndex);
        ++pointIndex;
      }
      else {
        node.label = ('quad_' + (x1 + x2)/2 + '_' + (y1 + y2)/2);
        node.color = 'orange'; //colorDealer.quadColorForIndex(quadIndex);
        ++quadIndex;
      }

      if (!node.label) {
        debugger;
      }
  }

  quadtree.setLabels = function setLabels() {
    quadtree.visit(addLabel);
  };

  quadtree.setLabels();

  return quadtree;
}

