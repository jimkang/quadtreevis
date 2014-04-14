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

  var labeler = createQuadtreeLabeler();

  quadtree.updateNodes = function updateNodes() {    
    quadtree.visit(labeler.setLabelOnNode);
  };

  quadtree.updateNodes();

  return quadtree;
}

