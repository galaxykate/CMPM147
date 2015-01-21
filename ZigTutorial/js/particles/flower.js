define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Flower = Class.extend({
        init : function() {
            this.age = 0;
            this.lifespan = 10;
            this.sides = 6;
            this.position = new Vector();
            this.center = Vector.polar(Math.random() * 200, Math.random() * Math.PI * 2);
            this.rotation = Math.random() * Math.PI * 2;

        },

        update : function(time) {
            this.age += time.elapsed;

            this.position.x += .2;
            this.rotation += .01;
        },

        draw : function(g) {

            if (this.age < this.lifespan) {
                for (var i = 0; i < this.sides; i++) {
                    var theta = i * Math.PI * 2 / this.sides;
                    g.pushMatrix();
                    g.translate(this.center.x, this.center.y);
                    g.rotate(theta + this.rotation);
                    g.fill(i * .12, 1, 1);

                    this.position.drawCircle(g, 5);
                    g.popMatrix();
                }
            }
        },
    });

    return Flower;
});
