function createQuadtreeMap(opts) {
  // opts:
  //   quadtree
  //   x
  //   y
  //   width
  //   height
  //   quadRootSelection
  //   pointRootSelection

  var commonProps = ['quadtree', 'x', 'y', 'width', 'height'];
  var quadRendererOpts = _.pick(opts, commonProps)
  var pointRendererOpts = _.pick(opts, commonProps)
  pointRendererOpts.rootSelection = opts.pointRootSelection;
  quadRendererOpts.rootSelection = opts.quadRootSelection;

  var quadRenderer = createMapQuadRenderer(quadRendererOpts);
  var pointRenderer = createQuadtreePointsMap(pointRendererOpts);

  function renderObjectsFromTree(quadtree) {
    var renderObjects = [];
    opts.quadtree.visit(function grabPoint(node, x1, y1, x2, y2) {
      if (node.leaf) {
        renderObjects.push(node.point);
      }
    });
    return renderObjects;
  }

  function render() {
    quadRenderer.render(quadRenderer.buildQuads());
    pointRenderer.render(renderObjectsFromTree(opts.quadtree));
  }

  return {
    render: render,
    quadRenderer: quadRenderer,
    pointRenderer: pointRenderer
  };
}
