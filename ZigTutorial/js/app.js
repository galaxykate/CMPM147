var app = {

};
var myApp = app;

// A holder for lots of app-related functionality
define(["processing", "./particles/particleSystem", "./particles/flower", "./particles/particle"], function(_processing, ParticleSystem, Flower, Particle) {'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    var time = {
        date : Date.now(),
        start : Date.now(),
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;

            this.frames++;
        }
    };

    function sound() {
        console.log("sound");
        var audio = new Audio('sound/lectroperc.aif');
        audio.play();

    }

    function randomDot(g) {
        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);
        var hue = Math.random();
        g.fill(hue, 1, 1, .4);
        g.noStroke();
        g.stroke(hue, 1, .0, .1);
        g.strokeWeight(5);
        g.ellipse(x, y, 100, 100);
    }

    function pixelStreak(g) {
        var offset = Math.floor(Math.random() * 100);
        g.loadPixels();
        var pixelArray = g.pixels.toArray();

        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);

        // Move a bunch of pixels to the right by 30 (wraparound)
        for (var i = 0; i < 1000; i++) {
            var index = x + y * g.width + i;
            pixelArray[index] = pixelArray[index + offset];
        }

        g.pixels.set(pixelArray);
        g.updatePixels();
    }

    function recolorBlock(g) {
        var offset = Math.floor(Math.random() * 100);
        g.loadPixels();
        var pixelArray = g.pixels.toArray();

        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);
        var w = 650;
        var h = 230;

        // Iterate through all the pixels of a w by h rectangle, starting at (x, y)
        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                // Convert the x, y coordinates into the position in the 1 dimensional array of the buffer
                var index = (x + i + Math.round(.1 * j * j)) + (y + j) * g.width;

                // Read the hue saturation and brightness of the color at this pixel
                var color = pixelArray[index];
                var hue = g.hue(color);
                var saturation = g.saturation(color);
                var brightness = g.brightness(color);
                hue = (hue + .2) % 1;
                // and use it to make a new color
                pixelArray[index] = g.color(hue, saturation, brightness * 2 - 1);
            }
        }

        g.pixels.set(pixelArray);
        g.updatePixels();
    }

    function addParticles() {
        console.log("add particles");
        app.particles = [];
        for (var i = 0; i < 30; i++) {
            app.particles[i] = new Particle();
        }
    };

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {
            console.log("Hello, World.");

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");
            var processingInstance = new Processing(canvas.get(0), function(g) {
                app.particles = [];
                app.g = g;

                g.noLoop();
                // This function is called once processing is initialized.

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                g.size(w, h);

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Start with a black background
                // g.background(.5);

                // You can specify backgrounds with one value, for greyscale,
                //  g.background(.65);

                // or with 3 for HSB (or whatever color mode you are using)

                // You can even have a background that is *transparent*
                // g.background(0, 0, 0, 0);

                // Set processing's draw function

                g.background(.14, .4, .9);

                // [TODO] Create a particle here

                var myParticle = new Particle();
                for (var i = 0; i < 23; i++) {
                    randomDot(g);
                }

                for (var i = 0; i < 1; i++) {
                    recolorBlock(g);
                }

                g.draw = function() {

                    // Update time
                    time.updateTime();

                    // [TODO] Update a particle here
                    //  myParticle.update(time);

                    for (var i = 0; i < app.particles.length; i++) {
                        app.particles[i].update(time);
                    }

                    g.fill(.5, .2, .1, .1);
                    // g.rect(0, 0, w, h);

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    // [TODO] Draw a particle here
                    //     myParticle.draw(g);

                    for (var i = 0; i < app.particles.length; i++) {
                        app.particles[i].draw(g);
                    }

                    g.popMatrix();

                    // HW Functions

                    if (app.key === 1) {
                        randomDot(g);
                    }
                    if (app.key === 2) {
                        pixelStreak(g);
                    }

                };
            });
            this.initUI();
        },

        initUI : function() {

            $("#view").mousemove(function(ev) {
                var x = ev.offsetX - app.dimensions.x / 2;
                var y = ev.offsetY - app.dimensions.y / 2;
                //    console.log(x + " " + y);
                app.mouse.setTo(x, y);
            });

            // using the event helper
            $('#view').mousewheel(function(event) {

            });

            $("#view").draggable({
                helper : function() {
                    return $("<div id='dragPos'></div>");
                },

                drag : function(event, ui) {
                    var x = $('#dragPos').offset().left;
                    var y = $('#dragPos').offset().top;

                }
            });

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                    case ' ':
                        app.paused = !app.paused;
                        break;
                    case '1':
                        // Do something when the user
                        sound();
                        app.key = 1;
                        break;

                    case 'W':
                        // Do something when the user
                        addParticles();
                        break;

                    case '2':
                        // Do something
                        app.key = 2;
                        break;
                    case '3':
                        app.key = 3;
                        // Do something
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });

        }
    });

});
