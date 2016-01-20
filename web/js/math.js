var graphy = null;

window.onload = function() {
    initController();
    initCanvas();
};

function initCanvas() {
    var canvas = document.getElementById('math_canvas');
    canvas.width = 32 * 30;
    canvas.height = 32 * 15;

    graphy = new Graphy(canvas);
    graphy.setPixelsPerUnit(20);
    graphy.setOrigin(canvas.width / 2, canvas.height / 2);
    graphy.drawGrid();
}

function initController() {
    var selector = document.getElementById("selector");
    selector.onchange = function() {
        controllerSelect(selector.value);
    }

    // sin
    var sin = document.getElementById("sin");
    var inputs = sin.getElementsByTagName("input");
    inputs[0].oninput = inputs[1].oninput = function() {
        inputs[2].value = (Number(inputs[0].value) - Number(inputs[1].value)) / 2;
        inputs[3].value = (Number(inputs[0].value) + Number(inputs[1].value)) / 2;
        setTimeout(function () {drawSin(inputs[2].value, inputs[4].value, inputs[5].value, inputs[3].value);}, 0);
    };
    inputs[2].oninput = inputs[3].oninput = function() {
        inputs[0].value = Number(inputs[3].value) + Number(inputs[2].value);
        inputs[1].value = Number(inputs[3].value) - Number(inputs[2].value);
        setTimeout(function () {drawSin(inputs[2].value, inputs[4].value, inputs[5].value, inputs[3].value);}, 0);
    };
    inputs[4].oninput = inputs[5].oninput = function() {
        setTimeout(function () {drawSin(inputs[2].value, inputs[4].value, inputs[5].value, inputs[3].value);}, 0);
    };

    setTimeout(function () {drawSin(inputs[2].value, inputs[4].value, inputs[5].value, inputs[3].value);}, 0);
}

function draw(expression) {
    var result = document.getElementById("result");
    result.innerText = expression;

    graphy.graph(expression, "orange", 2);
}

function controllerSelect(value) {
    var controllerInput = document.getElementById("controller_input");
    var divs = controllerInput.getElementsByTagName("div");
    for (var i = 0; i < divs.length; ++i) {
        divs[i].style.display = "none";
    }
    document.getElementById(value).style.display = "block";
}

// y=Asin(ωx+φ)+b
function drawSin(A, w, φ, b) {
    draw([A, "*Math.sin(", w, "*x+", φ, ")+", b].join(""));
}