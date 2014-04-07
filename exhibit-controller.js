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

  renderQuadtreePoints({
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
    reporter.reportSelectedNode);
  helpers.respondToEventWithFn('quadtreemap-quadSelected', 
    reporter.reportSelectedQuad);
  helpers.respondToEventWithFn('quadtreemap-pointSelected', 
    reporter.reportSelectedPt);

  function zoomToDots(dots) {
    setTimeout(function pan() {
      camera.panToElement(dots, 750);
    },
    750);
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
