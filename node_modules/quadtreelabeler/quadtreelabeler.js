function createQuadtreeLabeler(prefix) {
  function label(node, x1, y1, x2, y2) {
    var theLabel;
    if (node.leaf) {
      theLabel = 'point-' + node.point[0] + '-' + node.point[1];
    }
    else {
      theLabel = ('quad-' + (x1 + x2)/2 + '-' + (y1 + y2)/2);
    }
    theLabel = theLabel.replace(/\./g, '_');
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

  return {
    label: label,
    setLabelOnNode: setLabelOnNode,
    elementIdForLabel: elementIdForLabel,
    elementIdForNode: elementIdForNode
  };
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports.createQuadtreeLabeler = createQuadtreeLabeler;
}

