var assert = require('assert');
var createQuadtreeLabeler = require('./quadtreeLabeler').createQuadtreeLabeler;

// Mocks of quadtree.visit() callback params.
var visits = {
  quadA: {
    node: {
      leaf: false,
      point: null,
    },
    x1: 0,
    y1: 0,
    x2: 8,
    y2: 8    
  },
  quadB: {
    node: {
      leaf: false,
      point: null,
    },
    x1: 8,
    y1: 0,
    x2: 16,
    y2: 8    
  },
  pointA: {
    node: {
      leaf: true,
      point: [5, 5]
    },
    x1: 4,
    y1: 4,
    x2: 8,
    y2: 8
  },
  pointB: {
    node: {
      leaf: true,
      point: [11, 10]
    },
    x1: 8,
    y1: 8,
    x2: 12,
    y2: 16
  }
};

// Mock DOM elements.
var elements = {
  elementA: {
    '__data__': {
      label: 'quad_4_4'
    }
  }
};

((function labelSuite() {
  var labeler = createQuadtreeLabeler('bonus-');
  assert.equal(typeof labeler, 'object', 
    'createQuadtreeLabeler should return an object');

  var quadALabel = labeler.label(visits.quadA.node, 
    visits.quadA.x1, visits.quadA.y1, visits.quadA.x2, visits.quadA.y2);
  assert.equal(quadALabel, 'quad_4_4');

  var quadBLabel = labeler.label(visits.quadB.node, 
    visits.quadB.x1, visits.quadB.y1, visits.quadB.x2, visits.quadB.y2);
  assert.equal(quadBLabel, 'quad_12_4');

  var pointALabel = labeler.label(visits.pointA.node, 
    visits.pointA.x1, visits.pointA.y1, visits.pointA.x2, visits.pointA.y2);
  assert.equal(pointALabel, 'point_5_5');

  var pointBLabel = labeler.label(visits.pointB.node, 
    visits.pointB.x1, visits.pointB.y1, visits.pointB.x2, visits.pointB.y2);
  assert.equal(pointBLabel, 'point_11_10');

  labeler.setLabelOnNode(visits.quadB.node, 
    visits.quadB.x1, visits.quadB.y1, visits.quadB.x2, visits.quadB.y2);
  assert.equal(visits.quadB.node.label, 'quad_12_4');

})());

((function idSuite() {
  var labeler = createQuadtreeLabeler('bonus-');

  var id = labeler.elementIdForLabel('cat');
  assert.equal(id, 'bonus-cat');

  var quadBId = labeler.elementIdForNode(visits.quadB.node);
  assert.equal(quadBId, 'bonus-' + visits.quadB.node.label);

  var arbitraryLabel = labeler.elementIdForLabel('treats');
  assert.equal(arbitraryLabel, 'bonus-treats'); 
})());

((function translateSuite() {
  var bonusLabeler = createQuadtreeLabeler('bonus-');
  var wilyLabeler = createQuadtreeLabeler('wily-');

  var labelA = bonusLabeler.labelFromEl(elements.elementA);
  assert.equal(labelA, 'quad_4_4', 'labelFromEl didn\'t get the right label.');
  visits.quadA.node.label = labelA;

  elements.elementA.id = bonusLabeler.elementIdForNode(visits.quadA.node);
  assert.equal(elements.elementA.id, 'bonus-quad_4_4');

  var translatedId = 
    wilyLabeler.translateIdForForeignQuadtreeEl(elements.elementA);
  assert.equal(translatedId, 'wily-quad_4_4');

})());



console.log('Done!');

