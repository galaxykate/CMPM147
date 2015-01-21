/**
 * @author Kate Compton
 */

define(["inheritance", "common", "dancer", "../particles/particle"], function(_inheritance, common, _dancer, Particle) {'use strict';

    var srcs = ["kopeika", "State_Shirt_-_04_-_Computer"];
    var srcIndex = -1;

    function nextAudio() {
        if (app.song)
            app.song.pause();
        var a = new Audio();

        srcIndex = (srcIndex + 1) % srcs.length;
        a.src = 'audio/' + srcs[srcIndex] + '.mp3';
        app.song = a;

        app.dancer.load(a);
        app.dancer.play();
    };

    function captureMic() {

        function hasGetUserMedia() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        }

        if (hasGetUserMedia()) {
            // Good to go!
        } else {
            alert('getUserMedia() is not supported in your browser');
        }

        var errorCallback = function(e) {
            console.log('Reeeejected!', e);
        };

        // Not showing vendor prefixes.
        navigator.webkitGetUserMedia({
            video : true,
            audio : true
        }, function(localMediaStream) {
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function(e) {
                // Ready to go. Do some stuff.
            };
        }, errorCallback);
    };

    function startAudio() {

        app.dancer = new Dancer();

        // Using an audio object
        this.nextAudio();

        app.dancer.setVolume(.10);

        app.dancer.createKick({
            onKick : function() {
                console.log("kick!");
            },
            offKick : function() {

            }
        });

        //    a.play();

        /*
        var ctx = new AudioContext();
        var audio = document.getElementById('myAudio');

        var audioSrc = ctx.createMediaElementSource(audio);
        //  var analyser = ctx.createAnalyser();
        // we have to connect the MediaElementSource with the analyser
        //   audioSrc.connect(analyser);
        // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

        // frequencyBinCount tells you how many values you'll receive from the analyser
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        // we're ready to receive some data!
        // loop
        function renderFrame() {
        requestAnimationFrame(renderFrame);
        // update data in frequencyData
        analyser.getByteFrequencyData(frequencyData);
        // render frame based on values in frequencyData
        // console.log(frequencyData)
        }
        */

        // audio.play();
        //    renderFrame();

    };

    return {
        startAudio : startAudio,
        nextAudio : nextAudio,
        captureMic : captureMic,
    };
});

