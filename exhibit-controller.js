function exhibitController() {
  var helpers = exhibitHelpers();
  var reporter = createExhibitReporter('.details-box');

  var treeBoardDimensions = helpers.captureElDimensions('#quadtreetree');
  var mapBoardDimensions = helpers.captureElDimensions('#quadtreemap');
  var pointKeeper = createPointKeeper(mapBoardDimensions);

  var quadtree = exampleQuadtree(mapBoardDimensions[0], 
    mapBoardDimensions[1], pointKeeper.pointsInRange());

  var quadtreetree = createQuadtreetree({
    rootSelector: '#treeroot',
    vertical: true
  });

  var quadmap = createQuadtreeMap({
    x: 0,
    y: 0,
    width: mapBoardDimensions[0],
    height: mapBoardDimensions[1],
    quadtree: quadtree,
    rootSelection: d3.select('#quadroot')
  });

  var renderedPoints = renderQuadtreePoints({
    points: pointKeeper.pointsInRange(),
    rootSelection: d3.select('#pointroot'),
    x: 0,
    y: 0,
    width: treeBoardDimensions[0], 
    height: treeBoardDimensions[1],
  });

  var camera = createCamera('#quadtreetree', '#treeroot', [0.025, 2]);

  helpers.respondToEventWithFn('quadtreetree-dotsEntered', zoomToDots);
  helpers.respondToEventWithFn('quadtreetree-nodeSelected', 
    helpers.compose(syncMapToTreeSelection, reporter.reportSelectedNode));
  helpers.respondToEventWithFn('quadtreemap-quadSelected', 
    helpers.compose(syncTreeToMapSelection, reporter.reportSelectedNode));
  helpers.respondToEventWithFn('quadtreemap-pointSelected', 
    helpers.compose(syncTreeToMapSelection, reporter.reportSelectedNode));

  function zoomToDots(dots) {
    setTimeout(function pan() {
      camera.panToElement(dots, 750);
    },
    750);
  }

  var mapLabeler = createQuadtreeLabeler('map-');
  var treeLabeler = createQuadtreeLabeler('tree-');

  function syncMapToTreeSelection(selectedTreeNode) {
    var correspondingMapId = 
      mapLabeler.elementIdForNode(selectedTreeNode.sourceNode);

    if (selectedTreeNode.sourceNode.leaf) {
      renderedPoints.selectPointElExclusively(correspondingMapId);
    }
    else {
      quadmap.selectQuadElExclusively(correspondingMapId);
    }
    animateHalo(d3.select('#' + correspondingMapId));

    return selectedTreeNode;
  }

  function syncTreeToMapSelection(selectedMapNode) {
    var label;
    if (typeof selectedMapNode.sourceNode === 'object') {
      label = selectedMapNode.sourceNode.label;
    }
    else {
      label = selectedMapNode.label;
    }

    var correspondingTreeId = treeLabeler.elementIdForLabel(label);
    camera.panToElement(d3.select('#' + correspondingTreeId));
    quadtreetree.selectElementExclusively(correspondingTreeId);
    animateHalo(d3.select('#' + correspondingTreeId + ' circle'));

    return selectedMapNode;
  }

  function animateHalo(target) {
    var enterDuration = 700;
    var exitDuration = 1000;
    var originalRadius = +target.attr('r');

    target.transition()
      .duration(enterDuration)
      .attr('r', originalRadius + 4)
      .style('stroke-width', 10);

    target.transition()
      .delay(enterDuration)
      .duration(exitDuration)
      .attr('r', originalRadius)
      .style('stroke-width', 0);
  }

  quadtreetree.update(quadtree);

  // var intervalKey = setInterval(function addMoreNodes() {
  //   var newUpperBound = numberOfPointsToAddAtATime + currentPointRange[1];    
  //   if (newUpperBound >= maxNumberOfPoints) {
  //     clearInterval(intervalKey);
  //     return;
  //   }

  //   currentPointRange[0] = currentPointRange[1];
  //   currentPointRange[1] = newUpperBound;
  //   pointsInRange().forEach(quadtree.add);
  //   quadtree.setLabels();
  //   quadtreetree.update(quadtree);
  // },
  // pointAddingInterval);

  return {
    quadtreetree: quadtreetree,
    quadtree: quadtree
  };
}

var theExhibit = exhibitController();
