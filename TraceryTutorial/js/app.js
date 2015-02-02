var app = {};

function getRandom(array) {
    var which = Math.floor(Math.random() * array.length);
    return array[which];
}

define(["./tracery/tracery", "plugins/plugins"], function(_tracery, plugins) {'use strict';

    $.extend(app, {

        init : function() {
            app.plugins = plugins;

            var grammar = tracery.createGrammar("customGrammar");
            var expansion = grammar.expand("#origin#");

            app.plugins.expansionview.createTree(expansion, $("#visualization"));
            app.initUI();
            app.vizEnabled = false;
            $("#visualization").hide();
        },

        initUI : function() {

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                    case ' ':
                        app.vizEnabled = !app.vizEnabled;
                        if (app.vizEnabled)
                            $("#visualization").show();
                        else
                            $("#visualization").hide();
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
