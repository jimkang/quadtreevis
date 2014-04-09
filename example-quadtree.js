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

 function setColor(node, x1, y1, x2, y2) {
    if (node.leaf) {
      node.color = 'red';
    }
    else {
      node.color = 'orange';        
    }
  }

  function combineVisitFunctions() {
    var fns = arguments;
    return function combinedVisit(node, x1, y1, x2, y2) {
      for (var i = 0; i < fns.length; ++i) {
        fns[i](node, x1, y1, x2, y2);
      }
    };
  }

  var labeler = createQuadtreeLabeler();

  quadtree.updateNodes = function updateNodes() {    
    quadtree.visit(combineVisitFunctions(labeler.setLabelOnNode, setColor));
  };

  quadtree.updateNodes();

  return quadtree;
}

