define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var particleCount = 0;

    var Particle = Class.extend({
        init : function() {
            this.id = particleCount;
            particleCount++;
            this.position = new Vector(Math.random() * 200 - 100, Math.random() * 200 - 100);
            this.lastPosition = new Vector(this.position);
            this.velocity = Vector.polar(300, Math.random() * 2 * Math.PI);
            ///    this.acceleration =Vector.polar(100, Math.random() * 2 * Math.PI);
            this.acceleration = new Vector(0, 100);

            this.radius = Math.random() * 10 + 5;
            this.mass = Math.random();
        },

        // Figure out the forces on the particle, how to change the velocity,
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time) {
            this.lastPosition.setTo(this.position);
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

    var AttractedParticle = Particle.extend({
        init : function(target, attractionForce) {
            this.target = target;
            this.attractionForce = attractionForce;
            this._super();
        },

        update : function(time) {

            this.lastPosition.setTo(this.position);
            this.acceleration.setToDifference(this.target, this.position);
            this.acceleration.mult(this.attractionForce);

            this.velocity.addMultiple(this.acceleration, time.elapsed);

            // some damping
            this.velocity.mult(.93);

            this.position.addMultiple(this.velocity, time.elapsed);
        },

        draw : function(g) {
            g.fill(.8, 1, 1);
            g.noStroke();

            for (var i = 0; i < 3; i++) {
                var pct = i / 5;
                var r = this.radius * (1 - pct);
                g.fill((.2 + .2 * pct + this.id * .05) % 1, 1 - pct, 1);
                g.ellipse(this.position.x + .2, this.position.y, r, r);
            }

            g.strokeWeight(1);
            g.stroke(1, 0, 1, .2);
            this.position.drawLineTo(g, this.target);

        },
    });

    var AudioParticle = Particle.extend({
        init : function() {
            this._super();
        },

        update : function(time) {
            this.acceleration = new Vector(this.position);
            this.acceleration.mult(Math.pow(this.position.magnitude(), .4) * -.9);

            // do something with app.dancer

            var freq = 100 + 4 * Math.floor(Math.pow(this.id, 1));
            var signal = app.dancer.getFrequency(freq, freq + 10);

            if (signal !== undefined) {
                signal = Math.pow(signal * 99, 3);
                signal *= 3 * Math.pow(freq, 2.5);
                this.acceleration.addPolar(12 * signal, time.total + this.id);
            }

            this.lastPosition.setTo(this.position);

            this.velocity.addMultiple(this.acceleration, time.elapsed);

            // some damping
            this.velocity.mult(.8);
            this.position.mult(.99);

            this.position.addMultiple(this.velocity, time.elapsed);
        },

        draw : function(g) {
            g.stroke(.9, 1, 1, .4);
            g.strokeWeight(4);
            this.position.drawLineTo(g, this.lastPosition);
            g.fill(.8, 1, 1);
            g.noStroke();

            for (var i = 0; i < 3; i++) {
                var pct = i / 5;
                var r = this.radius * Math.pow(1 - pct, 2);
                g.fill(.88 + .4 * pct + .04 * Math.sin(this.id), 1.2 - 1.7 * pct, .4 + 1.2 * pct + .3 * Math.sin(this.id), pct + .2);
                g.ellipse(this.position.x + .2, this.position.y, r, r);
            }
        },
    });

    Particle.AttractedParticle = AttractedParticle;
    Particle.AudioParticle = AudioParticle;
    return Particle;
});
