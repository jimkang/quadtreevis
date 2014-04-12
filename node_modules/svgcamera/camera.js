function createCamera(svgSelString, rootGroupSelString, scaleExtent) {

var camera = {
  board: d3.select(svgSelString), 
  root: d3.select(rootGroupSelString),  
  zoomBehavior: null,
  scaleExtent: scaleExtent,
  translate: [0, 0],
  scale: 1.0
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

function translateXFromSel(sel) {
  return sel.attr('transform').split(',')[0].split('.')[0].split('(')[1];
}

function translateYFromSel(sel) {
  return sel.attr('transform').split(',')[1].split('.')[0];
}

// This function applies the zoom changes to the <g> element rather than
// the <svg> element because <svg>s do not have a transform attribute. 
// The behavior is connected to the <svg> rather than the <g> because then
// dragging-to-pan doesn't work otherwise. Maybe something cannot be 
// transformed while it is receiving drag events?
camera.syncZoomEventToTransform = function syncZoomEventToTransform() {
  this.updateTransform(d3.event.translate, d3.event.scale);
};

camera.updateTransform = function updateTransform(translate, scale) {
  this.translate = translate;
  this.scale = scale;
  this.root.attr('transform', 
    'translate(' + this.translate + ')' + ' scale(' + this.scale + ')');
};

// This method only works on elements that use transforms to position themselves.
camera.panToElement = function panToElement(opts, done) {
  if (!opts.duration) {
    opts.duration = 300;
  }
  if (!opts.scale) {
    opts.scale = this.scale;
  }
  var x = parseInt(translateXFromSel(opts.focusElementSel), 10) * opts.scale;
  var y = parseInt(translateYFromSel(opts.focusElementSel), 10) * opts.scale;

  this.panToCenterOnRect({
    rect: {
      x: x,
      y: y,
      width: 1,
      height: 1
    },
    duration: opts.duration,
    scale: opts.scale
  },
  done);
};

// Expects this.scale to be set.
camera.panToCenterOnRect = function panToCenterOnRect(opts, done) {
  if (!opts.duration) {
    opts.duration = 300;
  }
  if (!opts.scale) {
    opts.scale = this.scale;
  }

  var boardWidth = getActualWidth(this.board.node());
  var boardHeight = getActualHeight(this.board.node());

  this.tweenToZoom(opts.scale, 
    [(-opts.rect.x - opts.rect.width/2 + boardWidth/2), 
    (-opts.rect.y - opts.rect.height/2 + boardHeight/2)], 
    opts.duration,
    done
  );
};

// translate should be a two-element array corresponding to x and y in 
// the translation.
// Expects this.scale and this.translate to be set.
camera.tweenToZoom = function tweenToZoom(scale, translate, time, done) {
  function createZoomExecutor() {
    var interpolateScale = d3.interpolate(this.scale, scale);
    var interpolateTranslation = d3.interpolate(this.translate, translate);

    function executeZoomForTimeStep(t) {
      // Update the behavior so that the next time it is altered, it proceeds 
      // from this state instead of from the last time the mouse was moved.
      var currentScale = interpolateScale(t);
      this.zoomBehavior.scale(currentScale);
      var currentTranslate = interpolateTranslation(t);
      this.zoomBehavior.translate(currentTranslate);

      // Update the transform to make the changes in scale and translation 
      // appear.
      this.updateTransform(currentTranslate, currentScale);
    }

    return executeZoomForTimeStep.bind(this);
  }

  var tween = d3.transition().duration(time).tween('zoom', 
    createZoomExecutor.bind(this));

  if (done) {
    tween.each('end', done);
  }
};


function init() {
  var width = getActualWidth(camera.board.node());
  var height = getActualHeight(camera.board.node());

  var x = d3.scale.identity().domain([0, width]);
  var y = d3.scale.linear().domain([0, height]).range([height, 0]);

  camera.zoomBehavior = d3.behavior.zoom().x(x).y(y)
    .scaleExtent(camera.scaleExtent)
    .on('zoom', camera.syncZoomEventToTransform.bind(camera));
  
  // When zoom and pan gestures happen inside of the board SVG, have it call the 
  // zoom function to make changes.
  camera.board.call(camera.zoomBehavior);
}

init();

return camera;
}
