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

    // load image
    this.bgImage = new Image();
    this.bgImage.src = "/web/image/background.png";
    this.mapImage = [];
    this.mapImage[0] = new Image();
    this.mapImage[0].src = "/web/image/characters/Other10.png";
    this.heroImage = new Image();
    this.heroImage.src = "/web/image/hero.png";
    this.monsterImage = new Image();
    this.monsterImage.src = "/web/image/monster.png";
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
    canvas.width = 32 * 30;
    canvas.height = 32 * 15;

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

        var hero = gameData.players[gameData.name];
        var offset = {
            "x": hero.x - 15,
            "y": hero.y - 5
        };
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (gameData.mapImage[0].width) {
            var offsetInner = {
                "bx": Math.floor(offset.x),
                "by": Math.floor(offset.y),
                "ox": offset.x - Math.floor(offset.x),
                "oy": offset.y - Math.floor(offset.y)
            };
            for(var i = Math.max(offsetInner.by, 0); i < Math.min(Math.ceil(offset.y + 15), gameData.map.height); ++i) {
                for(var j = Math.max(offsetInner.bx, 0); j < Math.min(Math.ceil(offset.x + 30), gameData.map.width); ++j) {
                    context.drawImage(gameData.mapImage[0],
                        2 * 32, 0, 31, 31,
                        ((j - offsetInner.bx) - offsetInner.ox) * 32, ((i - offsetInner.by) - offsetInner.oy) * 32, 32, 32
                    );
                }
            }
        }
        if (gameData.heroImage.width) {
            for(var player in gameData.players) {
                var x = (gameData.players[player].x - offset.x) * 32;
                var y = (gameData.players[player].y - offset.y) * 32;
                context.drawImage(gameData.heroImage, x, y);
                context.fillStyle = "rgb(250, 250, 250)";
                context.fillText(gameData.players[player].name, x, y - 32);
            }
        }
        if (gameData.monsterImage.width) {
            for(var enemy in gameData.enemies) {
                x = (gameData.enemies[enemy].x - offset.x) * 32;
                y = (gameData.enemies[enemy].y - offset.y) * 32;
                context.drawImage(gameData.monsterImage, x, y);
            }
        }

        // info
        context.fillStyle = "rgb(250, 250, 250)";
        context.font = "24px Helvetica";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText("point:" + hero.point, 32, 32);
    };

    var main = function () {
        update();
        render();

        requestAnimationFrame(main);
    };
    main();
}