const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 520;

// Images
const playerImg = new Image();
const obstacleImg = new Image();
playerImg.src = "player.png";
obstacleImg.src = "brinjal.png";

// Game variables
let gravity = 0.4;
let jumpPower = -6;          // reduced jump
let maxUpSpeed = -7;        // speed limiter
let score = 0;
let gameOver = false;
let gameStarted = false;

// Player
let player;

// Obstacles
let obstacles = [];
let obstacleTimer = 0;

// Init game
function initGame() {
  player = {
    x: 120,
    y: 220,
    width: 60,
    height: 80,
    velocity: 0
  };

  obstacles = [];
  score = 0;
  obstacleTimer = 0;
  gameOver = false;
  gameStarted = true;
}

// Jump control (smooth)
function jump() {
  if (!gameStarted || gameOver) {
    initGame();
    return;
  }

  // limit upward speed
  if (player.velocity > maxUpSpeed) {
    player.velocity = jumpPower;
  }
}

document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// Create obstacles (TOP & BOTTOM)
function createObstaclePair() {
  const gap = 160;
  const topHeight = Math.random() * 120 + 40;

  obstacles.push({
    x: canvas.width,
    y: topHeight - 40,
    width: 70,
    height: 40,
    angle: 0,
    speed: -0.05
  });

  obstacles.push({
    x: canvas.width,
    y: topHeight + gap,
    width: 70,
    height: 40,
    angle: 0,
    speed: 0.05
  });
}

// Update game
function update() {
  if (!gameStarted || gameOver) return;

  // Player physics
  player.velocity += gravity;
  player.y += player.velocity;

  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) {
    gameOver = true;
  }

  // Obstacles timing
  obstacleTimer++;
  if (obstacleTimer > 140) {
    createObstaclePair();
    obstacleTimer = 0;
  }

  obstacles.forEach(o => {
    o.x -= 2.5;
    o.angle += o.speed;

    // Collision
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      gameOver = true;
    }
  });

  obstacles = obstacles.filter(o => o.x + o.width > 0);
  score++;
}

// Draw rotated image
function drawRotatedImage(img, x, y, w, h, angle) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

// Draw game
function draw() {
  ctx.fillStyle = "#1fa3a3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (player) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }

  obstacles.forEach(o => {
    drawRotatedImage(obstacleImg, o.x, o.y, o.width, o.height, o.angle);
  });

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  if (!gameStarted) {
    ctx.font = "22px Arial";
    ctx.fillText("TAP TO START", 85, 260);
  }

  if (gameOver) {
    ctx.font = "26px Arial";
    ctx.fillText("GAME OVER", 70, 240);
    ctx.font = "14px Arial";
    ctx.fillText("Tap to Restart", 95, 270);
  }
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start after images load
let loaded = 0;
[playerImg, obstacleImg].forEach(img => {
  img.onload = () => {
    loaded++;
    if (loaded === 2) loop();
  };
});
