/**
 * @author Kate Compton
 */
define(["vis"], function(vis) {'use strict';

    return {
        createTree : function(root) {
            var nodeCount = 0;
            var edges = [];
            var nodes = [];

            console.log("Create tree");

            // compile all the nodes and edges
            function createNode(root) {
                var node = {
                    id : nodeCount,
                    label : root.toLabel(),
                };
                nodeCount++;
                return node;
            }

            function addTree(root, rootNode) {

                if (root.children) {
                    root.children.forEach(function(child) {
                        var childNode = createNode(child);

                        edges.push({
                            to : childNode.id,
                            from : rootNode.id
                        });

                        nodes.push(childNode);
                        addTree(child, childNode);

                    });
                }
            };

            var rootNode = createNode(root);
            nodes.push(rootNode);
            addTree(root, rootNode);

            // create a network
            var container = document.getElementById('infovis');
            var data = {
                nodes : nodes,
                edges : edges,
            };
            var options = {
                nodes : {
                    shape : 'box'
                },
                width : '800px',
                height : '400px'
            };
            var network = new vis.Network(container, data, options);

        }
    };
});
