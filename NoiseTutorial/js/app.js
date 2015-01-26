var app = {};

// A holder for lots of app-related functionality
define(["processing", "./drawing", "./threeUtils/threeScene", "common", "./particles/particle"], function(_processing, drawing, ThreeScene, common, Particle) {'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    app.time = {
        date : Date.now(),
        start : Date.now(),
        total : 0,
        elapsed: .1,
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;

            this.frames++;
        }
    };

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {
            app.is3D = true;
            console.log("Hello, World.");
            app.toggle3D();
            app.threeScene = new ThreeScene($("#threeview"));

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");

            // Create the canvas

            var processingInstance = new Processing(canvas.get(0), function(g) {
                app.particles = [];
                // Create particles
                for (var i = 0; i < 0; i++) {
                    var p = new Particle();
                    app.particles.push(p);
                }
                // This function is called once processing is initialized.

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                g.size(w, h);

                var texture = new THREE.Texture(canvas.get());

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Draw ONE-TIME things
                drawing.drawGrid(g);

                g.draw = function() {

                    // Update time
                    app.time.updateTime();

                    for (var i = 0; i < app.particles.length; i++) {
                        app.particles[i].update(app.time);
                    }

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    for (var i = 0; i < app.particles.length; i++) {
                        app.particles[i].draw(g);
                    }
                    g.popMatrix();

                };
            });
            this.initUI();
        },

        toggle3D : function() {
            if (!app.is3D) {
                app.is3D = true;
                $("#threeview").show();
                //   $("#processingview").hide();
            } else {
                app.is3D = false;
                $("#threeview").hide();
                //  $("#processingview").show();
            }
            console.log("Threeview: " + app.is3D);

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

                        app.key = 1;
                        break;

                    case 'T':
                        // Do something
                        drawing.setTerrainTextureToCanvas();
                        break;
                    case '3':
                        console.log("Toggle 3D");
                        app.toggle3D();
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
