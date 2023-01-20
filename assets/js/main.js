window.addEventListener('load',function(){
        var canvas = document.getElementById('canvas')
        var maxrms = 255;
        function getRMS(arr) {
            var square = 0;
            var mean = 0;
            var intrms = 0;
            var n = arr.length;
            for (var i = 0; i < n; i++) {
                square += Math.pow(arr[i], 2);
            };
            mean = square / n;
            intrms = Math.sqrt(mean);
          	maxrms = Math.max(intrms,maxrms);
          	var rms = intrms/maxrms;
            return rms*255;
        };
        var actx = new AudioContext()
        var src = actx.createMediaElementSource(audio);
        var analyser = actx.createAnalyser();
        src.connect(analyser);
        analyser.connect(actx.destination);
        analyser.fftSize = fftSize;
        analyser.maxDecibels = -3;
        analyser.minDecibels = -150;
        var l = analyser.frequencyBinCount;
        var array = new Uint8Array(l);
})
