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
  
  return {
    captureElDimensions: captureElDimensions,
    wrapInEventHandler: wrapInEventHandler,
    respondToEventWithFn: respondToEventWithFn
  };
}
