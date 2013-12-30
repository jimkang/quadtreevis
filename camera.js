function createCamera(svgSelString, rootGroupSelString, scaleExtent) {

var camera = {
  board: d3.select(svgSelString), 
  root: d3.select(rootGroupSelString),  
  zoomBehavior: null,
  scaleExtent: scaleExtent,
  translate: null,
  scale: null
};

camera.init = function init() {
  var width = getActualWidth(this.board.node());
  var height = getActualHeight(this.board.node());

  var x = d3.scale.identity().domain([0, width]);
  var y = d3.scale.linear().domain([0, height]).range([height, 0]);

  this.zoomBehavior = d3.behavior.zoom().x(x).y(y)
    .scaleExtent(this.scaleExtent)
    .on('zoom', this.syncZoomEventToTransform.bind(this));
  
  // When zoom and pan gestures happen inside of the board SVG, have it call the 
  // zoom function to make changes.
  this.board.call(this.zoomBehavior);
};

function getActualHeight(el) {
  var height = el.clientHeight;
  if (height < 1) {
    // Firefox doesn't have client heights for SVG elements.
    height = el.parentNode.clientHeight;
  }
  return height;
}

function getActualWidth(el) {
  var height = el.clientWidth;
  if (height < 1) {
    // Firefox doesn't have client heights for SVG elements.
    height = el.parentNode.clientWidth;
  }
  return height;
}

  // This function applies the zoom changes to the <g> element rather than
  // the <svg> element because <svg>s do not have a transform attribute. 
  // The behavior is connected to the <svg> rather than the <g> because then
  // dragging-to-pan doesn't work otherwise. Maybe something cannot be 
  // transformed while it is receiving drag events?
camera.syncZoomEventToTransform = function syncZoomEventToTransform() {
  this.translate = d3.event.translate;
  this.scale = d3.event.scale;
  this.root.attr('transform', 
    'translate(' + this.translate + ')' + ' scale(' + this.scale + ')');
};

camera.applyCurrentTransform = function applyCurrentTransform(point) {
  if (!this.scale || !this.translate) {
    return point;
  }
  return [
    point[0] * this.scale + this.translate[0],
    point[1] * this.scale + this.translate[1]
  ];
};

return camera;
}
