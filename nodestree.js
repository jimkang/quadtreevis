function createNodesTree() {

var nodesTree = {
  layout: null,
  diagonalProjection: null,
  animationDuration: 750,
  maxLabelWidth: 140,
  treeLayer: null,
  camera: null
};

nodesTree.init = function init() {
  // The tree layout generates a left-to-right tree by default, and we want a 
  // top-to-bottom tree, so we flip x and y when we talk to it.
  this.treeLayout = d3.layout.tree();
  this.treeLayout.nodeSize([64, 32]);
  this.diagonalProjection = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
  this.treeLayer = d3.select('#treelayer');

  this.camera = createCamera('#treeboard', '#treelayer', [0.25, 2]);
};

nodesTree.update = function update(rootQuadTreeNode) {
  var layoutTree = convertQuadTreeNodeToLayoutTree(rootQuadTreeNode);
  if (!layoutTree || !layoutTree.children || layoutTree.children.length < 1) {
    return;
  }
  // Compute the new tree layout.
  var nodes = this.treeLayout
    .nodes(layoutTree)
    .reverse();

  nodes.forEach(function swapXAndY(d) {
    var oldX = d.x;
    var oldX0 = d.x0;
    d.x = d.y;
    d.x0 = d.y0;
    d.y = oldX;
    d.y0 = oldX0;
  });

  var links = this.treeLayout.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.x = d.depth * 180; });

  // Update the nodes.
  var node = this.treeLayer.selectAll('#treelayer > g.node')
    .data(nodes, function(d) { return d.id || (d.id = ++i); })
    .classed('new', false);


  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function() { 
      return 'translate(' + layoutTree.y0 + ',' + layoutTree.x0 + ')'; 
    })
    .attr('id', function(d) { return d.id; });

  nodeEnter.append('circle').attr('r', 1e-6);

  nodeEnter.append('text')
    .attr('x', function(d) { 
      return d.children || d._children ? '0.3em' : '-0.3em'; 
    })
    .attr('y', '-1em')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text(function(d) { return d.title; })
    .style('fill-opacity', 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(this.animationDuration)
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

  nodeUpdate.select('circle').attr('r', 12);

  nodeUpdate.select('text')
    .style('fill-opacity', function (d) { 
      return 1.0;
    }
    .bind(this))
    .call(wrap, function getTitle(d) { return d.title; }, this.maxLabelWidth);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(this.animationDuration)
    .attr('transform', function() { 
      return 'translate(' + layoutTree.y + ',' + layoutTree.x + ')'; 
    })
    .remove();

  nodeExit.select('circle')
    .attr('r', 1e-6);

  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // Update the links.
  var link = this.treeLayer.selectAll('path.link')
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function() {
      var o = {x: layoutTree.x0, y: layoutTree.y0};
      return this.diagonalProjection({source: o, target: o});
    }
    .bind(this));

  // Transition links to their new position.
  link.attr('d', this.diagonalProjection).attr('stroke-width', 3);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(this.animationDuration)
    .attr('d', function getLinkData() {
      var o = {x: layoutTree.x, y: layoutTree.y};
      return this.diagonalProjection({source: o, target: o});
    }
    .bind(this))
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Mark the new nodes with the 'new' style.
  nodeEnter.classed('new', true);  
  // Pan to one of the new nodes.
  setTimeout(function pan() {
    this.camera.panToElement(nodeEnter, 750);
  }
  .bind(this),
  750);
}

// Based on https://gist.github.com/mbostock/7555321.
function wrap(text, getTextData, width) {
  text.each(function(d) {
    // console.log('text.text()', text.text());
    var text = d3.select(this);
    var labelText = getTextData(d);
    var words = [];
    if (typeof labelText === 'string') {
      words = labelText.split(/\s+/).reverse();      
    }

    var word,
      line = [],
      lineHeight = 1.1, // ems
      y = text.attr('y'),
      dy = parseFloat(text.attr('dy')),
      tspan = text.text(null).append('tspan')
        .attr('x', 0).attr('y', y).attr('dy', dy + 'em');

    var tspans = [tspan];

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', 0).attr('y', y)
          .text(word);
        tspans.push(tspan);
      }
    }

    for (var i = 0; i < tspans.length; ++i) {
      var tspanToPlace = tspans[i];
      tspanToPlace.attr('dy', dy - (tspans.length - i - 1) * lineHeight + 'em');
    }
  });
}

function convertQuadTreeNodeToLayoutTree(quadTreeNode) {
  quadTreeNode.children = quadTreeNode.nodes;
  quadTreeNode.id = uid(4);
  quadTreeNode.x0 = 0;
  quadTreeNode.y0 = 0;

  for (var i = 0; i < quadTreeNode.nodes.length; ++i) {
    quadTreeNode.children[i] = quadTreeNode.nodes[i];
    if (!quadTreeNode.children[i]) {
      quadTreeNode.children[i] = {
        id: uid(4),
        title: 'TBD',
        children: [],
        nodes: []
      };
    }

    convertQuadTreeNodeToLayoutTree(quadTreeNode.children[i]);
  }

  return quadTreeNode;
}

nodesTree.init();

return nodesTree;
}

