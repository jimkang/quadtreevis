function createQuadtreeLabeler(prefix) {
  function label(node, x1, y1, x2, y2) {
    var theLabel;
    if (node.leaf) {
      theLabel = 'point_' + node.point[0] + '_' + node.point[1];
    }
    else {
      theLabel = ('quad_' + (x1 + x2)/2 + '_' + (y1 + y2)/2);
    }
    return theLabel;
  }

  function setLabelOnNode(node, x1, y1, x2, y2) {
    node.label = label(node, x1, y1, x2, y2);
  }

  function elementIdForLabel(label) {
    return prefix + label;
  }

  function elementIdForNode(node) {
    return elementIdForLabel(node.label);
  }

  function labelFromEl(el) {
    return el.__data__.label;
  }

  function translateIdForForeignQuadtreeEl(el) {
    var label = labelFromEl(el);
    return elementIdForLabel(label);
  }

  return {
    label: label,
    setLabelOnNode: setLabelOnNode,
    elementIdForLabel: elementIdForLabel,
    elementIdForNode: elementIdForNode,
    labelFromEl: labelFromEl,
    translateIdForForeignQuadtreeEl: translateIdForForeignQuadtreeEl
  };
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports.createQuadtreeLabeler = createQuadtreeLabeler;
}

