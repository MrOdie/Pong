// select canvas
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// ball 
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
}

// user paddle
const user = {
    x: 0,
    y: (canvas.height - 100)/2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

// ai/computer paddle
const com = {
    x: canvas.width - 10,
    y: (canvas.height - 100)/2,
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

// create the net
const net = {
    x: (canvas.width - 2)/2,
    y: 0,
    height: 10,
    width: 2,
    color: "WHITE"
}

//draw rect function
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//draw circle
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// control the user paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// reset ball
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

//DRAW NET
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}


//drawCircle(100, 100, 50, "WHITE");

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

//drawText("something",300,200,"WHITE")

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

//update : pos, mov, score
function update() {
    // update the score
    if (ball.x - ball.radius < 0) {
        //com win
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    //ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple ai to control com paddle
    computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    //when ball collides with bottom and top walls, inverse y velocity
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

    //if ball hits paddle
    if (collision(ball, player)) {
        // where the ball hits the player
        let collidePoint = (ball.y - (player.y + player.height/2));

        //normalization
        collidePoint = collidePoint / (player.height/2);

        //calculate angle in radian
        let angleRad = (Math.PI/4) * collidePoint;

        // X direction of the ball when hits paddle
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        //change vel x and y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // increase ball speed everytime it hits the paddle
        ball.speed += 0.1;
    }

}

// render function
function render() {
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    // draw the score
    drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");
    
    //draw the net
    drawNet();

    // draw user and comp paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// game init
function game() {
    update();
    render();
}

// loop 
const framePerSecond = 50;
let loop = setInterval(game, 1000/framePerSecond);