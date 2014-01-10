camera
======

This is a browser module that adds mouse/touch-driven zooming and panning to an SVG element. It adds a sets up a D3 zoom behavior and responds to the zoom event from it by setting the transform on the SVG group element appropriately.

Requirements
------------
It depends on D3 v3 and a SVG hierarchy that includes an <svg> element as well as a <g> element under it that contains everything you want to be subject to zoom and pan.

Installation
------------

    npm install svgcamera

Usage
-----

HTML:

    <svg id="board" width="45%" height="80%">
      <g id="zoomablelayer"></g>
    </svg>

JavaScript:

    // After the <svg> is done with any sizing, create the camera, setting the 
    // zoom in limit to 1 and zoom out limit to four times smaller than normal.
    var camera = createCamera('#board', '#zoomablelayer', [0.25, 1]);

Now the user can pan by clicking and dragging or zoom with the mouse wheel or pinch gestures.

To pan to an element (that uses the transform attribute for positioning):

    camera.panToElement(d3.select('#the-target'), 750);

See also: [example/example.html](http://jimkang.com/camera/example/example.html).

License
-------

MIT.
