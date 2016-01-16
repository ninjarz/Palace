window.onload = function() {
    var canvas = document.getElementById('math_canvas');
    canvas.width = 32 * 30;
    canvas.height = 32 * 15;

    var graphy = new Graphy(canvas);
    graphy.setPixelsPerUnit(20);
    graphy.setOrigin(canvas.width / 2, canvas.height / 2);
    graphy.drawGrid();

    graphy.graph("x * Math.sin(x)", "orange", 2);
};