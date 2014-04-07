function quadtreeToLayoutTree(quadtree) {
  var idmaker = createIdmaker();

  var layoutNode = {
    id: 'tree_' + quadtree.label,
    color: quadtree.color,
    children: [],
    x0: 0,
    y0: 0,
    sourceNode: quadtree
  };

  for (var i = 0; i < quadtree.nodes.length; ++i) {
    var child = quadtree.nodes[i];
    if (!child) {
      child = {
        label: 'unset_' + idmaker.randomId(4),
        // title: 'Not set',
        color: 'white',
        nodes: []
      };
    }

    layoutNode.children.push(quadtreeToLayoutTree(child));
  }

  return layoutNode;
}
