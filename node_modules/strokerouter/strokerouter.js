function createStrokeRouter(sourceSelection) {

var router = {
  sourceSelection: sourceSelection,
  keyUpRespondersForKeyIds: {},
  keyDownRespondersForKeyIds: {},
  enable: true,
  stopPropIfResponderFound: true,
  absorbAllKeyUpEvents: false,
  absorbAllKeyDownEvents: false,
};

router.keyCodesForNames = {
  backspace: 8,
  tab: 9,
  enter: 13,
  escape: 27,
  space: 32,
  pageUp: 33,
  pageDown: 34,
  end: 35,
  home: 36,
  leftArrow: 37,
  upArrow: 38,
  rightArrow: 39,
  downArrow: 40,
  insert: 45,
  delete: 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  semicolon: 186,
  equal: 187,
  comma: 188,
  dash: 189,
  period: 190,
  forwardSlash: 191,
  graveAccent: 192,
  openBracket: 219,
  backslash: 220,
  closeBracket: 221,
  singleQuote: 222
};

router.routeKeyUp = function routeKeyUp(keyName, modifiers, responder) {
  var keyId = getKeyId(this.keyCodesForNames[keyName], modifiers);
  this.keyUpRespondersForKeyIds[keyId] = responder;
};

router.routeKeyDown = function routeKeyDown(keyName, modifiers, responder) {
  var keyId = getKeyId(this.keyCodesForNames[keyName], modifiers);
  this.keyDownRespondersForKeyIds[keyId] = responder;
};

function getKeyId(keyCode, modifiers) {
  var keyId = keyCode;
  if (modifiers) {
    keyId = modifiers.reduce(addModifierMask, keyCode);
  }
  return keyId;
}

function listModifiersInEvent(event) {
  var modifiers = [];
  if (event.metaKey) {
    modifiers.push('meta');
  }
  if (event.ctrlKey) {
    modifiers.push('ctrl');
  }
  if (event.shiftKey) {
    modifiers.push('shift');
  }
  if (event.altKey) {
    modifiers.push('alt');
  }
  return modifiers;
}

function addModifierMask(currentValue, modifierString) {
  var newValue = currentValue;
  switch (modifierString) {
    case 'meta':
      newValue += 1000;
      break;
    case 'ctrl':
      newValue += 10000;
      break;
    case 'shift':
      newValue += 100000;
      break;
    case 'alt':
      newValue += 1000000;
      break;
  }
  return newValue;
}

router.onKeyUp = function onKeyUp() {
  if (this.enable) {
    if (this.absorbAllKeyUpEvents) {
      d3.event.stopPropagation();
    }
    var keyId = getKeyId(d3.event.which, listModifiersInEvent(d3.event));
    if (keyId in this.keyUpRespondersForKeyIds) {
      if (this.stopPropIfResponderFound) {
        d3.event.stopPropagation();
      }
      this.keyUpRespondersForKeyIds[keyId]();
    }
  }
};


router.onKeyDown = function onKeyDown() {
  if (this.enable) {
    if (this.absorbAllKeyDownEvents) {
      d3.event.stopPropagation();
    }
    var keyId = getKeyId(d3.event.which, listModifiersInEvent(d3.event));
    if (keyId in this.keyDownRespondersForKeyIds) {
      if (this.stopPropIfResponderFound) {
        d3.event.stopPropagation();
      }
      this.keyDownRespondersForKeyIds[keyId]();
    }
  }
};

function init() {
  this.sourceSelection.on('keyup', this.onKeyUp.bind(this));  
  this.sourceSelection.on('keydown', this.onKeyDown.bind(this));  
}

init.bind(router)();

return router;
}
