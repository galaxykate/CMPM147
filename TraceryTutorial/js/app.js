var app = {};

function getRandom(array) {
    var which = Math.floor(Math.random() * array.length);
    return array[which];
}

define(["./tracery/tracery", "plugins/plugins", "./grammars/grammars"], function(_tracery, plugins, grammars) {'use strict';

    $.extend(app, {

        init : function() {
            app.plugins = plugins;

            app.currentGrammar = tracery.createGrammar(grammars.interruption);
            app.storyView = $("#storyHolder");
            app.reroll();

            app.initUI();
            app.vizEnabled = false;
            $("#visualization").hide();
        },

        reroll : function() {
            app.currentExpansions = [];
            app.storyView.html("");
            for (var i = 0; i < 10; i++) {
                var exp = app.currentGrammar.expand("#origin#");
                 
            app.storyView.append('<p>' + exp.finalText + '</p>');
                 
            app.currentExpansions[i] = exp;

            }

        },

        initUI : function() {

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);
                var vizWindow = $("#visualization");
                switch(key) {
                    case ' ':
                        app.vizEnabled = !app.vizEnabled;
                        if (app.vizEnabled) {

                            vizWindow.show();

                            app.plugins.expansionview.createTree(app.currentExpansions[0], vizWindow);

                        } else
                            vizWindow.hide();
                        return false;
                        break;
                    case '1':
                        break;
                    case '2':
                        break;
                    case '3':
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });
        },
    });
});
