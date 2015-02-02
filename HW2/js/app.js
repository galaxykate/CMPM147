var app = {};

// A holder for lots of app-related functionality
define(["processing", "./threeUtils/threeScene", "common", "./particles/particle", "./customGrids"], function(_processing, ThreeScene, common, Particle, customGrids) {'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    app.time = {
        date : Date.now(),
        start : Date.now(),
        total : 0,
        elapsed : .1,
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
        updateRate : .9,
        mouse : new Vector(),
        dimensions : new Vector(),

        startMode : function(mode) {
            this.mode = mode;
            switch(mode) {
                case 0:
                    app.grid = new customGrids.ExampleAutomata();
                    break;
                case 1:
                    app.grid = new customGrids.GameOfLife();
                    break;
                case 2:
                    app.grid = new customGrids.CustomAutomata();
                    break;
                case 3:
                    app.grid = new customGrids.CustomVoronoi();
                    break;

            }
        },
        init : function() {
            //  app.threeScene = new ThreeScene($("#threeview"));

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");
            app.updateTimer = 0;
            // Create the canvas

            var processingInstance = new Processing(canvas.get(0), function(g) {

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);
                app.startMode(3);

                g.size(w, h);

                var texture = new THREE.Texture(canvas.get());

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // Draw ONE-TIME things

                g.draw = function() {
                    g.background(.65, .3, .8);

                    // Update time
                    app.time.updateTime();

                    app.updateTimer += app.time.elapsed;
                    if (app.updateTimer > app.updateRate) {
                        console.log("update " + app.time.frames);
                        app.updateTimer = 0;
                        app.grid.update();

                    }

                    app.grid.draw(g);

                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

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
                console.log(e.keyCode);

                switch(key) {
                    case ' ':
                        app.paused = !app.paused;
                        break;
                    case '1':
                        app.startMode(1);
                        break;
                    case '2':
                        app.startMode(2);
                        break;
                    case '3':
                        app.startMode(3);
                        break;
                };

                switch(e.keyCode) {

                    case 189:
                        app.updateRate *= .8;
                        console.log(app.updateRate);
                        break;
                    case 187:
                        app.updateRate /= .8;
                        console.log(app.updateRate);
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });

        }
    });

});
