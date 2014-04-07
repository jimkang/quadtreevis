one-at
======

one-at lets you apply a CSS class to one selected element and one element only. When you use it to select a different element, it will "unselect" the previous element by removing the css class.

Usage
-----

    var oneAtATimeSelector = createOneAt('selected');

    d3.selectAll('.map-node').on('click', function selectNode(d) {
      oneAtATimeSelector.selectElementWithId(d.id);
    });

In this example, when an element is clicked, one-at will add the `selected` class to the element and remove the `selected` class from the previously selected element. The `selected` class can be defined in CSS to distinguish it from the rest of the elements.

    .selected {
      background-color: yellow;
    }

Installation
------------

    npm install one-at

License
-------

MIT.
