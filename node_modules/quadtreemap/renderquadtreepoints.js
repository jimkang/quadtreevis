function renderQuadtreePoints(opts) {
  // opts should contain:
  // 
  // {
  //   points: array of 2-element arrays, representing a point,
  //   rootSelection: [D3 selection of a <g> under which to render the points],
  //   x: number (left bound of the points),
  //   y: number (top bound of the points),
  //   width: number (total width of the points field), 
  //   height: number (total width of the points field),
  // }  
  // 
  // This function will try to keep the labels in the field defined by x, y, 
  // width, and height, but it will not box in points.

  var estimatedLabelWidth = 40;
  var estimatedLabelHeight = 15;
  var oneAtATimeSelector = createOneAt('selected');
  var labeler = createQuadtreeLabeler('map-');

  function pointToNode(pt) {
    return {
      leaf: true,
      point: pt
    };
  }
  
  function selectPoint(d) {
    oneAtATimeSelector.selectElementWithId(labeler.elementIdForNode(d));
    var event = new CustomEvent('quadtreemap-pointSelected', {detail: d});
    document.dispatchEvent(event);
  }

  var nodes = opts.points.map(pointToNode);
  nodes.forEach(labeler.setLabelOnNode);

  var dots = opts.rootSelection.selectAll('.point').data(nodes);

  dots.enter().append('circle').attr({
    id: labeler.elementIdForNode,
    r: 3,
    class: 'dot'
  })
  .on('click', selectPoint);

  dots.attr({
    cx: function cx(d) { return d.point[0] + opts.x; },
    cy: function cy(d) { return d.point[1] + opts.y; },
  });

  return {
    selectPointElExclusively: oneAtATimeSelector.selectElementWithId
  };
}
