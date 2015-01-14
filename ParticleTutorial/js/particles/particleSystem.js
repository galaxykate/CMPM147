// A holder for lots of app-related functionality
define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var ParticleSystem = Class.extend({
        init : function() {
            this.particles = [];

        },

        add : function(particle) {
            // This is correct, but has some bad side effects, which we'll discuss later
            this.particles.push(particle);
        },

        update : function(time) {
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                p.update(time);
            }
        },

        draw : function(g) {

            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                p.draw(g);
            }
        },
    });

    return ParticleSystem;
});
