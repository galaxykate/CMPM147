/**
 * @author Kate Compton
 */

define(["three", "common", "rhill-voronoi"], function(_three, common, _voronoi) {'use strict';
    function vectorToString(v) {
        return "(" + v.x.toFixed(2) + ", " + v.y.toFixed() + ")";
    }

    var regionCount = 0;

    var VoronoiGrid = Class.extend({
        init : function() {
            console.log("Create voronoi grid");

            this.createRegions();

            var voronoi = new Voronoi();
            // a 'vertex' is an object exhibiting 'x' and 'y' properties. The
            // Voronoi object will add a unique 'voronoiId' property to all
            // sites. The 'voronoiId' can be used as a key to lookup the associated cell
            // in diagram.cells.

            var bbox = {
                xl : 0,
                xr : 800,
                yt : 0,
                yb : 600
            };

            var diagram = voronoi.compute(this.regions, bbox);
            this.parse(diagram);
        },

        update : function() {

        },

        draw : function(g) {
            g.noStroke();
            g.fill(1);
            for (var i = 0; i < this.regions.length; i++) {
                this.drawRegion(g, this.regions[i]);
            }

        },

        createRegions : function() {
            console.log("Create regions");
            this.regions = [];

            // TODO Spawn points in an interesting way, and set a color for each region

            for (var i = 0; i < 120; i++) {

                var color = new common.KColor((i * .023) % 1, .5 + .5 * utilities.noise(i * .02 + 5), 1);
                var center = new Vector(utilities.noise(i * .02) * 400 + 400, 300 * utilities.noise(.02 * i + 30) + 300);
              
                this.regions[i] = new Region(center, color);
            }

        },

        drawRegion : function(g, region) {

            if (region.edges) {

                // Draw the region as triangles

                for (var i = 0; i < region.edges.length; i++) {
                    g.noStroke();
                    region.idColor.fill(g, .3 * Math.sin(i));
                    g.beginShape();
                    var v0 = region.edges[i].end;
                    var v1 = region.edges[i].start;
                    var v2 = region;
                    g.vertex(v0.x, v0.y);
                    g.vertex(v1.x, v1.y);
                    g.vertex(v2.x, v2.y);
                    g.endShape(g.CLOSE);
                }

                // Draw the region as a single shape
                region.idColor.stroke(g, -.4, 1);
                g.strokeWeight(3);
                g.noFill();
                g.beginShape();
                for (var i = 0; i < region.edges.length; i++) {
                    var v = region.edges[i].start;
                    g.vertex(v.x, v.y);
                }
                g.endShape(g.CLOSE);

            }

            // draw quad edges
            /*
             if (this.edges) {
             for (var i = 0; i < this.edges.length; i++) {
             this.edges[i].draw(g);
             }
             }
             */
        },

        //==================================================================
        // Parse the voronoi diagram and turn it into a quad edge type object

        parse : function(diagram) {
            // Create vertices
            this.nodes = [];
            for (var i = 0; i < diagram.vertices.length; i++) {
                var v0 = diagram.vertices[i];
                v0.z = 0;

                var found = false;
                for (var j = 0; j < this.nodes.length; j++) {
                    var node = this.nodes[j];
                    if (node.getDistanceTo(v0) < 2) {
                        v0.node = node;
                        found = true;
                    }
                }

                if (!found) {
                    var node = new Node(v0);
                    v0.node = node;
                    this.nodes.push(node);
                }

            }

            this.nodes.sort(function(a, b) {
                return a.x - b.x;
            });

            // Parse the diagram
            diagram.cells.forEach(function(cell) {
                var region = cell.site;

                // create a list of the unsorted edges
                var unsortedEdges = [];
                //   console.log(cell.halfedges.length);

                cell.halfedges.forEach(function(halfedge) {
                    var quadEdge;

                    var v0 = halfedge.edge.va.node;
                    var v1 = halfedge.edge.vb.node;

                    // reversed version
                    if (halfedge.edge.lSite === region) {
                        quadEdge = new QuadEdge(v1, v0, region);
                    }

                    if (halfedge.edge.rSite === region) {
                        quadEdge = new QuadEdge(v0, v1, region);
                    }

                    //  console.log(" " + quadEdge);
                    unsortedEdges.push(quadEdge);
                });

                // rebuild edge list

                region.edges = unsortedEdges;
                region.sortEdges();
            });
        }
    });

    //=====================================================================================
    //=====================================================================================
    //  Helper classes

    var nodeCount = 0;

    var Node = Vector.extend({
        init : function(v) {
            this._super(v);
            this.id = nodeCount;
            nodeCount++;
        },

        toString : function() {
            return this.toSimpleString() + this.id;
        }
    });

    var QuadEdge = Class.extend({
        init : function(start, end, region) {
            // region is the region to the right-hand-side
            this.start = start;
            this.end = end;
            this.region = region;

            this.offset = this.start.getOffsetTo(this.end);

            // Catch errors
            if (this.start === undefined) {
                throw ("No start point for edge!");
            }
            if (this.end === undefined) {
                throw ("No end point for edge!");
            }
            if (this.region === undefined) {
                throw ("No region for edge!");
            }
        },

        setTwin : function(twin) {
            if (this.twin !== undefined) {
                throw (this + " already has a twin: " + this.twin);
            }
            if (twin.twin !== undefined) {
                throw ("Twin " + twin + " already has a twin: " + twin.twin);
            }

            this.twin = twin;
            twin.twin = this;
        },

        draw : function(g) {

            var offset = 3;
            var buffer = 7;
            var arrowLength = 9;
            var arrowWidth = arrowLength * .3;
            var angle = this.offset.getAngle();
            var m = this.offset.magnitude();
            g.pushMatrix();
            this.start.translateTo(g);
            g.rotate(angle);
            g.fill(0);

            g.noStroke();
            g.ellipse(0, 0, 3, 3);

            g.stroke(0);
            g.line(0 + buffer, offset, m - buffer - arrowLength * .3, offset);

            if (m > arrowLength) {
                // draw the arrow
                g.noStroke();
                g.beginShape();

                g.vertex(m - buffer, offset);
                g.vertex(m - buffer - arrowLength, offset + arrowWidth);
                g.vertex(m - buffer - arrowLength, offset - arrowWidth);

                g.endShape();
            }

            g.popMatrix();

            this.start.drawText(g, this.start.id, 0, 0);
            this.end.drawText(g, this.end.id, 0, 0);

        },

        toString : function() {
            return this.start + "-" + this.end;
        }
    });

    var Region = Vector.extend({
        init : function(center, idColor) {
            this._super(center);

            this.id = regionCount;
            regionCount++;

            if (!idColor)
                this.idColor = new common.KColor((this.id * .1713) % 1, 1, 1);
            else
                this.idColor = idColor;
        },

        // Sort the edges of the regions so that the start and end points match up:
        //  [A, C], [C, F], [F, J], [J, A] etc
        sortEdges : function() {
            var unsorted = this.edges;

            if (unsorted.length > 0) {
                this.edges = [];
                this.edges.push(unsorted[0]);
                var nextStart = this.edges[this.edges.length - 1].end;
                for (var i = 0; i < unsorted.length - 1; i++) {
                    for (var j = 0; j < unsorted.length; j++) {
                        if (unsorted[j].start === nextStart) {
                            this.edges.push(unsorted[j]);
                            nextStart = unsorted[j].end;
                        }

                    }
                }
            }

        },

        draw : function(g) {
            g.fill(1);

            this.drawCircle(g, 1);
            g.fill(0);
            g.text(this.voronoiId, this.x - 5, this.y - 7);

            if (this.edges) {

                g.beginShape();

                this.idColor.fill(g, 0, -.8);

                for (var i = 0; i < this.edges.length; i++) {
                    // console.log(this.)
                    var v = this.edges[i].start;
                    g.vertex(v.x, v.y);
                }

                g.endShape(g.CLOSE);

            }

            if (this.edges) {
                for (var i = 0; i < this.edges.length; i++) {
                    this.edges[i].draw(g);
                }
            }
        }
    });

VoronoiGrid.Region = Region;
    return VoronoiGrid;

});
