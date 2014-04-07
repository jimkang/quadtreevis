quadtreetree
============

This is a browser module that renders a D3 [quadtree](https://github.com/mbostock/d3/wiki/Quadtree-Geom)'s nodes in a [tree layout](https://github.com/mbostock/d3/wiki/Tree-Layout).

Requirements
------------

It depends on D3 and [Underscore](http://underscorejs.org/) or [Lo-Dash](http://lodash.com/).

Installation
------------

    npm install quadtreetree

Usage
-----

HTML:

    <svg id="quadtreetree" width="98%" height="75%">
      <g id="treeroot"></g>
    </svg>


JavaScript:

    var quadtreetree = createQuadtreetree({
      rootSelector: '#treeroot',
      vertical: true
    });

    // Call this whenever the quadtree is updated and you want to update
    // quadtreetree's rendering of it.
    quadtreetree.update(quadtree);

Events
------

quadtreetree dispatches a couple of events if you want to listen for them.

**quadtreetree-nodeSelected**

This event is dispatched when the user selects a node. The event's `detail` object will be the selected [tree layout](https://github.com/mbostock/d3/wiki/Tree-Layout) node (not the [quadtree](https://github.com/mbostock/d3/wiki/Quadtree-Geom) node). However, it will contain the _quadtree_ node in a property called `sourceNode`. Example:

    document.addEventListener('quadtreetree-nodeSelected', logSelectedNode);

    function logSelectedNode(e) {
      console.log(e.detail.sourceNode);
    }

**quadtreetree-dotsEntered**

This event is dispatched when new nodes are rendered as dots in the tree layout. The event's `detail` object will be a D3 [selection](https://github.com/mbostock/d3/wiki/Selections) of the newly added layout tree nodes.

Example
-------

See `example/index.html`. [There's a live version of it here.](http://jimkang.com/quadtreetree/example/)

License
-------

MIT.
