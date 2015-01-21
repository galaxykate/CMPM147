define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Particle = Class.extend({
        init : function() {
            this.position = new Vector(Math.random() * 200 - 100, Math.random() * 200 - 100);
            this.velocity = Vector.polar(300, Math.random() * 2 * Math.PI);
            ///    this.acceleration =Vector.polar(100, Math.random() * 2 * Math.PI);
            this.acceleration = new Vector(0, 100);

            this.radius = Math.random() * 10 + 5;
            this.mass = Math.random();
        },

        // Figure out the forces on the particle, how to change the velocity,
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time) {

            this.acceleration = new Vector(this.position);

            this.acceleration.setToDifference(app.mouse, this.position);

            this.velocity.addMultiple(this.acceleration, time.elapsed);
            this.position.addMultiple(this.velocity, time.elapsed);

        },

        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
        draw : function(g) {
            g.fill(.8, 1, 1);
            g.noStroke();

            for (var i = 0; i < 5; i++) {
                var pct = i / 5;
                var r = this.radius * (1 - pct);
                g.fill(.7 + .2 * pct, 1 - pct, 1);
                g.ellipse(this.position.x + .2, this.position.y, r, r);
            }

            g.stroke(1);
            this.position.drawArrow(g, this.acceleration, .5);

        },
    });

    return Particle;
});
