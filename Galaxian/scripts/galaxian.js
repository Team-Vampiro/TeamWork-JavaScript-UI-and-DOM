function galaxian() {
    "use strict";

    var canvas = document.getElementById("canvas-game"),
        ctx = canvas.getContext("2d");

    Object.prototype.extends = function (parent) {
        this.prototype = Object.create(parent.prototype);
        this.prototype.constructor = this;
    };

    var playerImage = document.getElementById("player"),
        enemyImage = document.getElementById("enemy"),
        lifeImage = document.getElementById("life"),
        asteroidImage = document.getElementById("asteroid"),
        bombImage = document.getElementById("bomb"),
        enemiesRows = 5,
        enemiesOnRow = 10,
        enemies = [],
        lives = 3,
        gameover = false,
        bonusObjects = [],
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
        },
        currentLevel = 1,
        playerBombs = [];

    var score = 0;

    var Constants = {
        asteroidType: 'Asteroid',
        lifeType: 'Live',
        bombType: 'Bomb'
    };

    var KeyCodes = {
        b: 66,
        B: 98
    };

    var bonusObjectType = {
        1: {
            type: Constants.lifeType,
            speed: currentLevel,
            image: lifeImage
        },
        2: {
            type: Constants.bombType,
            speed: currentLevel,
            image: bombImage
        },
        3: {
            type: Constants.asteroidType,
            speed: currentLevel,
            image: asteroidImage
        }
    };

    var player = {
        "x": 400,
        "y": 400,
        "sizeX": playerImage.width,
        "sizeY": playerImage.height,
        "moveDelta": 15,
        "visible": true,
        "image": playerImage
    };

    function MovableObject(x, y, sizeX, sizeY, visible) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.visible = visible;
        return this;
    }

    function BonusObject(params, x, y, deltaX, deltaY) {
        var props = bonusObjectType[params];
        this.type = props.type;
        this.speed = props.speed;
        this.image = props.image;
        MovableObject.call(this, x, y, this.image.height, this.image.width, true);
        this.draw = function () {
            this.clear();
            ctx.drawImage(this.image, this.x, this.y, this.sizeX, this.sizeY);
        };

        this.clear = function () {
            ctx.clearRect(this.x - 1, this.y - 1, this.sizeX + 1, this.sizeY);
        };

        return this;
    }

    function Bullet(x, y, shooter) {
        MovableObject.call(this, x, y - 5, 6, 8, true);
        this.bulletSpeed = 7;
        this.shooter = shooter;

        return this;
    }

    Bullet.extends(MovableObject);

    function Enemy(x, y) {
        MovableObject.call(this, x, y, enemyImage.width, enemyImage.height, true);
        this.speed = 4;
        this.image = enemyImage;
        return this;
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

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    document.body.addEventListener('keypress', function (ev) {
        let key = ev.keyCode;

        if (key === KeyCodes.b || key === KeyCodes.B) {
            if (playerBombs.length) {
                var bomb = playerBombs[0];
                playerBombs.splice(0, 1);
                bomb.sizeX *= 6;
                bomb.sizeY *= 6;
                bomb.x = player.x - bomb.sizeX;
                bomb.y -= getRandomInt(220, 390);
                collisionChecker(bomb, enemies, true);
            }
        }

    }, false);

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

    function collisionChecker(item, collection, bombing) {
        let itemX2 = item.x + item.sizeX,
            itemY2 = item.y + item.sizeY;

        for (let current of collection) {
            if (!current.visible) {
                continue;
            }

            let currentX2 = current.x + current.sizeX,
                currentY2 = current.y + current.sizeY;

            if ((bombing && checkBombing(item, current)) || ((current.x <= item.x && item.x <= currentX2) ||
                (current.x <= itemX2 && itemX2 <= currentX2)) &&
                ((current.y <= item.y && item.y <= currentY2) ||
                    (current.y <= itemY2 && itemY2 <= currentY2))) {

                item.visible = false;

                if (item.type === Constants.lifeType) {
                    lives += 1;
                    item.clear();
                    continue;
                } else if (item.type === Constants.bombType && !bombing) {
                    playerBombs.push(item);
                    item.clear();
                    continue;
                } else if (item.type === Constants.asteroidType) {
                    if (lives > 0) {
                        lives -= 1;
                    } else {
                        gameover = true;
                        console.log("Burn Burn motherfucker!!");
                    }
                    item.clear();
                    continue;
                }

                if (item.shooter === "enemy") {
                    if (lives > 0) {
                        lives -= 1;
                    } else {
                        gameover = true;
                        console.log("Burn Burn motherfucker!!");
                    }
                } else {
                    current.visible = false;
                    score += 1;
                }

                if (!bombing) break;
            }

        }
    }

    function checkBombing(bomb, current) {
        var rightBombX = bomb.x + bomb.sizeX,
            bottomBombY = bomb.y + bomb.sizeY,
            rightCurrentX = current.x + current.sizeX,
            bottomCurrentY = current.y + current.sizeY;

        if (bomb.x < rightCurrentX && rightBombX > current.x &&
            bomb.y < bottomCurrentY && bottomBombY > current.y) {
            return true;
        }

        return false;
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

    function moveBonusObjects() {
        for (var key in bonusObjects) {
            if (bonusObjects.hasOwnProperty(key)) {
                var current = bonusObjects[key];
                current.y += current.speed;
                if (current.y - current.radius > ctx.canvas.height) {
                    bonusObjects.splice(key, 1);
                    key--;
                }
                current.draw();
                collisionChecker(current, [player]);
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
        ctx.clearRect(10, 460, ctx.canvas.width, 45);
        ctx.font = "15px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 10, 490);

        for (var j = 0; j < playerBombs.length; j++) {
            ctx.drawImage(bombImage, 100 + j * (bombImage.width + 15), 450, bombImage.width, bombImage.height);
        }

        for (let i = 0; i < lives; i += 1) {
            ctx.drawImage(lifeImage, 100 + i * (lifeImage.width + 10), 475, lifeImage.width, lifeImage.height);
        }

        for (let i = 2; i >= lives; i -= 1) {
            ctx.clearRect(100 + i * (bombImage.width + 15), 450, bombImage.width, bombImage.height);
        }

        for (let i = 2; i >= lives; i -= 1) {
            ctx.clearRect(100 + i * (lifeImage.width + 10), 475, lifeImage.width, lifeImage.height);
        }
    }

    function createBonusObject() {
        var objectType = Math.floor(Math.random() * (4 - 1) + 1),
            xCoords = Math.floor(Math.random() * (ctx.canvas.width - 1)) + 1;
        var bonusObject = new BonusObject(objectType, xCoords, 0);
        bonusObjects.push(bonusObject);
    }

    function drawBonusObject() {
        for (var key in bonusObjects) {
            if (bonusObjects.hasOwnProperty(key)) {
                var bonusObject = bonusObjects[key];
                bonusObject.draw();
            }
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
            currentLevel++;
        } else {
            moveEnemies(enemies);
            if (framesCount % 50 === 0) {
                enemiesShoot(enemies);
            }

            var random = Math.floor(Math.random() * 1000);

            if (framesCount % random === 0) {
                createBonusObject();
            }

            if (bonusObjects.length) {
                moveBonusObjects(bonusObjects);
                removeInvisible(bonusObjects);
                drawBonusObject(bonusObjects);
            }

            removeInvisible(enemies);
            drawEnemies(enemies);
        }

        drawScoreAndLives();

        if (gameover) {
            var name = window.prompt("Enter your name", "Nobody");
            checkTopScores(name,score);

        } else {
            window.requestAnimationFrame(gameLoop);
        }
    }

    window.requestAnimationFrame(gameLoop);
}