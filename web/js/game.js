var xmlHttp;

function createXmlHttp() {
	if(window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
	    try {
            xmlHttp = new ActiveXObject("MSXML2.XMLHttp");

        } catch(e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHttp");

        }
	}
}

window.onload=function() {
    // canvas
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = 480;

    // Game objects
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

    createXmlHttp();
    xmlHttp.onreadystatechange = function callback() {
        if (xmlHttp.readyState != 4) {
        } else {
            var obj = eval('(' + xmlHttp.responseText + ')');
            users = obj["users"];
            name = obj["name"];
            // hero.x = obj["users"][name]["x"];
            // hero.y = obj["users"][name]["y"];
            monster.x = obj["goblin"]["x"];
            monster.y = obj["goblin"]["y"];
            monstersCaught = obj["users"][name]["point"];
        }
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
        xmlHttp.open("post", "/game" + "?x=" + hero.x + "&y=" + hero.y, true);
        xmlHttp.send(null);
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
        var len = 0;
        for(var key in users) {
            len += 1;
        }
        context.fillText("Goblins caught: " + monstersCaught + "num:" +len, 32, 32);
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
};
