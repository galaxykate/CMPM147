/**
 * @author Kate Compton
 */

define([], function() {'use strict';
    function spacer(size) {
        var s = "";
        for (var i = 0; i < size * 3; i++) {
            s += " ";
        }
        return s;
    }

    // A tracery expansion node

    // Node
    var nodeCount = 0;

    function Node(parent, grammar, raw) {
        this.depth = 0;
        this.id = nodeCount;
        nodeCount++;

        this.raw = raw;

        if (parent) {
            this.depth = parent.depth + 1;
            this.parent = parent;
            this.grammar = parent.grammar;

        } else {

            this.grammar = grammar;

        }

        this.children = [];
        this.type = "unknown";
    };

    Node.prototype.expand = function() {

        if (!this.parent) {
            this.labelText = "root";
        }

        switch(this.type) {
            case 0:
                this.isLeaf = true;
                this.labelText = this.content;
                this.finalText = this.content;
                break;

            // symbol
            case 1:
                this.isLeaf = false;
                // console.log(spacer(this.depth) + "EXPAND " + this.symbol);
                this.labelText = this.content;

                this.rule = this.grammar.getRule(this.symbol).raw;
                if (!this.rule)
                    throw ("Can't find a rule for symbol '" + this.symbol + "'");
                this.parsed = tracery.parse(this.rule);
                this.labelText = this.symbol;
                this.expandChildren();

                this.compileFinalText();

                var text = this.childText;
                if (this.modifiers !== undefined) {
                    for (var i = 0; i < this.modifiers.length; i++) {
                        text = this.grammar.applyMod(this.modifiers[i], text);
                        console.log(this.modifiers[i] + "=>" + text);
                    }
                }

                this.finalText = text;
                break;

            // action
            case 2:
                this.isLeaf = false;
                console.log(spacer(this.depth) + "DO ACTION " + this.action);
                // Do the action
                switch(this.action) {
                    case "PUSH":
                        var target = this.grammar.addSymbol(this.target);

                        // Do the action
                        //   var expanded = this.grammar.expand(this.rule);
                        this.parsed = tracery.parse(this.rule);
                        this.expandChildren();

                        this.compileFinalText();

                        target.pushRules([this.childText]);
                        this.labelText = this.target + "=" + this.childText;
                        break;
                    case "DEFAULT":
                        break;
                    case "POP":
                        break;
                }

                this.finalText = "";
                break;

            default:
                this.isLeaf = false;
                console.log(spacer(this.depth) + "START TREE");
                this.parsed = tracery.parse(this.raw);
                this.expandChildren();
                this.compileFinalText();
                this.finalText = this.childText;
                break;
        };

    };

    Node.prototype.expandChildren = function() {

        var parent = this;
        // clear child nodes

        if (this.parsed) {
            //  console.log(spacer(this.depth) + "Create " + this.parsed.commands.length + " children");
            this.children = this.parsed.commands.map(function(command) {

                // create a new node
                var node = new Node(parent);
                //node.symbol = command.symbol;

                // Copy all the command stuff into the node
                $.extend(node, command);

                node.expand();
                return node;
            });
        } else {
            throw ("Can't make chidlren from non-parsed rule");
        }
    };

    Node.prototype.compileFinalText = function() {

        this.childText = "";

        if (this.isLeaf) {
            return this.finalText;
        }

        for (var i = 0; i < this.children.length; i++) {
            //    this.children[i].compileFinalText();
            this.childText += this.children[i].finalText;
        }

    };

    Node.prototype.toLabel = function() {
        if (this.labelText)
            return this.labelText;
        else
            return "root";
    };

    return Node;

});
