function createQuadtreeExercise() {

var exercise = {
  board: d3.select('#quadboard'),
  width: 0,
  height: 0,
  allData: null,
  allDataIndex: 0,
  currentData: [],
  quadtree: null,
  brush: null,
  nodesTree: createNodesTree(),
  strokeRouter: createStrokeRouter(d3.select(document)),
  indexesForKeys: {}
};

exercise.init = function init() {
  this.width = this.board.node().clientWidth;
  this.height = this.board.node().clientHeight;
  var index = 0;

  function createPoint() {
    var point = [
      ~~(Math.random() * this.width), 
      ~~(Math.random() * this.height)
    ];
    this.indexesForKeys[keyForCoords(point[0], point[1])] = index;

    ++index;
    return point;
  }

  this.allData = d3.range(100).map(createPoint.bind(this));

  this.quadtree = transparentQuadTree()
    .extent([[-1, -1], [this.width + 1, this.height + 1]])(this.currentData);

  this.brush = d3.svg.brush()
    .x(d3.scale.identity().domain([0, this.width]))
    .y(d3.scale.identity().domain([0, this.height]))
    .extent([[100, 100], [200, 200]])
    .on('brush', this.brushed.bind(this));
  this.board.append('g').attr('class', 'brush').call(this.brush);
  this.brushed();

  var updateQuadTreeBound = this.updateQuadtree.bind(this);
  this.strokeRouter.routeKeyUp('n', null, updateQuadTreeBound);
  this.strokeRouter.routeKeyUp('space', null, updateQuadTreeBound);
  this.strokeRouter.routeKeyUp('enter', null, updateQuadTreeBound);
  this.strokeRouter.routeKeyUp('downArrow', null, updateQuadTreeBound);
};

function pointColorForIndex(index) {
  var hueBase = index % 20;
  var hueDistBetweenIndexes = 300/20;
  // Shift the hueBase for even numbers so that indexes that are right next 
  // to each other get very different colors.
  if (hueBase % 2 === 0) {
    hueBase += 10;
    hueBase = hueBase % 20;
  }
  return 'hsla(' + (hueBase * hueDistBetweenIndexes) + ', 80%, 60%, 1.0)';
}

function quadColorForIndex(index) {
  var hueBase = index % 20;
  var hueDistBetweenIndexes = 300/20;
  // Shift the hueBase for even numbers so that indexes that are right next 
  // to each other get very different colors.
  if (hueBase % 2 === 0) {
    hueBase += 10;
    hueBase = hueBase % 20;
  }
  return 'hsla(' + (hueBase * hueDistBetweenIndexes) + ', 60%, 40%, 0.5)';
}

// Collapse the quadtree into an array of rectangles.
function getRectsFromQuadTree(quadtree) {
  var rects = [];
  var quadIndex = 0;
  quadtree.visit(function deriveRectFromNode(node, x1, y1, x2, y2) {
    rects.push({
      x: x1, 
      y: y1, 
      width: x2 - x1, 
      height: y2 - y1,
      node: node
    });
    node.quadIndex = quadIndex;
    ++quadIndex;
  });
  return rects;
}

exercise.titleForCoords = function titleForCoords(x, y) {
  return this.indexesForKeys[keyForCoords(x, y)];
}

function keyForCoords(x, y) {
  return x * 10000 + y;
}

exercise.updateQuadtree = function updateQuadtree() {
  if (this.allDataIndex >= this.allData.length) {
    return;
  }
  var nextPoint = this.allData[this.allDataIndex];
  this.currentData.push(nextPoint);
  ++this.allDataIndex;

  this.quadtree.add(nextPoint);

  // Add titles and colors to the nodes in the quadtree for 'display' nodestree 
  // to use. 
  this.quadtree.visit(function appendTitlesToNodes(node, x1, y1, x2, y2) {
    if (node.leaf) {
      var index = this.titleForCoords(node.point[0], node.point[1]);
      node.title = 'Leaf: ' + index;
      node.color = pointColorForIndex(index);
    }
    else {
      node.title = 'Non-leaf';
      node.color = quadColorForIndex(node.quadIndex);
    }
  }
  .bind(this));

  var rectData = getRectsFromQuadTree(this.quadtree);

  var nodes = this.board.select('#quadroot').selectAll('.node').data(rectData);
  nodes.enter().append('rect')
    .attr('class', 'node');

  nodes
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.width; })
    .attr('height', function(d) { return d.height; })
    .attr('fill', function getColor(d) { 
      return quadColorForIndex(d.node.quadIndex);
    });

  var points = this.board.select('#pointroot').selectAll('.point')
    .data(this.currentData);

  points.enter().append('circle')
    .attr('class', 'point')
    .attr('fill', function getColor(d) { 
      return pointColorForIndex(this.titleForCoords(d[0], d[1]));
    }
    .bind(this));

  points
    .attr('cx', function(d) { return d[0]; })
    .attr('cy', function(d) { return d[1]; })
    .attr('r', 10); 

  var labels = this.board.selectAll('.pointlabel').data(this.currentData);
  labels.enter().append('text')
    .classed('pointlabel', true)
    .attr('text-anchor', 'middle');

  labels
    .attr('x', function(d) { return d[0]; })
    .attr('y', function(d) { return d[1] - 10; })  
    .text(function getText(d) { 
      return this.titleForCoords(d[0], d[1]);
    }
    .bind(this));

  updateNodesDisplay();
}

function updateNodesDisplay() {
  exercise.nodesTree.update(exercise.quadtree);
}

exercise.brushed = function brushed() {
  var extent = this.brush.extent();
  var point = this.board.selectAll('.point');
  point.each(function(d) { d.scanned = d.selected = false; });
  search(this.quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
  point.classed('scanned', function(d) { return d.scanned; });
  point.classed('selected', function(d) { return d.selected; });
}

// Find the nodes within the specified rectangle.
function search(quadtree, x0, y0, x3, y3) {
  quadtree.visit(function(node, x1, y1, x2, y2) {
    var p = node.point;
    if (p) {
      p.scanned = true;
      p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
    }
    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
  });
}

exercise.init();

return exercise;
}

