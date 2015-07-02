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
    this.audioContext = new AudioContext();
    this.data = [];

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
            source.connect(that.audioContext.destination);
            source.start(0);
        }
	};
}

function drawSpectrum(analyser) {
    analyser = audioContext.createAnalyser();

    // canvas
    var canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 350;
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#f00');
}


window.onload=function() {
    var piano = new Piano();
    piano.loadMusic();

    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        piano.playSound(60);
    }, false);
    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

};