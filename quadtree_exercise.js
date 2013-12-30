var board = d3.select('#board');
var width = board.node().clientWidth;
var height = board.node().clientHeight;


var allData = d3.range(10/*5000*/).map(function() {
  return [Math.random() * width, Math.random() * width];
});
var allDataIndex = 0;

var currentData = [];

var quadtree = transparentQuadTree()
  .extent([[-1, -1], [width + 1, height + 1]])
  (currentData);

var nodesTree = createNodesTree();

var brush = d3.svg.brush()
  .x(d3.scale.identity().domain([0, width]))
  .y(d3.scale.identity().domain([0, height]))
  .extent([[100, 100], [200, 200]])
  .on('brush', brushed);

// Collapse the quadtree into an array of rectangles.
function getNodesFromQuadTree(quadtree) {
  var nodes = [];
  quadtree.visit(function(node, x1, y1, x2, y2) {
    nodes.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
  });
  return nodes;
}

function updateQuadtree() {
  if (allDataIndex >= allData.length) {
    clearInterval(updateHandle);
    return;
  }
  var nextPoint = allData[allDataIndex];
  currentData.push(nextPoint);
  ++allDataIndex;

  quadtree.add(nextPoint);
  var nodes = board.selectAll('.node').data(getNodesFromQuadTree(quadtree));
  nodes.enter().append('rect')
    .attr('class', 'node');

  nodes
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.width; })
    .attr('height', function(d) { return d.height; });

  var points = board.selectAll('.point').data(currentData);
  points.enter().append('circle')
    .attr('class', 'point');

  points
    .attr('cx', function(d) { return d[0]; })
    .attr('cy', function(d) { return d[1]; })
    .attr('r', 4); 

  updateNodesDisplay();
}

function updateNodesDisplay() {
  nodesTree.update(quadtree);
}

var updateHandle = setInterval(updateQuadtree, 2000);

board.append('g')
  .attr('class', 'brush')
  .call(brush);

brushed();

function brushed() {
  var extent = brush.extent();
  var point = board.selectAll('.point');
  point.each(function(d) { d.scanned = d.selected = false; });
  search(quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
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
