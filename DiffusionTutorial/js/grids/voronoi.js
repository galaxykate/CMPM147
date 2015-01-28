/**
 * @author Kate Compton
 */

define(["three", "common", "rhill-voronoi"], function(_three, common, _voronoi) {'use strict';
    var regionCount = 0;
    var Region = Vector.extend({
        init : function(x, y, z) {
            this._super(x, y, z);

            this.id = regionCount;
            regionCount++;

            this.idColor = new common.KColor((this.id * .1713) % 1, 1, 1);
        },

        draw : function(g) {
            g.fill(1);

            this.drawCircle(g, 1);
            g.fill(0);
            g.text(this.voronoiId, this.x - 5, this.y - 7);

            if (this.edgeVerts) {
                for (var i = 0; i < this.edgeVerts.length; i++) {
                    this.edgeVerts[i].drawCircle(g, 1);
                }

                
                 g.beginShape();
                 this.idColor.fill(g, 0, -.8);
                 for (var i = 0; i < this.edgeVerts.length; i++) {
                 this.edgeVerts[i].vertex(g);
                 }

                 g.endShape(g.CLOSE);
                 
            }
        }
    });

    var VoronoiGrid = Class.extend({
        init : function() {
            console.log("Create voronoi grid");
            this.regions = [];

            // TODO Spawn points in an interesting way
            for (var i = 0; i < 100; i++) {
                //  this.regions[i] = new Region(Math.random() * 700 + 50, Math.random() * 500 + 50);
                this.regions[i] = new Region(370 + 400 *utilities.noise(i*.02), 6 * i, 0);
            }

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

            // Parse the diagram
            diagram.cells.forEach(function(cell) {
                var region = cell.site;
                region.edgeVerts = [];

                cell.halfedges.forEach(function(halfedge) {

                    var v = halfedge.edge.va;
                    if (halfedge.rSite !== cell.site)
                        v = halfedge.edge.vb;

                    region.edgeVerts.push(new Vector(v.x, v.y));
                });
            });

            // Create all the edges
            var edges = [];
            diagram.edges.forEach(function(edge) {

                if (edge.va !== undefined && edge.vb !== undefined) {
                    var start = new Vector(edge.va.x, edge.va.y, 0);
                    var end = new Vector(edge.vb.x, edge.vb.y, 0);
                    edges.push({
                        start : start,
                        end : end

                    });
                }
            });

            this.edges = edges;
        },

        update : function() {

        },

        draw : function(g) {
            g.noStroke();
            g.fill(1);
            for (var i = 0; i < this.regions.length; i++) {
                this.regions[i].draw(g);
            }

            g.stroke(0);
            g.strokeWeight(1);
            for (var i = 0; i < this.edges.length; i++) {
                this.edges[i].start.drawLineTo(g, this.edges[i].end);
            }
        }
    });

    return VoronoiGrid;

});
