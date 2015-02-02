/**
 * @author Kate Compton
 */
define(["vis"], function(vis) {'use strict';

    var NodeDiv = Class.extend({
        init : function(node, holder) {
            

            if (node.isLeaf) {
                this.div = $("<div/>", {
                    class : "leaf nodeHolder",
                    html : node.toLabel(),
                });
                holder.append(this.div);

            } else {

                this.div = $("<div/>", {
                    class : "nodeHolder",
                });

                this.label = $("<div/>", {
                    class : "nodeLabel",
                    html : node.toLabel(),
                });

                holder.append(this.div);
                this.div.append(this.label);

                if (node.action) {
                    this.div.addClass(node.action.toLowerCase() + "Action");
                }

                // add modifiers
                if (node.modifiers && node.modifiers.length > 0) {

                    this.modHolder = $("<div/>", {
                        class : "modifierHolder",

                        html : node.modifiers.join(",")
                    });

                    this.div.append(this.modHolder);
                }

                // create all the children
                if (node.children && node.children.length > 0) {
                    this.childHolder = $("<div/>", {
                        class : "childHolder"
                    });

                    this.div.append(this.childHolder);

                    for (var i = 0; i < node.children.length; i++) {
                        var child = new NodeDiv(node.children[i], this.childHolder);

                    }
                }
            }

            this.div.click(function() {
                console.log("Reroll " + node);
                console.log(node);
                return false;
            });
        }
    });

    return {
        createTree : function(root, div) {
            console.log("Create node");
            console.log(root);
            var rootDiv = new NodeDiv(root, div);
            root.compileFinalText();

            if (rootDiv.label)
                rootDiv.label.html(root.finalText);
        }
    };
});
