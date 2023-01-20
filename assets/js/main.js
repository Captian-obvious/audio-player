window.addEventListener('load',function(){
        var pattern = 'cbars'
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
        function frame() {
            analyser.getByteFrequencyData(array)
            if (pattern=='bars') {
                var WIDTH = canvas.width;
                var HEIGHT = canvas.height;
                var barWidth = (WIDTH / l) * 2.5;
                var barHeight;
                var x = 0;
                for (var i=0; i < l; i++) {
                    barHeight = array[i];
                    var r = barHeight + (25 * (i/l));
                    var g = 250 * (i/l);
                    var b = 50;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            }
            if (pattern=='cbars') {
                var WIDTH = canvas.width;
                var HEIGHT = canvas.height;
                var barWidth = (WIDTH / l) * 2.5;
                var barHeight;
                var x = 0;
                var centerX = canvas.wdith/2
                var centerY = canvas.height/2
                var loud = getRMS(array)
                let rad = (loud/255) * 5;
                for (var i=0; i < l; i++) {
                    barHeight = (array[i]/255)* HEIGHT/3;
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(90 + i * ((Math.PI * 2) / l));
                    var r = barHeight + 25 * (i / l);
                    var g = 250 * (i / l);
                    var b = 50;
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(0, 0 + rad, barWidth, barHeight);
                    ctx.fillStyle = "rgb(255,255,255)";
                    ctx.fillRect(0, 0 + rad + barHeight, barWidth, 1);
                    ctx.restore();
                }
                ctx.beginPath();
                ctx.arc(centerX, centerY, rad, 0, Math.PI * 2, false);
                ctx.fillStyle = "rgb(" + loud + ", " + loud + ",0)";
                ctx.fill();
                ctx.closePath();
            }
            requestAnimationFrame(frame)
            ctx.clearRect();
        }
})
