// opts should contain:
// 
// {
//   rootSelector: a selector for a <g> under which to render the tree
//   prefix: (Optional) a prefix to use to create labels for the elements in the 
//   tree.
// }

function createQuadtreetree(opts) {
  _.defaults(opts, {
    animationDuration: 750
  });

  var oneAtATimeSelector = createOneAt('selected');

  if (opts.vertical === undefined) {
    opts.vertical = true;
  }

  var prefix = 'tree-';
  if (opts.prefix) {
    prefix = (opts.prefix + '-' + prefix);
  }
  var labeler = createQuadtreeLabeler(prefix);  

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

  function update(quadtree) {
    var layoutTree = quadtreeToLayoutTree(quadtree, labeler);
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
      .attr('id', accessors.id);

    // Enter any new nodes at their previous positions.
    var entrants = renderedNodes.enter().append('g').attr({
      transform: opts.vertical ? 
        accessors.translateToPosition0 : accessors.flipTranslateToPosition0,
      id: accessors.id
    })
    .classed('node', true)
    .classed('new', true)
    .on('click', function notifyThatNodeWasSelected(d) {
      oneAtATimeSelector.selectElementWithId(accessors.id(d));
      sendEvent('quadtreetree-nodeSelected', d);
    });

    entrants.append('circle').attr('r', 1e-6);

    // Transition nodes to their new positions.
    renderedNodes.transition()
      .duration(opts.animationDuration)
      .attr('transform', opts.vertical ? 
        accessors.translateToPosition : accessors.flipTranslateToPosition);

    renderedNodes.classed({
      new: false,
      leaf: accessors.leaf,
      ghost: accessors.ghost
    });

    renderedNodes.select('circle').transition()
      .duration(opts.animationDuration)
      .attr('r', 12);

    // Transition exiting nodes to their previous positions.
    var exiters = renderedNodes.exit().transition()
      .duration(opts.animationDuration)
      .attr('transform', opts.vertical ?
        accessors.translateToPosition0 : accessors.flipTranslateToPosition0)
      .remove();

    exiters.select('circle').attr('r', 1e-6);

    var dotUpdatees = renderedNodes.selectAll('circle');

    // Stash the old positions for future transitions.
    nodes.forEach(savePositionToPrevious);

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
      .duration(opts.animationDuration)
      .attr('d', generateBezierPath)
      .remove();
  }

  return {
    update: update,
    selectElementExclusively: oneAtATimeSelector.selectElementWithId,
    labeler: labeler
  };
}
