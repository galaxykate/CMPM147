/**
 * @author Kate Compton
 */
var tracery = {};

define(["common", "./utilities", "./grammar"], function(common, traceryUtilities, Grammar) {'use strict';

    $.extend(tracery, traceryUtilities);

    tracery.createGrammar = function(json) {
        var grammar = new Grammar();
        grammar.loadFromJSON(json);
        return grammar;
    };
});
