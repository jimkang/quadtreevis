function createQuadtreeExercise() {

var exercise = {
  board: d3.select('#board'),
  width: 0,
  height: 0,
  allData: null,
  allDataIndex: 0,
  currentData: [],
  quadtree: null,
  brush: null,
  nodesTree: createNodesTree(),
  strokeRouter: createStrokeRouter(d3.select(document))
};

exercise.init = function init() {
  this.width = this.board.node().clientWidth;
  this.height = this.board.node().clientHeight;

  this.allData = d3.range(10/*5000*/).map(function() {
    return [Math.random() * this.width, Math.random() * this.height];
  }
  .bind(this));

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

// Collapse the quadtree into an array of rectangles.
function getNodesFromQuadTree(quadtree) {
  var nodes = [];
  quadtree.visit(function(node, x1, y1, x2, y2) {
    nodes.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
  });
  return nodes;
}

exercise.updateQuadtree = function updateQuadtree() {
  if (this.allDataIndex >= this.allData.length) {
    return;
  }
  var nextPoint = this.allData[this.allDataIndex];
  this.currentData.push(nextPoint);
  ++this.allDataIndex;

  this.quadtree.add(nextPoint);
  var nodes = this.board.selectAll('.node')
    .data(getNodesFromQuadTree(this.quadtree));
  nodes.enter().append('rect')
    .attr('class', 'node');

  nodes
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.width; })
    .attr('height', function(d) { return d.height; });

  var points = this.board.selectAll('.point').data(this.currentData);
  points.enter().append('circle')
    .attr('class', 'point');

  points
    .attr('cx', function(d) { return d[0]; })
    .attr('cy', function(d) { return d[1]; })
    .attr('r', 4); 

  updateNodesDisplay();
}

function updateNodesDisplay() {
  exercise.nodesTree.update(exercise.quadtree);
}

// var updateHandle = setInterval(exercise.updateQuadtree.bind(exercise), 2000);

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

