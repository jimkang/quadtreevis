function createExhibitReporter(detailsBoxSelector) {
  var propertyWhitelist = [
    'leaf',
    'nodes',
    'point'
  ];
  var detailsBox = d3.select(detailsBoxSelector);

  function reportSelectedNode(quad) {
    var report = quadtreeNodeReport(quad.sourceNode);
    report = filterNodeProperties(report);
    detailsBox.text(JSON.stringify(report, null, '  '));
  }

  function filterNodeProperties(node) {
    var cleaned = _.pick(node, propertyWhitelist);
    if (cleaned.nodes) {
      cleaned.nodes = cleaned.nodes.map(function cleanNode(child) {
        return _.pick(child, propertyWhitelist);
      });
    }
    return cleaned;
  }

  function reportSelectedPt(point) {
    detailsBox.text(JSON.stringify(point));
  }

  return {
    reportSelectedNode: reportSelectedNode,
    reportSelectedPt: reportSelectedPt
  };
}
