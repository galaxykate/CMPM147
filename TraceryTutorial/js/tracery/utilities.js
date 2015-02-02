/**
 * @author Kate Compton
 */
var PLAINTEXT = 0;
var SYMBOL = 1;
var ACTION = 2;

function inQuotes(s) {
    return '"' + s + '"';
};

function isAllCaps(s) {
    return s.toUpperCase() === s;
}

define([], function() {'use strict';

    // Parses things of the structure "sometext #stuffInTags# [stuff in brackets #andsometimesTags#] and [[etc]]"
    function parseBrackets(s, openBracket, closeBracket, tag) {

        var lvl = 0;
        var lastStart = 0;
        var inTag = false;
        var inBrackets = false;
        var commands = [];

        if (!( typeof s == 'string' || s instanceof String)) {
            throw ("Can't parse brackets for a non-string! " + s);
        }

        function addcommand(type, start, end) {
            if (start !== end) {
                commands.push({
                    content : s.slice(start, end),
                    type : type,
                });
            }
            lastStart = end + 1;
        }

        for (var i = 0; i < s.length; i++) {

            var c = s.charAt(i);
            switch(c) {
                case openBracket:
                    // Create a text command from whatever came before
                    if (lvl === 0) {
                        addcommand(PLAINTEXT, lastStart, i);

                        inBrackets = true;

                    }

                    lvl++;
                    break;

                case closeBracket:
                    lvl--;
                    if (lvl === 0) {
                        inBrackets = false;
                        // Slice from the last start to this
                        addcommand(ACTION, lastStart, i);
                    }
                    break;

                case tag:
                    // only pay attention to bare tags
                    if (lvl === 0) {

                        // End this tag
                        if (inTag) {
                            addcommand(SYMBOL, lastStart, i);
                            inTag = false;
                        }

                        // Start a new tag
                        else {
                            addcommand(0, lastStart, i);
                            inTag = true;
                        }
                        break;
                    }
            }
        }

        if (lvl > 0) {

            if (inBrackets) {
                console.warn("Too many " + openBracket + " in " + s);
            } else
                console.warn("Wait, what happened? " + s);
            return undefined;
        }

        if (inTag) {
            console.warn("Odd number of " + tag + " in " + s);
            return undefined;
        }

        if (lvl < 0) {
            throw ("Too many " + closeBracket + " in " + s);
            return undefined;
        }
        addcommand(0, lastStart, i);

        /*
         console.log(utilities.arrayToString(commands, function(s) {
         return "'" + s.type + ":" + s.text + "'";
         }));
         */
        return commands;

    };

    function commandsToString(commands) {
        var s = "";
        if (!commands)
            return "INVALID commands";
        commands.forEach(function(command) {
            switch(command.type) {
                case PLAINTEXT:
                    s += "Text(" + command.content + ")";
                    break;
                case SYMBOL:
                    s += "Symbol(" + command.symbol + ", " + command.modifiers.join(",") + ")";
                    break;
                case ACTION:
                    s += "Action(" + command.content + ")";
                    break;
            }
        });
        return s;
    };

    function testParse(rule) {
        var parsed = utilities.parse(rule);
        if (parsed) {
            console.log(rule + " => " + commandsToString(parsed.commands));
        }
    };

    function addOrInit(obj, key) {

        if (obj[key] === undefined)
            obj[key] = 1;
        else
            obj[key]++;

    };

    var utilities = {

        // Parse the rule into commands
        // Returns an array of commands (plaintext, symbol (with mods), or pushpop)
        parse : function(rule) {
            var commands = parseBrackets(rule, "[", "]", "#");
            if (!commands)
                return undefined;

            // get all rules etc
            var dependencies = {
                symbols : {},
                modifiers : {},
                writesTo : {},
                actions : {},
            };

            commands.forEach(function(command) {
                if (command.type === SYMBOL) {
                    var segments = command.content.split(".");
                    var symbol = segments[0];
                    addOrInit(dependencies.symbols, symbol);
                    command.symbol = symbol;
                    command.modifiers = segments.slice(1, segments.length);
                }

                // Split into target action parts
                if (command.type === ACTION) {
                    var segments = command.content.split(":");
                    command.target = segments[0];

                    if (segments.length != 2) {
                        console.warn("No action for target " + command.target);
                    } else {

                        // Is the action all upper case?  then its an action, otherwise, its a push rule
                        if (isAllCaps(segments[1])) {
                            command.action = segments[1];
                        } else {
                            // push
                            command.rule = segments[1];
                            command.action = "PUSH";
                        }
                        addOrInit(dependencies.actions, command.action);
                        addOrInit(dependencies.symbols, command.target);
                    }

                }
            });

            return {
                raw : rule,
                commands : commands,
                dependencies : dependencies
            };
        },

        debugOutputDependencies : function(dependencies, spacer) {
            var hasDependencies = 0;

            function outputDependency(set, spacer) {
                var keys = Object.keys(set);

                if (keys.length > 0) {
                    hasDependencies++;
                    var s = "";
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (set[key] > 1)
                            s += key + "[" + set[key] + "]";
                        else
                            s += key;

                        if (i < keys.length - 1)
                            s += ", ";
                    }
                    console.log(spacer + s);

                }
            };

            if (dependencies) {

                outputDependency(dependencies.symbols, spacer + " symbols: ");
                outputDependency(dependencies.modifiers, spacer + " modifiers: ");
                outputDependency(dependencies.writesTo, spacer + " writesTo: ");
                outputDependency(dependencies.actions, spacer + " actions: ");

            }
            if (hasDependencies === 0)
                console.log(spacer + "(no dependencies)");
        },

        debugOutputParsed : function(parsed, spacer) {
            console.log(parsed);
            var commands = parsed.commands;
            this.debugOutputDependencies(parsed.dependencies, spacer);
            for (var i = 0; i < commands.length; i++) {
                // console.log(spacer + i + ": " + commands[i]);
                var command = commands[i];
                var output = "";
                switch(command.type) {
                    case ACTION:

                        output = command.target + " " + command.action;
                        break;
                    case SYMBOL:
                        output = command.symbol;
                        if (command.modifiers && command.modifiers.length > 0)
                            output += command.modifiers.join(".");
                        break;
                    case PLAINTEXT:
                        output = inQuotes(command.content);
                        break;
                }
                console.log(spacer + i + ": " + output);
            }
        },

        testParses : function() {

            testParse("#test#");
            testParse("#test.foo.bar.something()#");
            testParse("#test[something]#");
            testParse("[somethings#test#]");
            testParse("#test##test#");
            testParse("#test");
            testParse("[test#");
            testParse("[[test]]");
        },
    };

    return utilities;
});
