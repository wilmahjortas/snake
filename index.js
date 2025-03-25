const canvas = document.getElementById('game');

const ctx = canvas.getContext('2d');
const tileCount = 18;
const tileSize = canvas.width / tileCount - 2;

const playAgainBtn = document.getElementById('play');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 5;

let headX = 9;
let headY = 9;
const snakeParts = [];
let tailLength = 2;

let appleX = getNewAppleLocation(-1);
let appleY = getNewAppleLocation(-1);

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio('./gulp.mp3');

let timerID = -1;

//game loop
function drawGame() {
    changeSnakePosition();
    checkAppleCollision();

    if (isGameOver()) {
        drawGameOver();
        if (timerID !== -1) clearTimeout(timerID);
        return;
    }

    clearScreen();
    drawApple();
    drawSnake();
    drawScore();

    timerID = setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }
    return checkWallCollision() || checkSnakeCollision();
}

function checkWallCollision() {
    return headX < 0 || headX === tileCount || headY < 0 || headY === tileCount;
}

function checkSnakeCollision() {
    return snakeParts.some(part => (part.x === headX && part.y === headY));
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
    while (snakeParts.length > tailLength) {
        snakeParts.shift(); // remove the furthest item from the snake parts if have more than our tail size.
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    if (snakeParts.some(part => (part.x === appleX && part.y === appleY))) {
        appleX = getNewAppleLocation(appleX);
        appleY = getNewAppleLocation(appleY);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function checkAppleCollision() {
    if (appleX === headX && appleY == headY) {
        gulpSound.play();
        appleX = getNewAppleLocation(appleX);
        appleY = getNewAppleLocation(appleY);
        tailLength++;
        score++;
        if (score % 5 == 0) {
            speed++;
            if (1000/speed <= 5) {
                speed--;
            }
        }
    }
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //left
    if (event.keyCode == 37) {
        turnLeft();
    }

    //right
    if (event.keyCode == 39) {
        turnRight();
    }
}

function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";
    ctx.textAlign = "center";
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;

    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.strokeText("Game Over!", canvas.width / 2, canvas.height / 2);
    playAgainBtn.style.visibility = "visible";
    playAgainBtn.focus();
}

function resetGame() {
    speed = 5;

    headX = 9;
    headY = 9;
    snakeParts.splice(0, snakeParts.length);
    tailLength = 2;

    appleX = getNewAppleLocation(-1);
    appleY = getNewAppleLocation(-1);

    xVelocity = 0;
    yVelocity = 0;

    score = 0;
    timerID = -1;
}

function getNewAppleLocation(currentLocation) {
    let newLocation = Math.floor(Math.random() * tileCount);
    if (currentLocation !== newLocation) {
        return newLocation;
    } else {
        return getNewAppleLocation(currentLocation);
    }
}

function onPlayBtnClick() {
    playAgainBtn.style.visibility = "hidden";
    resetGame();
    drawGame();
}

function turnLeft(){
    if (yVelocity == 0 && xVelocity == 0) {
        yVelocity = -1;
    }

    if (yVelocity == 1) {
        xVelocity = 1;
        yVelocity = 0;
    } else if (yVelocity == -1) {
        xVelocity = -1;
        yVelocity = 0;
    } else if (xVelocity == 1) {
        xVelocity = 0;
        yVelocity = -1;
    } else if (xVelocity == -1) {
        xVelocity = 0;
        yVelocity = 1;
    }
}

function turnRight(){
    if (yVelocity == 0 && xVelocity == 0) {
        yVelocity = -1;
    }

    if (yVelocity == 1) {
        xVelocity = -1;
        yVelocity = 0;
    } else if (yVelocity == -1) {
        xVelocity = 1;
        yVelocity = 0;
    } else if (xVelocity == 1) {
        xVelocity = 0;
        yVelocity = 1;
    } else if (xVelocity == -1) {
        xVelocity = 0;
        yVelocity = -1;
    }
}

function onLeftBtnClick() {
    turnLeft();
}

function onRightBtnClick() {
    turnRight();
}

drawGame();


