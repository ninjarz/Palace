window.onload=function() {
    // socket
    var ws = new WebSocket("ws://" + location.host + "/game");
    ws.onopen = function(event) {
        console.log("ws connected");
        ws.send(JSON.stringify({
            "commands": [0]
    }));
    };
    // init
    var flag = false;
    var gameData = new GameData();
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        for(var tmp in data) {
            eval("gameData." + tmp + '= data[tmp]');
        }
        if(!flag) {
            flag = true;
            scene(ws, gameData);
        }
    };

};

function GameData() {
    // game objects
    this.name = "";
    this.map = {};
    this.players = {};
    this.enemies = [];
}

function scene(socket, gameData) {
    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        for(var tmp in data) {
            eval("gameData." + tmp + '= data[tmp]');
        }
    };

    // canvas
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = 32 * gameData.map.width;
    canvas.height = 32 * gameData.map.height;

    // load image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "/web/image/background.png";
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    heroImage.src = "/web/image/hero.png";
    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    monsterImage.src = "/web/image/monster.png";

    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    // Update game objects
    var update = function () {
        var actions = [];
        if (38 in keysDown) { // Player holding up
            actions.push(38);
        }
        if (40 in keysDown) { // Player holding down
            actions.push(40);
        }
        if (37 in keysDown) { // Player holding left
            actions.push(37);
        }
        if (39 in keysDown) { // Player holding right
            actions.push(39);
        }

        socket.send(JSON.stringify({
            "actions": actions
        }));
    };

    // Draw everything
    var render = function () {
        var context = canvas.getContext("2d");
        if (bgReady) {
            context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        }

        if (heroReady) {
            for(var player in gameData.players) {
                var x = gameData.players[player].x * 32;
                var y = gameData.players[player].y * 32;
                context.drawImage(heroImage, x, y);
                context.fillText(gameData.players[player].name, x, y - 32);
            }
        }

        if (monsterReady) {
            for(var enemy in gameData.enemies) {
                x = gameData.enemies[enemy].x * 32;
                y = gameData.enemies[enemy].y * 32;
                context.drawImage(monsterImage, x, y);
            }
        }

        // Score
        context.fillStyle = "rgb(250, 250, 250)";
        context.font = "24px Helvetica";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText("point:" + gameData.players[gameData.name].point, 32, 32);
    };

    // The main game loop
    var main = function () {
        update();
        render();

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    // Let's play this game!
    main();
}