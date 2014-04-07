// opts should contain:
// 
// {
//   rootSelector: a selector for a <g> under which to render the tree
// }

function createQuadtreetree(opts) {
  var quadtreetree = {
    animationDuration: 750,
    maxLabelWidth: 50,
    update: null,
  };

  if (opts.vertical === undefined) {
    opts.vertical = true;
  }

  function normalizeYToFixedDepth(d) {
    d.y = d.depth * 400;
    return d;
  }

  function savePositionToPrevious(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  }

  function sendEvent(eventName, info) {
    var event = new CustomEvent(eventName, {detail: info});
    document.dispatchEvent(event);
  }

  var root = d3.select(opts.rootSelector);
  var generateBezierPath = d3.svg.diagonal();
  if (!opts.vertical) {
    generateBezierPath.projection(function flipXAndY(d) {
      return [d.y, d.x];
    });
  }
  var tree = d3.layout.tree().nodeSize([32, 32]);

  quadtreetree.update = function update(quadtree) {
    var layoutTree = quadtreeToLayoutTree(quadtree);
    // Compute the positions for nodes and links.
    var nodes = tree.nodes(layoutTree).reverse();
    nodes.forEach(normalizeYToFixedDepth);
    var links = tree.links(nodes);

    syncDOMToLinks(links);
    syncDOMToNodes(nodes);
  };

  function syncDOMToNodes(nodes) {
    var renderedNodes = root.selectAll('g.node')
      .data(nodes, accessors.id)
      .attr('id', accessors.id)
      .classed('new', false);

    // Enter any new nodes at their previous positions.
    var entrants = renderedNodes.enter().append('g').attr({
      class: 'node',
      transform: opts.vertical ? 
        accessors.translateToPosition0 : accessors.flipTranslateToPosition0,
      id: accessors.id
    })
    .on('click', function notifyThatNodeWasSelected(d) {
      sendEvent('quadtreetree-nodeSelected', d);
    });

    entrants.append('circle').attr('r', 1e-6);

    // Transition nodes to their new positions.
    var updatees = renderedNodes.transition()
      .duration(quadtreetree.animationDuration)
      .attr('transform', opts.vertical ? 
        accessors.translateToPosition : accessors.flipTranslateToPosition);

    updatees.select('circle').attr('r', 12);

    // Transition exiting nodes to their previous positions.
    var exiters = renderedNodes.exit().transition()
      .duration(quadtreetree.animationDuration)
      .attr('transform', opts.vertical ?
        accessors.translateToPosition0 : accessors.flipTranslateToPosition0)
      .remove();

    exiters.select('circle').attr('r', 1e-6);

    var dotUpdatees = renderedNodes.selectAll('circle');
    dotUpdatees.attr('fill', accessors.color);

    // Stash the old positions for transitions.
    nodes.forEach(savePositionToPrevious);

    // Mark the new nodes with the 'new' style.
    entrants.classed('new', true);

    sendEvent('quadtreetree-dotsEntered', entrants);
  }

  function syncDOMToLinks(links) {
    // Update the links.
    var renderedLinks = root.selectAll('path.link')
      .data(links, accessors.targetId);

    // Enter any new links at their previous positions.
    renderedLinks.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', generateBezierPath);

    // Transition links to their new positions.
    renderedLinks.attr('d', generateBezierPath).attr('stroke-width', 3);

    // Transition exiting links to their previous positions.
    renderedLinks.exit().transition()
      .duration(quadtreetree.animationDuration)
      .attr('d', generateBezierPath)
      .remove();
  }

  return quadtreetree;
}
