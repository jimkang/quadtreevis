function createExhibitReporter(detailsBoxSelector) {
  var detailsBox = d3.select(detailsBoxSelector);

  function reportSelectedNode(quad) {
    var report = quadtreeNodeReport(quad.sourceNode);
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

  function reportSelectedQuad(quad) {
    var report = quadtreeNodeReport(quad.sourceNode);
    detailsBox.text(JSON.stringify(report, null, '  '));
  }

  function reportSelectedPt(point) {
    detailsBox.text(JSON.stringify(point));
  }

  return {
    reportSelectedNode: reportSelectedNode,
    reportSelectedQuad: reportSelectedQuad,
    reportSelectedPt: reportSelectedPt
  };
}
