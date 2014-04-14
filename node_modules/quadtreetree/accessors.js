var accessors = ((function accessors() {
  function accessorFunctor(property) {
    return function accessProperty(d) {
      return d[property];
    };
  }

  function translateFunctor(xProp, yProp) {
    return function translate(d) {
      return 'translate(' + d[xProp] + ',' + d[yProp] + ')';
    };
  }

  var cache = {
    accessorFunctor: accessorFunctor,
    translateFunctor: translateFunctor,
    
    id: accessorFunctor('id'),
    targetId: function targetId(d) {
      return d.target.id;
    },
    color: accessorFunctor('color'),
    translateToPosition0: translateFunctor('x0', 'y0'),
    translateToPosition: translateFunctor('x', 'y'),
    flipTranslateToPosition0: translateFunctor('y0', 'x0'),
    flipTranslateToPosition: translateFunctor('y', 'x'),
    ghost: accessorFunctor('ghost'),
    leaf: accessorFunctor('leaf')
  };

  return cache;
})());
