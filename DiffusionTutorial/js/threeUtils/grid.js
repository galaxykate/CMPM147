/**
 * @author Kate Compton
 */

define(["three", "common"], function(_three, common) {'use strict';
    // Dynamic geometry for a grid

    var Grid = function(columns, rows) {
        this.columns = columns;
        this.rows = rows;

        this.geo = new THREE.Geometry();
        this.verts = [];

        // Create vertices
        for (var i = 0; i < columns + 1; i++) {
            var pctX = i / columns;
            // Create a new column
            this.verts[i] = [];

            for (var j = 0; j < rows + 1; j++) {
                var pctY = j / rows;
                var v = new THREE.Vector3(i, j, Math.random() * 3);

                this.verts[i][j] = v;

                // be able to refer to this vertex by index
                v.vertIndex = this.geo.vertices.length;
                v.uv = new THREE.Vector2(pctX, 1 - pctY);
    
                this.geo.vertices.push(v);
       }
        }

        // Create faces
        for (var i = 0; i < columns; i++) {

            for (var j = 0; j < rows; j++) {
                var pctY = i / rows;
                var v0 = this.verts[i][j];
                var v1 = this.verts[i+ 1][j];
                var v2 = this.verts[i + 1][j + 1];
                var v3 = this.verts[i][j + 1];
                var f0 = new THREE.Face3(v0.vertIndex, v1.vertIndex, v2.vertIndex);
                var f1 = new THREE.Face3(v2.vertIndex, v3.vertIndex, v0.vertIndex);
                this.geo.faces.push(f0);
                this.geo.faces.push(f1);

                this.geo.faceVertexUvs[0].push([v0.uv, v1.uv, v2.uv]);
                this.geo.faceVertexUvs[0].push([v2.uv, v3.uv, v0.uv]);

            }
        }
        this.setNeedsUpdate();

    };
    Grid.prototype.setNeedsUpdate = function(fx) {
        this.geo.dynamic = true;

        this.geo.verticesNeedUpdate = true;

        this.geo.buffersNeedUpdate = true;
        this.geo.uvsNeedUpdate = true;

        this.geo.computeFaceNormals();
        this.geo.computeVertexNormals();
    };

    Grid.prototype.setToFunction = function(fx) {
        for (var i = 0; i < this.columns + 1; i++) {
            var pctX = i / this.columns;
            for (var j = 0; j < this.rows + 1; j++) {
                var pctY = j / this.rows;
                fx(pctX, pctY, this.verts[i][j]);
            }
        }
        this.setNeedsUpdate();

    };

    return Grid;
});
