window.onload = function() {
    initController();
    initCanvas();
};

function initCanvas() {
    var canvas = document.getElementById('math_canvas');
    canvas.width = 32 * 30;
    canvas.height = 32 * 15;

    var graphy = new Graphy(canvas);
    graphy.setPixelsPerUnit(20);
    graphy.setOrigin(canvas.width / 2, canvas.height / 2);
    graphy.drawGrid();

    draw(graphy, "Math.sin(x)");
}

function initController() {
    var typeSelector = document.getElementById("math_type");
    typeSelector.onchange = function() {
        if (typeSelector.value == "sin") {

        } else {

        }
    }

}

function draw(graphy, expression) {
    graphy.graph(expression, "orange", 2);
}