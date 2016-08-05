function galaxian() {
    "use strict";

    var canvas = document.getElementById("canvas-game"),
        ctx = canvas.getContext("2d");

    var playerImage = document.getElementById("player"),
        enemyImage = document.getElementById("enemy"),
        lifeImage = document.getElementById("life"),
        enemiesRows = 5,
        enemiesOnRow = 10,
        enemies = [],
        lives = 3,
        deltaPosition = 42,
        // 1 left-to=right, -1 right-to-left
        enemyDirection = 1,
        listOfBullets = [],
        maxBulletCount = 6,
        framesCount = 0,
        keys = {
            "left": false,
            "right": false,
            "space": false,
            "ctrl": false
        };

    var score = 0;

    var player = {
        "x": 400,
        "y": 400,
        "sizeX": playerImage.width,
        "sizeY": playerImage.height,
        "moveDelta": 15,
        "visible": true,
        "image": playerImage
    };

    function Bullet(x, y, shooter) {
        return {
            "x": x,
            "y": y - 5,
            "sizeX": 6,
            "sizeY": 8,
            "bulletSpeed": 7,
            "shooter": shooter,
            "visible": true
        };
    }

    function Enemy(x, y) {
        return {
            "x": x,
            "y": y,
            "sizeX": enemyImage.width,
            "sizeY": enemyImage.height,
            "visible": true,
            "speed": 4,
            "image": enemyImage
        };
    }

    function movePlayer(player, direction, ctx, canvasWidth) {
        if (direction === "left") {
            if (player.x - player.moveDelta >= 0) {
                ctx.clearRect(player.x, player.y, player.sizeX, player.sizeY);
                player.x -= player.moveDelta;
            }
        } else if (direction === "right") {
            if (player.x + player.sizeX + player.moveDelta <= canvasWidth) {
                ctx.clearRect(player.x, player.y, player.sizeX, player.sizeY);
                player.x += player.moveDelta;
            }
        }
    }

    function addPlayerBullet(player) {
        if (listOfBullets.length < maxBulletCount) {
            let bulletx = (2 * player.x + player.sizeX) / 2;
            let bullet = new Bullet(bulletx, player.y, "player");
            listOfBullets.push(bullet);
        }
    }

    document.body.addEventListener("keydown", function (ev) {
        let key = ev.keyCode;

        if (key === 37) {
            keys.left = true;
        } else if (key === 39) {
            keys.right = true;
        } else if (key === 32) {
            keys.space = true;
        } else if (key === 17) {
            keys.ctrl = true;
        }

        if (keys.left) {
            movePlayer(player, "left", ctx, canvas.width);
            if (keys.space || keys.ctrl) {
                // space and ctrl for shooting 
                addPlayerBullet(player);
            }
        } else if (keys.right) {
            movePlayer(player, "right", ctx, canvas.width);
            if (keys.space || keys.ctrl) {
                // space and ctrl for shooting 
                addPlayerBullet(player);
            }
        }

       if (keys.space || keys.ctrl) {
            // space and ctrl for shooting 
            addPlayerBullet(player);
        }
    }, false);

    document.body.addEventListener("keyup", function (ev) {
        let key = ev.keyCode;

        if (key === 37) {
            keys.left = false;
        } else if (key === 39) {
            keys.right = false;
        } else if (key === 32) {
            keys.space = false;
        } else if (key === 17) {
            keys.ctrl = false;
        }
    }, false);

    function collisionChecker(item, collection) {
        let itemX2 = item.x + item.sizeX,
            itemY2 = item.y + item.sizeY;

        for (let current of collection) {
            if (!current.visible) {
                continue;
            }

            let currentX2 = current.x + current.sizeX,
                currentY2 = current.y + current.sizeY;

            if (((current.x <= item.x && item.x <= currentX2) ||
                (current.x <= itemX2 && itemX2 <= currentX2)) &&
                ((current.y <= item.y && item.y <= currentY2) ||
                    (current.y <= itemY2 && itemY2 <= currentY2))) {

                item.visible = false;

                if (item.shooter === "enemy") {
                    if (lives > 0) {
                        lives -= 1;
                    }
                    // player die
                    if (lives <= 0) {
                        console.log("Burn Burn motherfucker!!");
                    }
                } else {
                    current.visible = false;
                    score += 1;
                }
                break;
            }

        }
    }

    function createEnemies() {
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
        let changeDirection = false;
        for (let enemy of list) {
            ctx.clearRect(enemy.x, enemy.y, enemy.sizeX, enemy.sizeY);

            enemy.x += enemyDirection * enemy.speed;
            if ((!changeDirection) &&
                (enemyDirection > 0) &&
                (enemy.x + enemy.sizeX + enemy.speed >= canvas.width)) {
                changeDirection = true;
            }

            if ((!changeDirection) &&
                (enemyDirection < 0) &&
                (enemy.x - enemy.speed <= 0)) {
                changeDirection = true;
            }
        }

        if (changeDirection) {
            enemyDirection = -enemyDirection;
        }
    }
    function enemiesShoot(list) {
        let attacker = randomEnemy();
        while (!list[attacker]) {

            // debugger;
            attacker = randomEnemy();
        }
        var shooter = list[attacker];
        let bulletx = (2 * shooter.x + shooter.sizeX) / 2;
        let bullet = new Bullet(bulletx, shooter.y, "enemy");
        listOfBullets.push(bullet);
    }
    function randomEnemy() {
        let randomEnemy = Math.random() * enemiesOnRow * enemiesRows;
        randomEnemy = Math.floor(randomEnemy);
        return randomEnemy;
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
            ctx.clearRect(bullet.x - 3, bullet.y - 8, bullet.sizeX + 3, bullet.sizeY + 8);

            if (bullet.shooter === "player") {
                bullet.y -= bullet.bulletSpeed;

                collisionChecker(bullet, enemies);
            } else {
                bullet.y += bullet.bulletSpeed;
                var playerArr = [];
                playerArr.push(player);
                collisionChecker(bullet, playerArr);
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

    function drawScoreAndLives() {
        ctx.clearRect(10, 475, 100, 20);
        ctx.font = "15px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 10, 490);

        for(let i = 0; i < lives; i += 1) {
            ctx.drawImage(lifeImage, 100 + i * (lifeImage.width + 10), 475, lifeImage.width, lifeImage.height);
        }

        for(let i = 2; i >= lives; i -= 1) {
            ctx.clearRect(100 + i * (lifeImage.width + 10), 475, lifeImage.width, lifeImage.height);
        }
    }

    function gameLoop() {
        ctx.drawImage(player.image, player.x, player.y, player.sizeX, player.sizeY);
        framesCount += 1;

        if (listOfBullets.length > 0) {
            moveBullets(listOfBullets);
            removeInvisible(listOfBullets);
            drawBullets(listOfBullets);
        }

        if (enemies.length <= 0) {
            enemies = createEnemies();
        } else {
            moveEnemies(enemies);
            if (framesCount % 50 === 0) {
                enemiesShoot(enemies);
            }
            removeInvisible(enemies);
            drawEnemies(enemies);
        }

        drawScoreAndLives();


        window.requestAnimationFrame(gameLoop);
    }
    
    window.requestAnimationFrame(gameLoop);
}

window.onload = galaxian;