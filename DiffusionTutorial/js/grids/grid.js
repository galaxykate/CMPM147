/**
 * @author Kate Compton
 */
define(["inheritance", "common", "./voronoi"], function(_inheritance, common, Voronoi) {'use strict';
    var Grid = Class.extend({
        init : function(columns, rows) {

            this.values = [];
            this.lastValues = [];
            var scale = .08;
            this.columns = columns;
            this.rows = rows;

            for (var i = 0; i < this.columns; i++) {
                this.values[i] = [];
                this.lastValues[i] = [];
                for (var j = 0; j < this.rows; j++) {
                    this.values[i][j] = .5 + .45 * utilities.noise(scale * i, scale * j);
                    this.lastValues[i][j] = 0;
                }
            }
        },

        getLastValue : function(i, j) {
            var rows = this.rows;
            var cols = this.columns;
            var iWrap = ((i % cols) + cols) % cols;
            var jWrap = ((j % rows) + rows) % rows;
            return this.lastValues[iWrap][jWrap];
        },

        computeNextValue : function(i, j) {
            var v = this.getLastValue(i, j);
            var v0 = this.getLastValue(i + 1, j);
            var v1 = this.getLastValue(i - 1, j);
            var v2 = this.getLastValue(i, j - 1);
            var v3 = this.getLastValue(i, j + 1);
            return utilities.lerp((v0 + v1 + v2 + v3) / 4, v, .1);

        },

        update : function() {
            // Save the last values
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
                    this.lastValues[i][j] = this.values[i][j];
                }
            }
            // compute the next values
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
                    this.values[i][j] = this.computeNextValue(i, j);
                }
            }

        },

        draw : function(g) {
            var xSpacing = g.width / this.columns;
            var ySpacing = g.height / this.rows;

            g.noStroke();
            for (var i = 0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
                    g.fill(.5, .2, this.values[i][j]);
                    g.rect(i * xSpacing, j * ySpacing, xSpacing, ySpacing);
                }
            }
        }
    });
    
    Grid.Voronoi = Voronoi;
    
    return Grid;
});
