function galaxian() {
    var canvas = document.getElementById("canvas-game");
    var ctx = canvas.getContext("2d");

    var playerImage = document.getElementById("player");

    var listOfBullets = [];

    var player = {
        "x": 400,
        "y": 400,
        "sizeX": 80,
        "sizeY": 80,
        "moveDelta": 15,
        "image": playerImage
    }

    var enemyImage = document.getElementById("enemy"),
        enemiesRows = 5,
        enemiesOnRow = 10,
        enemies = [];


    function Bullet(x, y, shooter) {
        return {
            "x": x,
            "y": y - 5,
            "bulletSpeed": 5,
            "shooter": shooter,
            "visible": true,
            "width": 5
        }
    }

    function Enemy(x, y) {
        return {
            "x": x,
            "y": y,
            "sizeX": 32,
            "sizeY": 32,
            "visible": true,
            "image": enemyImage
        };
    }

    document.body.addEventListener("keydown", function (ev) {
        let key = ev.keyCode;

        if (key === 37) {
            // left
            if (player.x - player.moveDelta >= 0) {
                ctx.clearRect(player.x, player.y, player.sizeX, player.sizeY);
                player.x -= player.moveDelta;
            }
        } else if (key === 39) {
            //right
            if (player.x + player.sizeX + player.moveDelta <= canvas.width) {
                ctx.clearRect(player.x, player.y, player.sizeX, player.sizeY);
                player.x += player.moveDelta;
            }
        } else if (key === 32 || key === 17) {
            // space and ctrl for shooting 
            let bulletx = (2 * player.x + player.sizeX) / 2;
            let bullet = new Bullet(bulletx, player.y, "player");
            listOfBullets.push(bullet);
        }
    }, false);

    function CreateEnemies() {
        var deltaPosition = 42;
        var tempEnemies = [];
        for (let i = 0; i < enemiesOnRow; i += 1) {
            //let enOnRow = [];
            for (let j = 0; j < enemiesRows; j += 1) {
                //enOnRow += new Enemy(i * deltaPosition, j * deltaPosition);
                tempEnemies.push(new Enemy(i * deltaPosition, j * deltaPosition));
            }

        }
        console.log(tempEnemies);
        return tempEnemies;
    }

    function DrawEnemies(enemies) {
        for (let i = 0; i < enemies.length; i += 1) {
            let enemy = enemies[i];
            if (enemy.visible) {
                ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.sizeX, enemy.sizeY);
            }
        }
    }

    function moveBullets(list) {
        for (let bullet of list) {
            ctx.clearRect(bullet.x - 3, bullet.y, bullet.width + 3, 5);

            if (bullet.shooter === 'player') {
                bullet.y -= bullet.bulletSpeed;
            } else {
                bullet.y += bulletSpeed;
            }

            if (bullet.y < 0 || bullet.y > canvas.height) {
                bullet.visible = false;
            }
        }
    }

    function drawBullets(list) {
        for (let bullet of list) {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.lineWidth = bullet.width;
            ctx.moveTo(bullet.x, bullet.y);
            ctx.lineTo(bullet.x, bullet.y - 5);
            ctx.stroke();
        }
    }

    function removeInvisible(list) {
        for (let i = 0; i < list.length; i += 1) {
            if (!list[i]) {
                break;
            }

            if (!list[i].visible) {
                list.splice(i, 1);
                i--;
            }
        }
    }

    function gameLoop() {
        ctx.drawImage(player.image, player.x, player.y, player.sizeX, player.sizeY);

        if (listOfBullets.length > 0) {
            moveBullets(listOfBullets);
            removeInvisible(listOfBullets);
            drawBullets(listOfBullets);
        }

        if (enemies.length <= 0) {
            enemies = CreateEnemies();
        } else {
            DrawEnemies(enemies);
        }

        window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);
}

window.onload = galaxian;