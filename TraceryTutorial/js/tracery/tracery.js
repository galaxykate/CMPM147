/**
 * @author Kate Compton
 */
var tracery = {};

define(["common", "./utilities", "./grammar", "./nightvale", "./custom"], function(common, traceryUtilities, Grammar, nightvale, customGrammar) {'use strict';

    var grammars = {
        nightvale : nightvale,
        customGrammar : customGrammar,
    };

    $.extend(tracery, traceryUtilities);

    tracery.createGrammar = function(name) {
        var grammar = new Grammar();
        grammar.loadFromJSON(grammars[name]);
        return grammar;
    };
});
