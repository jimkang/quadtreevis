quadtreemap
===========

This is a browser module that renders a D3 [quadtree](https://github.com/mbostock/d3/wiki/Quadtree-Geom) as points and quads within quads. The points are the points in the quadtree, and the quads display the areas governed by each quadtree node.

Requirements
------------

It depends on D3 and [one-at](https://github.com/jimkang/one-at).

Installation
------------

    npm install quadtreemap

Usage
-----

HTML:

    <svg id="quadmap" width="98%" height="75%">
      <g id="quadroot"></g>
      <g id="pointroot"></g>
    </svg>

JavaScript:

    var quadmap = createQuadtreeMap({
      x: padding,
      y: padding,
      width: mapWidth,
      height: mapHeight,
      quadtree: quadtree,
      rootSelection: d3.select('#quadroot')
    });

    renderQuadtreePoints({
      points: displayedPoints(),
      rootSelection: d3.select('#pointroot'),
      x: padding,
      y: padding,
      width: mapWidth,
      height: mapHeight,
    });


Events
------

quadtreemap dispatches a couple of events if you want to listen for them.

**quadtreemap-quadSelected**

This event is dispatched when the user selects a quad. The event's `detail` object will be the quad, an object with the following properties:

    id
    x
    y
    width
    height
    depth
    quadtreenode

`quadtreenode` is the [quadtree](https://github.com/mbostock/d3/wiki/Quadtree-Geom) node. Example:

    document.addEventListener('quadtreemap-quadSelected', logSelectedQuad);
    function logSelectedQuad(e) {
      console.log(e.detail);
    }

**quadtreepoints-pointSelected**

This event is dispatched when the user selects a point. The event's `detail` object will be a two-element array containing the x and y values of the point.

Example
-------

See `example/index.html`. [There's a live version of it here.](http://jimkang.com/quadtreemap/example/)

License
-------

MIT.
