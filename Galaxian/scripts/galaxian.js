function galaxian() {
    var canvas = document.getElementById("canvas-game");
    var ctx = canvas.getContext("2d");

    var playerImage = document.getElementById("player"),
        enemyImage = document.getElementById("enemy"),
        enemiesRows = 5,
        enemiesOnRow = 10,
        enemies = [],
        listOfBullets = [];

    var score = 0;

    var player = {
        "x": 400,
        "y": 400,
        "sizeX": 80,
        "sizeY": 80,
        "moveDelta": 15,
        "image": playerImage
    }

    function Bullet(x, y, shooter) {
        return {
            "x": x,
            "y": y - 5,
            "sizeX": 5,
            "sizeY": 5,
            "bulletSpeed": 8,
            "shooter": shooter,
            "visible": true
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

    function collisionChecker(item, collection) {

        let itemX2 = item.x + item.sizeX,
            itemY2 = item.y + item.sizeY;

        for (let current of collection) {
            let currentX2 = current.x + current.sizeX,
                currentY2 = current.y + current.sizeY;

            if (((current.x <= item.x && item.x <= currentX2) ||
                (current.x <= itemX2 && itemX2 <= currentX2)) &&
                ((current.y <= item.y && item.y <= currentY2) ||
                    (current.y <= itemY2 && itemY2 <= currentY2))) {

                current.visible = false;
                item.visible = false;

                if (item.shooter === 'enemy') {
                    // player die (prolly life -- bla bla )
                } else {
                    score += 1;
                    console.log(score);
                }
                break;
            }

        }
    }

    function createEnemies() {
        var deltaPosition = 42;
        var tempEnemies = [];
        for (let i = 0; i < enemiesOnRow; i += 1) {
            //let enOnRow = [];
            for (let j = 0; j < enemiesRows; j += 1) {
                //enOnRow += new Enemy(i * deltaPosition, j * deltaPosition);
                tempEnemies.push(new Enemy(i * deltaPosition, j * deltaPosition));
            }

        }
        return tempEnemies;
    }

    function moveEnemies(list) {
        for (let enemy of list) {
            ctx.clearRect(enemy.x, enemy.y, enemy.sizeX, enemy.sizeY);

            // TODO 
        }
    }

    function drawEnemies(enemies) {
        for (let i = 0; i < enemies.length; i += 1) {
            let enemy = enemies[i];
            if (enemy.visible) {
                ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.sizeX, enemy.sizeY);
            }
        }
    }

    function moveBullets(list) {
        for (let bullet of list) {
            ctx.clearRect(bullet.x - 3, bullet.y - 5, bullet.sizeX + 3, bullet.sizeY + 5);

            if (bullet.shooter === 'player') {
                bullet.y -= bullet.bulletSpeed;
            } else {
                bullet.y += bulletSpeed;
            }
            if (bullet.shooter === 'player') {
                collisionChecker(bullet, enemies);
            } else {
                // TODO check that works at all when enemies start shooting too
                collisionChecker(bullet, player);
            }

            if (bullet.y < 0 || bullet.y > canvas.height) {
                bullet.visible = false;
            }

            if (!bullet.visible) {
                ctx.clearRect(bullet.x - 3, bullet.y, bullet.sizeX + 3, bullet.sizeY);
            }
        }
    }

    function drawBullets(list) {
        for (let bullet of list) {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.lineWidth = bullet.sizeX;
            ctx.moveTo(bullet.x, bullet.y);
            ctx.lineTo(bullet.x, bullet.y - bullet.sizeY);
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
            enemies = createEnemies();
        } else {
            moveEnemies(enemies);
            removeInvisible(enemies);
            drawEnemies(enemies);
        }

        window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);
}

window.onload = galaxian;