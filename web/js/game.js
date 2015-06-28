window.onload=function() {
    // socket
    var ws = new WebSocket("ws://" + location.host + "/game");
    ws.onopen = function(event) {
        console.log("ws connected");
        game(ws);
    }
};

function game(socket) {
    // canvas
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = 480;

    // game objects
    var users = [];
    var name = "";
    var hero = {
        speed: 256,
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    var monster = {
        x: -100,
        y: -100
    };
    var monstersCaught = 0;

    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        users = data["users"];
        name = data["name"];
        monster.x = data["goblin"]["x"];
        monster.y = data["goblin"]["y"];
        monstersCaught = data["users"][name]["point"];
    };

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
    var update = function (modifier) {
        if (38 in keysDown) { // Player holding up
            hero.y -= hero.speed * modifier;
        }
        if (40 in keysDown) { // Player holding down
            hero.y += hero.speed * modifier;
        }
        if (37 in keysDown) { // Player holding left
            hero.x -= hero.speed * modifier;
        }
        if (39 in keysDown) { // Player holding right
            hero.x += hero.speed * modifier;
        }

        // todo: just send action
        socket.send(JSON.stringify({
            'x': hero.x,
            'y': hero.y
        }));
    };

    // Draw everything
    var render = function () {
        var context = canvas.getContext("2d");
        if (bgReady) {
            context.drawImage(bgImage, 0, 0, canvas.parentNode.offsetWidth, 480);
        }

        if (heroReady) {
            for(var user in users) {
                context.drawImage(heroImage, users[user].x, users[user].y);
                context.fillText(users[user].name, users[user].x, users[user].y - 32);
            }
            // context.drawImage(heroImage, hero.x, hero.y);
        }

        if (monsterReady) {
            context.drawImage(monsterImage, monster.x, monster.y);
        }

        // Score
        context.fillStyle = "rgb(250, 250, 250)";
        context.font = "24px Helvetica";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText("Goblins caught: " + monstersCaught, 32, 32);
    };

    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    // Let's play this game!
    var then = Date.now();
    main();
}