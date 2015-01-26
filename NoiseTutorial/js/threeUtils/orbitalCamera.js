/**
 * @author Kate Compton
 */

define(["three", "common"], function(_three, common) {'use strict';
    var OrbitalCamera = Vector.extend({
        init : function() {
            this._super();
            this.distance = 150;
            this.phi = .1;
            this.theta = .3;
            this.camera = new THREE.PerspectiveCamera(35, // Field of view
            800 / 600, // Aspect ratio
            .1, // Near
            20000 // Far
            );
            this.update();
        },

        update : function() {
            var r = this.distance;
            this.camera.position.set(r * Math.cos(this.theta) * Math.cos(this.phi), r * Math.sin(this.theta) * Math.cos(this.phi), r * Math.sin(this.phi));
            //    console.log(this.camera.position.x + " " + this.camera.position.y + " " + this.camera.position.z)
            this.camera.up.set(0, 0, 1);
            this.camera.lookAt(new Vector(this.x, this.y, this.z));
        }
    });

    return OrbitalCamera;
});
