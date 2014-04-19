function createExhibitHelpers() {
  function elWidth(el) {
    var width = el.clientWidth;
    if (width < 1) {
      // This is necessary on Firefox.
      width = el.parentElement.clientWidth;
    }
    return width;
  }
  
  function elHeight(el) {    
    var height = el.clientHeight;
    if (height < 1) {
      // This is necessary on Firefox.
      height = el.parentElement.clientHeight;
    }
    return height;
  }

  function wrapInEventHandler(useEventDetail) {
    return function respondToEvent(e) {
      useEventDetail(e.detail);
    };
  }

  function respondToEventWithFn(eventName, fn) {
    document.addEventListener(eventName, wrapInEventHandler(fn));
  }
  
  function compose(f, g) {
    return function composed(x) {
      return g(f(x));
    };
  }

  function randomPointFunctor(pointFieldBounds) {
    return function randomPoint() {
      return [
        ~~(Math.random() * pointFieldBounds[0]),
        ~~(Math.random() * pointFieldBounds[1])
      ];
    };
  }

  function animateHalo(target) {
    var enterDuration = 700;
    var exitDuration = 1000;
    var originalRadius = +target.attr('r');
    var originalBorderWidth = target.style('stroke-width').replace('px', '');

    target.transition()
      .duration(enterDuration)
      .attr('r', originalRadius + 4)
      .style('stroke-width', 10);

    target.transition()
      .delay(enterDuration)
      .duration(exitDuration)
      .attr('r', originalRadius)
      .style('stroke-width', originalBorderWidth);
  }  

  return {
    elWidth: elWidth,
    elHeight: elHeight,
    wrapInEventHandler: wrapInEventHandler,
    respondToEventWithFn: respondToEventWithFn,
    compose: compose,
    randomPointFunctor: randomPointFunctor,
    animateHalo: animateHalo
  };
}
