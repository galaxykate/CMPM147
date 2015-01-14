define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Particle = Class.extend({
        init : function() {

        },

        // Figure out the forces on the particle, how to change the velocity, 
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time) {

        },



        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
        draw : function(g) {

        },
    });

    return Particle;
});
