function createPointKeeper(pointFieldBounds) {
  var helpers = exhibitHelpers();
  var currentPointRange = [0, 50];
  var numberOfPointsToAddAtATime = 50;
  var maxNumberOfPoints = 1000;
  // var pointAddingInterval = 8000;

  function randomPoint() {
    return [
      ~~(Math.random() * pointFieldBounds[0]),
      ~~(Math.random() * pointFieldBounds[1])
    ];
  }
  
  var points = d3.range(maxNumberOfPoints).map(randomPoint);

  function pointsInRange() {
    return points.slice(currentPointRange[0], currentPointRange[1]);
  }

  function shiftRange(delta) {
    currentPointRange[0] += delta;
    currentPointRange[1] += delta;
  }

  return {
    pointsInRange: pointsInRange,
    shiftRange: shiftRange
  };
}