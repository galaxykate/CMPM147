/**
 * @author Kate Compton
 */

define(["./modifiers", "./node"], function(universalModifiers, Node) {'use strict';

    function getRandom(array, condition) {

        var tries = 0;
        var found, index;

        index = Math.floor(Math.random() * array.length);
        found = array[index];

        return found;
    }

    function spacer(size) {
        var s = "";
        for (var i = 0; i < size; i++) {
            s += " ";
        }
        return s;
    }

    //========================================================
    //========================================================
    //========================================================
    //========================================================
    //========================================================
    // Symbols

    function wrapRules(rawRules) {

        var rules = rawRules.map(function(raw) {
            return {
                raw : raw
            };
        });
        return rules;
    };

    function addRawToArray(array, rawRules) {
        array.push.apply(array, wrapRules(rawRules));
    };

    function Symbol(key) {
        this.key = key;

        this.baseRules = [];
        this.overrides = [];
        this.level = -1;

    };

    Symbol.prototype.getRuleSet = function() {
        if (this.level < 0)
            return this.baseRules;
        else
            return this.overrides[this.level];
    };

    Symbol.prototype.addRules = function(rawRules) {
        addRawToArray(this.baseRules, rawRules);

    };

    Symbol.prototype.pushRules = function(rawRules) {
       
        this.level++;
        this.overrides[this.level] = [];
        addRawToArray(this.overrides[this.level], rawRules);
        this.getRuleSet();
      
    };

    Symbol.prototype.getRule = function() {

        return getRandom(this.getRuleSet());
    };

    //========================================================
    //========================================================
    //========================================================
    //========================================================
    //========================================================

    function Grammar() {
        this.symbols = {};

        this.modifiers = {};
        for (var mod in universalModifiers) {
            if (universalModifiers.hasOwnProperty(mod))
                this.modifiers[mod] = universalModifiers[mod];
        }
    };

    //========================================================
    // Loading
    Grammar.prototype.clear = function() {
        this.symbols = {};
    };

    Grammar.prototype.loadFromJSON = function(json) {
        this.clear();

        // get all json keys
        var keys = Object.keys(json);
        console.log("Keys: " + keys.join(","));

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var symbol = this.addSymbol(key);

            symbol.addRules(json[key]);
        }
        console.log(this.symbols);
    };

    //========================================================
    Grammar.prototype.addSymbol = function(key) {
        if (this.symbols[key] === undefined)
            this.symbols[key] = new Symbol(key);

        return this.symbols[key];
    };
    Grammar.prototype.hasSymbol = function(key) {
        return this.symbols[key] !== undefined;
    };

    Grammar.prototype.hasDependencies = function(reqs) {

        var valid = true;
        var symbolNames = Object.keys(reqs.symbols);
        var actionNames = Object.keys(reqs.actions);
        var modNames = Object.keys(reqs.modifiers);
        for (var i = 0; i < symbolNames.length; i++) {
            if (!this.hasSymbol(symbolNames[i])) {
                console.log("   ERROR: " + symbolNames[i] + " not found");
                valid = false;
            }
        }
        //  return valid;
        return true;
    };

    Grammar.prototype.expand = function(raw) {
        console.log("EXPAND AND PARSE");

        // Start a new tree
        var root = new Node(undefined, this, raw);
        root.expand();

        return root;
    };

    // Expand a parsed rule into a node
    Grammar.prototype.expandParsed = function(parent, parsed) {
        var space = spacer(parent.depth * 5);
        console.log(space + "Expand " + inQuotes(parsed.raw) + " " + parsed.commands.length);
        if (this.hasDependencies(parsed.dependencies)) {

            // Expand all the commands
            var nodes = parent.children;

            // For each command, expand
            for (var i = 0; i < parsed.commands.length; i++) {
                var command = parsed.commands[i];

                var node = new Node(parent);
                nodes.push(node);

                switch(command.type) {
                    case ACTION:
                        this.activateAction(command, node);
                        break;

                    case SYMBOL:
                        this.expandSymbol(command, node);

                        break;

                    case PLAINTEXT:
                        node.finalText = command.content;
                        node.labelText = command.content;
                        node.isLeaf = true;
                        break;
                }
            }

        }

    };

    Grammar.prototype.activateAction = function(command, node) {
        node.labelText = command.target;
        node.finalText = "[" + command.action + " " + command.target + "]";
        var target = this.addSymbol(command.target);

        node.command = command;

        switch(command.action) {
            case "PUSH":

                var expanded = this.expand(command.rule);

                var parsed = tracery.parse(command.rule);
                this.expandParsed(node, parsed);
                node.compileFinalText();

                target.pushRules([node.childText]);

                break;
            case "DEFAULT":
                break;
        }

    };

    Grammar.prototype.getRule = function(key, seed) {
        var symbol = this.symbols[key];
        if (!symbol)
            return "[" + key + "]";
        return symbol.getRule();

    };

    Grammar.prototype.expandSymbol = function(command, node) {

        // expand a symbol
        var key = command.symbol;
        var symbol = this.symbols[key];
        node.finalText = "";
        node.labelText = "#" + key + "#";

        if (symbol) {

            var rule = symbol.getRule();

            var parsed = tracery.parse(rule.raw);
            this.expandParsed(node, parsed);

            node.modifiers = command.modifiers;
            node.compileFinalText();
            node.finalText = this.childText;

            var text = node.childText;
            if (node.modifiers !== undefined) {
                for (var i = 0; i < node.modifiers.length; i++) {
                    text = this.applyMod(node.modifiers[i], text);
                    console.log(node.modifiers[i] + "=>" + text);
                }
                node.finalText = text;
            }

            if (!rule) {
                node.finalText += "[NO RULE FOR " + command.symbol + "]";
                node.error = "missing rule";
            } else {

                console.log(node.finalText);
            }

        } else {
            node.finalText += "[NO SYMBOL" + command.symbol + "]";
            node.error = "missing symbol:" + command.symbol;
        }
    };

    Grammar.prototype.applyMod = function(modName, text) {
        return this.modifiers[modName](text);
    };

    return Grammar;
});
