function exhibitController() {
  var points = [];
  var currentPointRange = [0, 50];
  var numberOfPointsToAddAtATime = 50;
  var pointAddingInterval = 8000;
  var maxNumberOfPoints = 1000;
  var padding = 8;
  var detailsBox = d3.select('.details-box');
  var boardWidth = 0;
  var boardHeight = 0;

  ((function captureBoardDimensions() {
    var boardEl = d3.select('#quadtreetree').node();

    boardWidth = boardEl.clientWidth;
    if (boardWidth < 1) {
      // This is necessary on Firefox.
      boardWidth = boardEl.parentElement.clientWidth;
    }

    boardHeight = boardEl.clientHeight;
    if (boardHeight < 1) {
      // This is necessary on Firefox.
      boardHeight = boardEl.parentElement.clientHeight;
    }

    boardWidth -= (2 * padding);
    boardHeight -= (2 * padding);
  })());

  function createPointRandomly() {
    return [
      ~~(Math.random() * boardWidth),
      ~~(Math.random() * boardHeight)
    ];
  }

  function pointsInRange() {
    return points.slice(currentPointRange[0], currentPointRange[1]);
  }

  points = d3.range(maxNumberOfPoints).map(createPointRandomly);
  var quadtree = exampleQuadtree(boardWidth, boardHeight, pointsInRange());

  var quadtreetree = createQuadtreetree({
    rootSelector: '#treeroot',
    vertical: true
  });

  var quadmap = createQuadtreeMap({
    x: padding, 
    y: padding, 
    width: boardWidth, 
    height: boardHeight, 
    quadtree: quadtree, 
    rootSelection: d3.select('#quadroot')
  });

  renderQuadtreePoints({
    points: pointsInRange(),
    rootSelection: d3.select('#pointroot'),
    x: padding,
    y: padding,
    width: boardWidth, 
    height: boardHeight,
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
