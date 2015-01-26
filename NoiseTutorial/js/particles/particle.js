define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var particleCount = 0;

    var Particle = Class.extend({
        init : function() {

            // give this particle a unique id
            this.id = particleCount;
            particleCount++;

            this.restart();
        },

        restart : function() {

            var theta = Math.random() * 2 * Math.PI;
            this.position = Vector.polar(Math.random() * 400, theta);
            this.velocity = Vector.polar(2, theta + Math.PI / 2);
            this.lastPos = new Vector(this.position);
            ///    this.acceleration =Vector.polar(100, Math.random() * 2 * Math.PI);
            this.acceleration = new Vector(0, 100);

            this.radius = Math.random() * 10 + 5;
            this.mass = this.radius;
            this.started = app.time.total;
            this.lifespan = 3 + Math.random() * 5;
            this.age = 0;
        },

        // Figure out the forces on the particle, how to change the velocity,
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time) {
            this.lastPos.setTo(this.position);

            // if dead of old age, respawn
            this.age = time.total - this.started;
            if (this.age > this.lifespan)
                this.restart();

            // In a dead zone
            if (this.velocity.magnitude() < 3)
                this.restart();

            // Move to the center if it gets too far off
            this.acceleration = new Vector();
            var d = this.position.magnitude();
            var range = 400;
            if (d > range) {
                var d1 = d - range;
                this.acceleration.addMultiple(this.position, -.2 * Math.pow(d1, 2) / d);
            }

            // TODO add a polar force based on the noise value of the position
            // OR TODO set the velocity to a noise value

            this.acceleration.addPolar(r, theta);

            this.velocity.addMultiple(this.acceleration, time.elapsed);
            this.velocity.mult(.98);
            this.velocity.setToPolar(r, theta);

            this.position.addMultiple(this.velocity, time.elapsed);

        },

        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
        draw : function(g) {

            var pctAge = this.age / this.lifespan;
            var intensity = Math.sin(pctAge * Math.PI);

            var hue = .6 + .4 * Math.sin(pctAge * 3);
            var color = new common.KColor(hue, 1, 1);

            for (var i = 0; i < 3; i++) {
                var pct = i / 3;
                var r = this.radius * (1 - pct) * (intensity + .4);
                g.noStroke();
                color.fill(g, -.5 + 1.9 * pct, -1.5 + .5 * intensity + pct);
                g.ellipse(this.position.x + .2, this.position.y, r, r);
            }

        },
    });

    return Particle;
});
