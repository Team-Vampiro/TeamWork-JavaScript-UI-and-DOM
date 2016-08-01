function galaxian() {
    var canvas = document.getElementById("canvas-game");
    var ctx = canvas.getContext("2d");

    var playerImage = document.getElementById("player");

    var player = {
        "x": 400,
        "y": 400,
        "sizeX": 80,
        "sizeY": 80,
        "moveDelta": 5,
        "image": playerImage
    }

    document.body.addEventListener("keydown", function (ev) {
        var key = ev.keyCode;

        if (key === 37) {
            // left
            if (player.x - player.moveDelta >= 0) {
                player.x -= player.moveDelta;
            }
        } else if (key === 39) {
            //right
            if (player.x + player.sizeX + player.moveDelta <= canvas.width) {
                player.x += player.moveDelta;
            }
        } else if (key === 32 || key === 17) {
            // space and ctrl for shooting 
            console.log("pew pew");
        }
    }, false);



    function gameLoop() {
        ctx.clearRect(player.x - 5, player.y - 5, player.sizeX + 10, player.sizeY + 10);
        ctx.drawImage(playerImage, player.x, player.y, player.sizeX, player.sizeY);

        window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);
}

window.onload = galaxian;