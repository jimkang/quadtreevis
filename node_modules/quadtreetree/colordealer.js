function ColorDealer() {
  function pointColorForIndex(index) {
    var hueBase = index % 20;
    var hueDistBetweenIndexes = 300/20;
    // Shift the hueBase for even numbers so that indexes that are right next 
    // to each other get very different colors.
    if (hueBase % 2 === 0) {
      hueBase += 10;
      hueBase = hueBase % 20;
    }
    return 'hsla(' + (hueBase * hueDistBetweenIndexes) + ', 90%, 50%, 1.0)';
  }

  function quadColorForIndex(index) {
    var hueBase = index % 20;
    var hueDistBetweenIndexes = 300/20;
    return 'hsla(' + (hueBase * hueDistBetweenIndexes) + ', 50%, 60%, 0.9)';
  }

  return {
    pointColorForIndex: pointColorForIndex,
    quadColorForIndex: quadColorForIndex
  }
}
