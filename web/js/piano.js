// var audio = new Audio(this.oggSound[soundId]);
// audio.play();
var XMLHttpReq;
function createXMLHttpRequest() {
    try {
        XMLHttpReq = new ActiveXObject("MSXML2.XMLHTTP");
    }
    catch(E) {
        try {
            XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(E) {
            XMLHttpReq = new XMLHttpRequest();
        }
    }
}

function Piano() {
    var that = this;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.connect(this.audioContext.destination);
    this.data = [];
    this.counter = 0;
    drawSpectrum();

    this.loadMusic = function() {
        createXMLHttpRequest();
        XMLHttpReq.open("GET", "/web/music/piano/1.mp3", true);
        XMLHttpReq.responseType = 'arraybuffer';
        XMLHttpReq.onreadystatechange = function() {
            if(XMLHttpReq.readyState == 4 && XMLHttpReq.status == 200) {
                // file index
                var index = XMLHttpReq.responseURL.split("/");
                index = parseInt(index[index.length - 1].split(".")[0]);
                // decode and store
                that.audioContext.decodeAudioData(
                    XMLHttpReq.response,
                    function (buffer) {
                        that.data[index] = buffer;
                    }
                );
                // recurse
                if (index < 88) {
                    var tmp = index + 1;
                    XMLHttpReq.open("GET", "/web/music/piano/" + tmp + ".mp3", true);
                    XMLHttpReq.send(null);
                }
                else {
                    console.log("load completed");
                }
            }
        };
        XMLHttpReq.send(null);
    };

    this.playSound = function(noteNumber) {
        if (that.data[noteNumber]) {
            var source = that.audioContext.createBufferSource();
            source.buffer = that.data[noteNumber];
            source.connect(that.analyser);
            // fuck off!
            source.onended = function() {
                --that.counter;
                console.log("dec:" + that.counter);
            };
            console.log("inc:" + that.counter);
            ++that.counter;
            // source.playbackRate.value = 0.85;
            source.start(0);
        }
	};

    function drawSpectrum() {
        // canvas
        var canvas = document.getElementsByTagName('canvas')[0];
        var width = 791;
        var height = 350;
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var gradient = context.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#0f0');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(0, '#f00');

        var meterNum = Math.floor(canvas.width / (10 + 2));
        var capArray = [];
        var capHeight = 2;
        var capStyle = '#fff';
        var meterWidth = 10;
        var drawMeter = function() {
            // frequency data
            var data = new Uint8Array(that.analyser.frequencyBinCount);
            //getByteTimeDomainData
            that.analyser.getByteFrequencyData(data);
            var step = Math.round(data.length / meterNum);

            // draw
            context.clearRect(0, 0, canvas.width, height);
            context.fillStyle = gradient;
            context.fillRect(0, height - 2, canvas.width, 2);
            for (var i = 0; i < meterNum; ++i) {
                var value = 0;
                if (that.counter)
                    value = data[i * step];
                if (capArray.length < meterNum) {
                    capArray.push(value);
                }
                context.fillStyle = capStyle;
                if (value < capArray[i]) {
                    if (capArray[i] > 0)
                        --capArray[i];
                    context.fillRect(i * 12, height - (capArray[i]), meterWidth, capHeight);
                }
                else {
                    context.fillRect(i * 12, height - value, meterWidth, capHeight);
                    capArray[i] = value;
                }
                context.fillStyle = gradient;
                context.fillRect(i * 12, height - value + capHeight, meterWidth, height);
            }
            requestAnimationFrame(drawMeter);
        };
        requestAnimationFrame(drawMeter);
    }
}


window.onload=function() {
    var piano = new Piano();
    piano.loadMusic();

    var ws = new WebSocket("ws://" + location.host + "/piano");
    ws.onopen = function(event) {
        console.log("ws connected");
    };
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        switch (data.key) {
            case "1".charCodeAt(0): piano.playSound(64); break;
            case "2".charCodeAt(0): piano.playSound(66); break;
            case "3".charCodeAt(0): piano.playSound(68); break;
            case "4".charCodeAt(0): piano.playSound(69); break;
            case "5".charCodeAt(0): piano.playSound(71); break;
            case "6".charCodeAt(0): piano.playSound(73); break;
            case "7".charCodeAt(0): piano.playSound(75); break;

            case "Q".charCodeAt(0): piano.playSound(52); break;
            case "W".charCodeAt(0): piano.playSound(54); break;
            case "E".charCodeAt(0): piano.playSound(56); break;
            case "R".charCodeAt(0): piano.playSound(57); break;
            case "T".charCodeAt(0): piano.playSound(59); break;
            case "Y".charCodeAt(0): piano.playSound(61); break;
            case "U".charCodeAt(0): piano.playSound(63); break;
            // case "I".charCodeAt(0): piano.playSound(51); break;
            // case "O".charCodeAt(0): piano.playSound(51); break;
            // case "P".charCodeAt(0): piano.playSound(51); break;

            case "A".charCodeAt(0): piano.playSound(40); break;
            case "S".charCodeAt(0): piano.playSound(42); break;
            case "D".charCodeAt(0): piano.playSound(44); break;
            case "F".charCodeAt(0): piano.playSound(45); break;
            case "G".charCodeAt(0): piano.playSound(47); break;
            case "H".charCodeAt(0): piano.playSound(49); break;
            case "J".charCodeAt(0): piano.playSound(51); break;
            // case "K".charCodeAt(0): piano.playSound(57); break;
            // case "L".charCodeAt(0): piano.playSound(58); break;

            case "Z".charCodeAt(0): piano.playSound(28); break;
            case "X".charCodeAt(0): piano.playSound(30); break;
            case "C".charCodeAt(0): piano.playSound(32); break;
            case "V".charCodeAt(0): piano.playSound(33); break;
            case "B".charCodeAt(0): piano.playSound(35); break;
            case "N".charCodeAt(0): piano.playSound(37); break;
            case "M".charCodeAt(0): piano.playSound(39); break;
        }
    };

    var keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        ws.send(JSON.stringify({
            "key": e.keyCode
        }));
    }, false);
    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);
};