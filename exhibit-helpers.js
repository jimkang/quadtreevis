function exhibitHelpers() {
  function captureElDimensions(selector) {
    var el = document.querySelector(selector);

    var width = el.clientWidth;
    if (width < 1) {
      // This is necessary on Firefox.
      width = el.parentElement.clientWidth;
    }

    var height = el.clientHeight;
    if (height < 1) {
      // This is necessary on Firefox.
      height = el.parentElement.clientHeight;
    }

    return [width, height];
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

  return {
    captureElDimensions: captureElDimensions,
    wrapInEventHandler: wrapInEventHandler,
    respondToEventWithFn: respondToEventWithFn,
    compose: compose,
    randomPointFunctor: randomPointFunctor
  };
}
