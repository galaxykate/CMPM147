/**
 * @author Kate Compton
 */

define([], function() {
    var randomCap = function(array) {
        return utilities.capitaliseFirstLetter(utilities.getRandom(array));
    };

    var utilities = {
        // put noise in here too?
        capitaliseFirstLetter : function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        lowerCaseFirstLetter : function(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        },

        words : {
            syllables : {
                first : "B C D F G H J K L M N P Qu R S T V W X Y Z St Fl Bl Pr Kr Ll Chr Sk Br Sth Ch Dhr Dr Sl Sc Sh Thl Thr Pl Fr Phr Phl Wh".split(" "),
                middle : "an all ar art air aean af av ant app ab er en eor eon ent enth irt ian ion iont ill il ipp in is it ik ob ov orb oon ion uk uf un ull urk".split(" "),
                composites : "estr antr okl ackl".split(" "),
                last : "a ia ea u y en am is on an o io i el ios ius ian ean ekang anth ".split(" "),
            },
            animals : "amoeba mongoose capybara yeti dragon unicorn sphinx kangaroo boa nematode sheep quail goat corgi agouti zebra giraffe rhino skunk dolphin whale bullfrog okapi sloth monkey orangutan grizzly moose elk dikdik ibis stork finch nightingale goose robin eagle hawk iguana tortoise panther lion tiger gnu reindeer raccoon opossum".split(" "),
            moods : "vexed indignant impassioned wistful astute courteous benevolent convivial mirthful lighthearted affectionate mournful inquisitive quizzical studious disillusioned angry bemused oblivious sophisticated elated skeptical morose gleeful curious sleepy hopeful ashamed alert energetic exhausted giddy grateful groggy grumpy irate jealous jubilant lethargic sated lonely relaxed restless surprised tired thankful".split(" "),
            colors : "ivory white silver ecru scarlet red burgundy ruby crimson carnelian pink rose grey pewter charcoal slate onyx black mahogany brown green emerald blue sapphire turquoise aquamarine teal gold yellow carnation orange lavender purple magenta lilac ebony amethyst garnet".split(" "),
            adventures : "lament story epic tears wish desire dance mystery enigma drama path training sorrows joy tragedy comedy riddle puzzle regret victory loss song adventure question quest vow oath tale travels".split(" "),
            getRandomPhrase : function() {
                return utilities.getRandom(utilities.words.moods) + " " + utilities.getRandom(utilities.words.colors) + " " + utilities.getRandom(utilities.words.animals);
            },

            getUserName : function() {
                var f = utilities.getRandom(utilities.words.moods);
                if (Math.random() > .5)
                    f = utilities.getRandom(utilities.words.colors);
                f = utilities.capitaliseFirstLetter(f);
                f += utilities.capitaliseFirstLetter(utilities.getRandom(utilities.words.animals));
                if (Math.random() > .6)
                    f += Math.floor(Math.random() * 50);
                return f;
            },

            getStatement : function() {
                return "This " + utilities.getRandom(utilities.words.moods) + " " + utilities.getRandom(utilities.words.adventures) + " made me " + utilities.getRandom(utilities.words.moods);
            },

            getRandomTitle : function() {
                var adj = randomCap(this.moods);
                if (Math.random() > .5)
                    adj = randomCap(this.colors);
                return "The " + randomCap(this.adventures) + " of the " + adj + " " + randomCap(this.animals);
            },

            getRandomWord : function(lengthMult) {
                if (!lengthMult)
                    lengthMult = 1;
                var s = utilities.getRandom(this.syllables.first);
                if (Math.random() < .4)
                    s = utilities.capitaliseFirstLetter(utilities.getRandom(this.syllables.middle));

                var count = Math.floor(Math.random() * lengthMult * 3);
                for (var i = 0; i < count; i++) {
                    var mid = utilities.getRandom(this.syllables.middle);
                    s += mid;

                }
                s += utilities.getRandom(this.syllables.last);

                if (s.length > 6 * lengthMult && Math.random < .8)
                    s = utilities.words.getRandomWord();
                if (s.length > 9 * lengthMult && Math.random < .9)
                    s = utilities.words.getRandomWord();

                if (s.length < 6 * lengthMult && Math.random() < .2)
                    s += "-" + utilities.words.getRandomWord();
                else if (s.length < 6 * lengthMult && Math.random() < .2)
                    s += "'" + utilities.getRandom(this.syllables.last);

                return s;
            }
        },

        arrayToString : function(array) {
            s = "";
            $.each(array, function(index, obj) {
                if (index !== 0)
                    s += ", ";
                s += obj;
            });
            return s;
        },
        inSquareBrackets : function(s) {
            return "[" + s + "]";
        },
        getSpacer : function(count) {
            var s = "";
            for (var i = 0; i < count; i++) {
                s += " ";
            }
            return s;
        },

        sCurve : function(v, iterations) {
            if (iterations === undefined)
                iterations = 1;
            for (var i = 0; i < iterations; i++) {
                var v2 = .5 - .5 * Math.cos(v * Math.PI);
                v = v2;
            }
            return v;
        },
        within : function(val, min, max) {
            return (val >= min) && (val <= max);
        },

        // Inefficient, fix someday
        // the weight is determined by the function getWeight(index, item, list)
        getWeightedRandomIndex : function(array) {
            var totalWeight = 0;
            var length = array.length;

            for (var i = 0; i < length; i++) {

                totalWeight += array[i];
            };

            var target = Math.random() * totalWeight;
            var cumWeight = 0;

            for (var i = 0; i < length; i++) {
                cumWeight += array[i];

                if (target <= cumWeight) {
                    return i;
                }

            };

        },

        // Get a random, from an array
        getRandom : function(array, power) {
            if (power)
                return array[Math.floor(Math.pow(Math.random(), power) * array.length)];
            else
                return array[Math.floor(Math.random() * array.length)];
        },
        getRandomIndex : function(array) {
            return Math.floor(Math.random() * Math.round(array.length - 1));
        },
        getRandomKey : function(obj) {
            return this.getRandom(Object.keys(obj));
        },

        constrain : function(val, lowerBound, upperBound) {
            if (Math.max(val, upperBound) === val)
                return upperBound;
            if (Math.min(val, lowerBound) === val)
                return lowerBound;
            return val;
        },
        lerp : function(start, end, percent) {
            return (start + percent * (end - start));
        },
        lerpAngles : function(start, end, pct) {
            var dTheta = end - start;
        },

        // angle between 0 and 2 PI
        normalizeAngle : function(theta) {
            var twopi = Math.PI * 2;
            theta = (((theta % twopi) + twopi) % twopi);
            return theta;
        },

        // Rertun a random, possible between two numbers
        random : function() {
            if (arguments.length === 0)
                return Math.random();
            if (arguments.length === 1)
                return Math.random() * arguments[i];
            if (arguments.length === 2)
                return Math.random() * (arguments[1] - arguments[0]) + arguments[0];

            return Math.random();
        },
        roundNumber : function(num, places) {
            // default 2 decimal places
            if (places === undefined) {
                return parseFloat(Math.round(num * 100) / 100).toFixed(2);
            } else {
                return parseFloat(Math.round(num * 100) / 100).toFixed(places);
            }
        },
        angleBetween : function(a, b) {
            var dTheta = b - a;
            dTheta = ((dTheta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            if (dTheta > Math.PI)
                dTheta -= Math.PI * 2;
            return dTheta;
        },

        addSlider : function(parent, overrideOptions, onChange) {

            var options = {
                range : "min",
                value : 50,
                min : 0,
                max : 100,
                step : 1,

            };
            $.extend(options, overrideOptions);

            options.slide = function(event, ui) {
                $("#" + options.key + "amt").text(ui.value);
                console.log("Slide " + ui.value);
                if (onChange !== undefined) {
                    onChange(options.key, ui.value);
                }
            };

            // Create an empty slider div
            var optionDiv = $("<div/>", {
            });
            optionDiv.css({
                "pointer-events" : "auto"
            });
            parent.append(optionDiv);

            var slider = $('<div />', {
                id : 'slider_' + options.key,
                class : "tuning_slider",
                value : options.key
            });

            slider.appendTo(optionDiv);
            slider.slider(options);

            // Create a lable
            $('<label />', {
                'for' : 'slider_' + options.key,
                text : options.key + ": "
            }).appendTo(optionDiv);

            // Create a lable
            $('<span />', {
                id : options.key + "amt",
                text : options.defaultValue
            }).appendTo(optionDiv);

            return slider;
        },
    };

    return utilities;
});
