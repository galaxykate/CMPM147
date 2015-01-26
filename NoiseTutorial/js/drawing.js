/**
 * @author Kate Compton
 */
define(["./particles/particle", "common"], function(Particle, common) {'use strict';
    // utility fuctions
    function heightToColor(z) {

        var color = new common.KColor(offset0 + .7 + .4 * Math.sin(3 * z + offset1), .5, .8);
        color.shade(-.3 + .5 * Math.sin(z * 12 + offset0) + .4 * z);
        return color;
    };

    function getHeight(pctX, pctY, v) {

        var dx = 2 * (pctX - .5);
        var dy = 2 * (pctY - .5);
        var d = Math.sqrt(dx * dx + dy * dy);
        d = d * 2 + 1;

        var r = .038;
        var theta = 10 * utilities.noise(pctX * 2.7, pctY * 2.7 + 30);

        return .4 * utilities.noise(pctX * .7, pctY * .7 + 20, offset2) + Math.abs(utilities.noise(pctX * 2 + r * Math.cos(theta), pctY * 2 + r * Math.sin(theta), offset1) / d);
    };

    return {

        drawDots : function(g, count) {
            for (var i = 0; i < count; i++) {
                var pct = i / count;
                g.noStroke();
                var r = Math.random() * 50 + 20;
                g.fill(Math.random(), .3, pct, 10 / r);
                g.ellipse(Math.random() * g.width, Math.random() * g.height, r, r);
            }
        },

        drawGrid : function(g) {
            var w = g.width;
            var h = g.height;

            console.log(w + " " + h);

            var spacing = 25;
            var rows = Math.round(h / spacing) + 1;
            var columns = Math.round(w / spacing) + 1;

            // Iterate through all the pixels of a w by h rectangle, starting at (x, y)
            for (var i = 0; i < rows; i++) {
                var y = i * spacing;
                for (var j = 0; j < columns; j++) {
                    var r = spacing * .8;
                    var x = j * spacing;

                    g.noStroke();
                    g.fill(Math.random(), .7, 1);
                    g.rect(x, y, r, r);

                }
            }

        },

        // 3d things
        setTerrainToHeight : function(g) {

            // Set the terrain to some function
            app.threeScene.terrainGeometry.setToFunction(function(pctX, pctY, v) {
                v.x = (pctX - .5) * 90;
                v.y = (pctY - .5) * 90;
                v.z = 50 * getHeight(pctX, pctY);
            });

        },

        // Set the terrain to use the canvas texture from processing
        setTerrainTextureToCanvas : function() {
            app.threeScene.setCanvasTexture();
        },
    };

});
