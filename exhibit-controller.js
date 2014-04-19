function exhibitController() {
  var helpers = createExhibitHelpers();
  var reporter = createExhibitReporter('.details-box');

  var wideMapBoard = document.querySelector('#widemap');
  var sidebysideMapBoard = document.querySelector('#sidebysidemap');

  var randomPoint = helpers.randomPointFunctor([
    helpers.elWidth(wideMapBoard),
    helpers.elHeight(wideMapBoard)
  ]);
  var points = d3.range(100).map(randomPoint);

  var quadtree = exampleQuadtree(
    helpers.elWidth(wideMapBoard), helpers.elHeight(wideMapBoard), 
    points);

  var quadtreeDisplayGroups = {
    wide: {
      map: createQuadtreeMap({
        x: 0,
        y: 0,
        width: helpers.elWidth(wideMapBoard),
        height: helpers.elHeight(wideMapBoard),
        quadtree: quadtree,
        quadRootSelection: d3.select('#widemap .quadroot'),
        pointRootSelection: d3.select('#widemap .pointroot'),
        name: 'wide'
      }),
      tree: createQuadtreetree({
        rootSelector: '#widetree .treeroot',
        vertical: true,
        name: 'wide'
      }),
      treeCamera: createCamera('#widetree', '#widetree .treeroot', [0.025, 2])
    },
    sideBySide: {
      map: createQuadtreeMap({
        x: 0,
        y: 0,
        width: helpers.elWidth(sidebysideMapBoard),
        height: helpers.elHeight(sidebysideMapBoard),
        quadtree: quadtree,
        quadRootSelection: d3.select('#sidebysidemap .quadroot'),
        pointRootSelection: d3.select('#sidebysidemap .pointroot'),
        name: 'sideBySide'
      }),
      tree: createQuadtreetree({
        rootSelector: '#sidebysidetree .treeroot',
        vertical: true,
        name: 'sideBySide'
      }),
      treeCamera: createCamera(
        '#sidebysidetree', '#sidebysidetree .treeroot', [0.025, 2])
    }
  };

  helpers.respondToEventWithFn('quadtreetree-dotsEntered', zoomToDots);
  helpers.respondToEventWithFn('quadtreetree-nodeSelected', 
    helpers.compose(syncMapToTreeSelection, reporter.reportSelectedNode));
  helpers.respondToEventWithFn('quadtreemap-quadSelected', 
    helpers.compose(syncTreeToMapSelection, reporter.reportSelectedNode));
  helpers.respondToEventWithFn('quadtreemap-pointSelected', 
    helpers.compose(syncTreeToMapSelection, reporter.reportSelectedNode));

  function zoomToDots(info) {
    var dots = info.entrants;

    var camera = quadtreeDisplayGroups[info.emitterName].treeCamera;
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

  function syncMapToTreeSelection(eventInfo) {
    var selectedQuadNode = eventInfo.layoutNode;
    if (!selectedQuadNode.ghost) {
      var treeNode = selectedQuadNode.sourceNode;
      var mapRenderers = _.pluck(_.pluck(quadtreeDisplayGroups, 'map'),
        selectedQuadNode.leaf ? 'pointRenderer' : 'quadRenderer');

      mapRenderers.forEach(function selectMapNode(renderer) {
        var correspondingMapId = renderer.labeler.elementIdForNode(treeNode);
        renderer.selectElExclusively(correspondingMapId);
        helpers.animateHalo(d3.select('#' + correspondingMapId));
      });
    }

    return selectedQuadNode;
  }

  function syncTreeToMapSelection(eventInfo) {
    var selectedMapNode = eventInfo.quad;

    if (!selectedMapNode.ghost) {
      var treeNode = selectedMapNode.sourceNode;
      var renderers = _.pluck(quadtreeDisplayGroups, 'tree');

      _.each(quadtreeDisplayGroups, function selectTreeNode(displayGroup) {
        var renderer = displayGroup.tree;
        var correspondingTreeId = renderer.labeler.elementIdForNode(treeNode);
        renderer.selectElementExclusively(correspondingTreeId);
        displayGroup.treeCamera.panToElement({
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

  ((function renderDisplayGroups() {
    _.each(quadtreeDisplayGroups, function renderGroup(displayGroup) {
      displayGroup.tree.update(quadtree);
      displayGroup.map.render();
    });
  })());

  function addRandomPoint() {
    points.push(randomPoint());
  }

  function addPoints() {
    d3.range(100).forEach(addRandomPoint);
    var newPoints = points.slice(points.length - 100, points.length);
    newPoints.forEach(quadtree.add);

    quadtree.updateNodes();
    renderDisplayGroups()
  }

  function deleteSelectedPoint() {
    var selected = d3.select('.selected.dot');
    if (!selected.empty()) {
      var node = selected.datum().sourceNode;
      quadtree.remove(node.point);

      quadtree.updateNodes();
      // renderDisplayGroups()

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
