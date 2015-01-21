/**
 * @author Kate Compton
 */

define(["inheritance", "common", "../particles/particle"], function(_inheritance, common, Particle) {'use strict';

    function createFingers() {

        app.fingers = [];
        for (var i = 0; i < 10; i++) {
            app.fingers[i] = new Vector();
            var follower = new Particle.AttractedParticle(app.fingers[i], 15);
            app.particles.push(follower);
        }

        var output = $("#output");
        Leap.loop(function(frame) {
            var outputData = "";
            frame.hands.forEach(function(hand, handIndex) {
                hand.fingers.forEach(function(finger, fingerIndex) {
                    var p = finger.tipPosition;
                    var index = fingerIndex + handIndex * 5;

                    app.fingers[index].setTo(p[0], -p[1], p[2]);
                    app.fingers[index].mult(2);
                    app.fingers[index].y += 200;
                    outputData += index + " " + app.fingers[index] + " roll: " + hand.roll().toFixed(2) + "<br>";
                });

            });

            output.html("frame " + frame.id + "<br>" + outputData);

        });
    }

    return {
        createFingers : createFingers
    }
});

