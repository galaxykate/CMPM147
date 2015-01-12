define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Particle = Class.extend({
        init : function() {

            // A particle's three most important attributes are
            //  its position, velocity, and acceleration
            // These are stored as Vectors in this case, using a library that I built that I find helpful
            // You can of course use any other vector library, or build your own.
            // This one is optimized for the sort of tasks I do frequently in my work
            var theta = Math.random() * Math.PI * 2;
            var r = Math.random() * 300;

            this.position = Vector.polar(r, theta);
            this.velocity = Vector.polar(r, theta + Math.PI / 2);
            this.acceleration = Vector.polar(0, theta + Math.PI / 2);

            // Depending on what you care about modelling,
            // a particle might have a mass and a radius
            this.mass = Math.random() + .3;
            this.radius = this.mass * 2 + 1;

            // Often it is helpful to know that particles last position
            this.last = new Vector();

            this.last.setTo(this.position);
        },

        setForces : function(time) {
            this.acceleration.setToDifference(this.position, app.mouse);
            this.acceleration.mult(-12 / this.mass);
        },

        move : function(time) {
            this.last.setTo(this.position);
            this.velocity.addMultiple(this.acceleration, time.elapsed);

            this.position.addMultiple(this.velocity, time.elapsed);
            this.velocity.mult(.99);
        
            this.radius *= .98;
            this.radius += .03;

        },

        draw : function(g) {

            g.noFill();
            g.strokeWeight(4);
            g.stroke(this.mass % 1, 1, 1, .2);
            this.last.drawLineTo(g, this.position);

            g.strokeWeight(1);
            g.stroke(this.mass % 1, .1, 1);
            this.last.drawLineTo(g, this.position);

            var p = new Vector(this.position);

            g.noStroke();
            g.fill(this.mass % 1, .3, 1, .2);
            //  p.drawCircle(g, 4);
            g.fill(1);
            p.drawOffsetMultipleCircle(g, this.velocity, .036, this.velocity.magnitude() * .002);
        },
    });

    return Particle;
});
