strokerouter
============

strokerouter lets you hook functions up to keystrokes. It abstracts D3 key event handling.

Usage
-----

    var docStrokeRouter = createStrokeRouter(d3.select(document));

    // Single key routes.
    docStrokeRouter.routeKeyUp('escape', null, function escape() {
      console.log('Escape pressed.');
    });
    docStrokeRouter.routeKeyUp('u', null, function u() {
      console.log('U pressed.');
    });


Now when the user hits Esc or U, a message will be logged to the console.

See also: [examples/basic.html](http://jimkang.com/strokerouter/examples/basic.html).

Requirements
------------
It depends on D3 v3.

Installation
------------

    npm install strokerouter


License
-------

MIT.
