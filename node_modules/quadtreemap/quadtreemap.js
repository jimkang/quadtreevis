function createQuadtreeMap(opts) {
  // opts should contain:
  // 
  // {
  //   x: number,
  //   y: number,
  //   width: number, 
  //   height: number, 
  //   quadtree: [a d3.geom.quadtree], 
  //   rootSelection: [a D3 selection of a <g> under which to render the quads]
  // }

  var quadIndex = 0;
  var oneAtATimeSelector = createOneAt('selected');
  var labeler = createQuadtreeLabeler('map-');

  function childNodesToQuads(rootNode, parentQuad, depth) {
    var quads = [];

    if (!rootNode.leaf) {
      var width = parentQuad.width/2;
      var height = parentQuad.height/2;

      function addChildToQuads(childQuads, child, i) {
        if (!child.leaf) {
          var isBottom = i > 1;
          var isRight = (i % 2 === 1);

          var childQuad = {
            id: labeler.elementIdForNode(child),
            x: parentQuad.x + (isRight ? width : 0),
            y: parentQuad.y + (isBottom ? height : 0),
            width: width,
            height: height,
            depth: depth,
            sourceNode: child
          };
          
          childQuads.push(childQuad);
          childQuads = childQuads.concat(
            childNodesToQuads(child, childQuad, depth + 1)
          );
        }
        return childQuads;
      }

      quads = rootNode.nodes.reduce(addChildToQuads, quads);      
    }

    return quads;
  }

  function render(quads) {
    var mappedNodes = opts.rootSelection.selectAll('.map-node').data(quads);
    mappedNodes.enter().append('rect')
      .classed('map-node', true)
      .attr({
        id: function id(d) { return d.id; },
        x: function x(d) { return d.x; },
        y: function y(d) { return d.y; },
        width: function width(d) { return d.width; },
        height: function height(d) { return d.height }
      })
      .on('click', function notifyQuadSelected(d) {
        oneAtATimeSelector.selectElementWithId(d.id);
        var event = new CustomEvent('quadtreemap-quadSelected', {detail: d});
        document.dispatchEvent(event);
      });

    mappedNodes.node().classList.add('root-map-node');
  }

  function getNextQuadIndex() {
    quadIndex += 1;
    return quadIndex;
  }

  function createQuadId() {
    return 'quad-' + getNextQuadIndex();
  }

  var rootQuad = {
    id: labeler.elementIdForNode(opts.quadtree),
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.height,
  };

  var quads = childNodesToQuads(opts.quadtree, rootQuad, 0);
  quads.unshift(rootQuad);
  render(quads);

  return {
    render: render,
    selectQuadElExclusively: oneAtATimeSelector.selectElementWithId
  };
}
