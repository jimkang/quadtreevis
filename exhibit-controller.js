function exhibitController() {
  var helpers = exhibitHelpers();
  var reporter = createExhibitReporter('.details-box');
  var treeBoardDimensions = helpers.captureElDimensions('#widetree');
  var mapBoardDimensions = helpers.captureElDimensions('#widemap');
  var randomPoint = helpers.randomPointFunctor(mapBoardDimensions)
  var points = d3.range(100).map(randomPoint);

  var quadtree = exampleQuadtree(mapBoardDimensions[0], mapBoardDimensions[1], 
    points);

  var widetree = createQuadtreetree({
    rootSelector: '#widetree .treeroot',
    vertical: true,
    prefix: 'widetree'
  });

  var sidebysidetree = createQuadtreetree({
    rootSelector: '#sidebysidetree .treeroot',
    vertical: true,
    prefix: 'sidebysidetree'
  });

  var widequadmap = createQuadtreeMap({
    x: 0,
    y: 0,
    width: mapBoardDimensions[0],
    height: mapBoardDimensions[1],
    quadtree: quadtree,
    quadRootSelection: d3.select('#widemap .quadroot'),
    pointRootSelection: d3.select('#widemap .pointroot'),
    prefix: 'widemap'
  });

  var sidebysidequadmap = createQuadtreeMap({
    x: 0,
    y: 0,
    width: mapBoardDimensions[0],
    height: mapBoardDimensions[1],
    quadtree: quadtree,
    quadRootSelection: d3.select('#sidebysidemap .quadroot'),
    pointRootSelection: d3.select('#sidebysidemap .pointroot'),
    prefix: 'sidemap'
  });

  var camera = createCamera('#widetree', '#widetree .treeroot', [0.025, 2]);
  var sidebysidetreeCamera = 
    createCamera('#sidebysidetree', '#sidebysidetree .treeroot', [0.025, 2]);

  helpers.respondToEventWithFn('quadtreetree-dotsEntered', zoomToDots);
  helpers.respondToEventWithFn('quadtreetree-nodeSelected', 
    helpers.compose(syncMapToTreeSelection, reporter.reportSelectedNode));
  helpers.respondToEventWithFn('quadtreemap-quadSelected', 
    helpers.compose(syncTreeToMapSelection, reporter.reportSelectedNode));
  helpers.respondToEventWithFn('quadtreemap-pointSelected', 
    helpers.compose(syncTreeToMapSelection, reporter.reportSelectedNode));

  function zoomToDots(dots) {
    setTimeout(function pan() {
      camera.panToElement({
        focusElementSel: dots,
        scale: 1.0,
        duration: 750
      });
    },
    750);
  }

  var mapLabeler = createQuadtreeLabeler('map-');
  var treeLabeler = createQuadtreeLabeler('tree-');

  function syncMapToTreeSelection(selectedQuadNode) {
    if (!selectedQuadNode.ghost) {
      var treeNode = selectedQuadNode.sourceNode;
      var mapRenderers;
      if (treeNode.leaf) {
        mapRenderers = [
          widequadmap.pointRenderer,
          sidebysidequadmap.pointRenderer
        ];
      }
      else {
        mapRenderers = [
          widequadmap.quadRenderer, 
          sidebysidequadmap.quadRenderer
        ];
      }
      mapRenderers.forEach(function selectMapNode(renderer) {
        var correspondingMapId = renderer.labeler.elementIdForNode(treeNode);
        renderer.selectElExclusively(correspondingMapId);
        helpers.animateHalo(d3.select('#' + correspondingMapId));
      });
    }

    return selectedQuadNode;
  }

  function syncTreeToMapSelection(selectedMapNode) {
    if (!selectedMapNode.ghost) {
      var treeNode = selectedMapNode.sourceNode;
      var renderers = [widetree, sidebysidetree];
      var cameras = [camera, sidebysidetreeCamera];

      renderers.forEach(function selectTreeNode(renderer, i) {
        var correspondingTreeId = renderer.labeler.elementIdForNode(treeNode);
        renderer.selectElementExclusively(correspondingTreeId);
        cameras[i].panToElement({
          focusElementSel: d3.select('#' + correspondingTreeId),
          scale: 1.0,
          duration: 500
        },
        function runAnimation() {
          helpers.animateHalo(d3.select('#' + correspondingTreeId + ' circle'));
        });
      });
    }
    return selectedMapNode;
  }

  widetree.update(quadtree);
  sidebysidetree.update(quadtree);
  widequadmap.render();
  sidebysidequadmap.render();

  function addRandomPoint() {
    points.push(randomPoint());
  }

  function addPoints() {
    d3.range(100).forEach(addRandomPoint);
    var newPoints = points.slice(points.length - 100, points.length);
    newPoints.forEach(quadtree.add);

    quadtree.updateNodes();
    widetree.update(quadtree);
    sidebysidetree.update(quadtree);
    widequadmap.render();
    sidebysidequadmap.render();
  }

  function deleteSelectedPoint() {
    var selected = d3.select('.selected.dot');
    if (!selected.empty()) {
      var node = selected.datum().sourceNode;
      quadtree.remove(node.point);

      quadtree.updateNodes();
      widetree.update(quadtree);
      sidebysidetree.update(quadtree);
      widequadmap.render(widequadmap.buildQuads());

      var pointIndex = points.indexOf(node.point);
      points.splice(pointIndex, 1);
      d3.selectAll('.dot').remove();
    }
  }

  d3.select('#add-points-button').on('click', addPoints);
  d3.select('#delete-point-button').on('click', deleteSelectedPoint);

  return {
    quadtreetree: widetree,
    quadtree: quadtree,
    addPoints: addPoints
  };
}

var theExhibit = exhibitController();
