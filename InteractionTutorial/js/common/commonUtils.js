/**
 * @author Kate Compton
 */

var utilities = {};
var prefix = "../js/common/";
define('common', ["noise", prefix + "vector", prefix + "kcolor", prefix + "utilities"], function(_Noise, _Vector, _KColor, _utilities) {
    var common = {
        Vector : _Vector,

        KColor : _KColor,

    };

    //=============================================================
    //=============================================================
    //=============================================================

    utilities = _utilities;
    utilities.noiseObj = new _Noise();

    utilities.seedNoise = function(rnd) {
        utilities.noiseObj = new _Noise(rnd);
    };

    utilities.noise = function() {
        // use the correct number of args
        switch(arguments.length) {
            case 1:
                return utilities.noiseObj.noise2D(arguments[0], 1000);
                break;
            case 2:
                return utilities.noiseObj.noise2D(arguments[0], arguments[1]);
                break;
            case 3:
                return utilities.noiseObj.noise3D(arguments[0], arguments[1], arguments[2]);
                break;
            case 4:
                return utilities.noiseObj.noise4D(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
            default:
                console.log("Attempting to use Noise with " + arguments.length + " arguments: not supported!");
                return 0;
                break;
        }
    };

    // renormalized to between [0, 1]
    utilities.unitNoise = function() {
        return utilities.noise.apply(undefined, arguments) * .5 + .5;
    };

    //==================================================
    // Handlers
    // For some list of actions ["remove", "click", "givePoints"]
    //   an object should be able to:
    //     - subscribe a new function to this actions with object.onAction(fxn)
    //     - notify all the subscribers with obj.applyToHandlers(actionName, args)

    // Make a list of functions that can be used to subscribe functions to actions
    utilities.addSubscribers = function(actions, actionNames) {
        $.each(actionNames, function(index, name) {
            var onName = "on" + utilities.capitaliseFirstLetter(name);

            // add a new handler
            actions[onName] = function(f) {
                // Make the list of handlers if it doesn't exist yet
                if (!this[name + "Handlers"])
                    this[name + "Handlers"] = [];
                this[name + "Handlers"].push(f);
            }
        });

    };

    // pass these arguments to all the handlers
    var applyToHandlers = function(actionName, args) {
        var handlers = this[actionName + "Handlers"];
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(this, args);
            }
        } else {
            console.log("No handlers for " + actionName);
        }
    };

    utilities.addHandlers = function(object, actions) {
        object.applyToHandlers = applyToHandlers;

        // Add some objects
        _.extend(object, actions);
    };

    //==================================================

    utilities = _utilities;

    console.log("utilities = " + utilities);
    return common;
});
