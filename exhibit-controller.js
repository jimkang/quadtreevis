function exhibitController() {
  var points = [];
  var currentPointRange = [0, 50];
  var numberOfPointsToAddAtATime = 50;
  var pointAddingInterval = 8000;
  var maxNumberOfPoints = 1000;
  var detailsBox = d3.select('.details-box');

  function captureElDimensions(selector) {
    var el = document.querySelector(selector);

    var width = el.clientWidth;
    if (width < 1) {
      // This is necessary on Firefox.
      width = el.parentElement.clientWidth;
    }

    var height = el.clientHeight;
    if (height < 1) {
      // This is necessary on Firefox.
      height = el.parentElement.clientHeight;
    }

    return [width, height];
  }

  var treeBoardDimensions = captureElDimensions('#quadtreetree');
  var mapBoardDimensions = captureElDimensions('#quadtreemap');

  function createPointRandomly() {
    return [
      ~~(Math.random() * mapBoardDimensions[0]),
      ~~(Math.random() * mapBoardDimensions[1])
    ];
  }

  function pointsInRange() {
    return points.slice(currentPointRange[0], currentPointRange[1]);
  }

  points = d3.range(maxNumberOfPoints).map(createPointRandomly);
  var quadtree = exampleQuadtree(mapBoardDimensions[0], 
    mapBoardDimensions[1], pointsInRange());

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
    points: pointsInRange(),
    rootSelection: d3.select('#pointroot'),
    x: 0,
    y: 0,
    width: treeBoardDimensions[0], 
    height: treeBoardDimensions[1],
  });

  var camera = createCamera('#quadtreetree', '#treeroot', [0.025, 2]);

  document.addEventListener('quadtreetree-dotsEntered', zoomToDots);

  function zoomToDots(event) {
    var dots = event.detail;
    // Pan to one of the new dots.
    setTimeout(function pan() {
      camera.panToElement(dots, 750);
    },
    750);
  }

  document.addEventListener('quadtreetree-nodeSelected', reportSelectedNode);

  function reportSelectedNode(e) {
    var report = quadtreeNodeReport(e.detail.sourceNode);
    report = dropQuadtreetreeSpecifics(report);
    detailsBox.text(JSON.stringify(report, null, '  '));
  }

  function dropQuadtreetreeSpecifics(node) {
    var cleaned = _.omit(node, 'label', 'color');
    cleaned.nodes = cleaned.nodes.map(function cleanNode(child) {
      return _.omit(child, 'label', 'color');
    });
    return cleaned;
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
