const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Resize for mobile
canvas.width = 320;
canvas.height = 520;

// Images
const playerImg = new Image();
const obstacleImg = new Image();

playerImg.src = "player.png";
obstacleImg.src = "brinjal.png";

// Game variables
let gravity = 0.4;
let jumpPower = -8;
let score = 0;
let gameOver = false;
let gameStarted = false;

// Player
let player;

// Obstacles
let obstacles = [];
let obstacleTimer = 0;

// Init / Reset game
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

// Controls (tap & space)
function jump() {
  if (!gameStarted) {
    initGame();
    return;
  }

  if (gameOver) {
    initGame();
    return;
  }

  player.velocity = jumpPower;
}

document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// Create obstacle
function createObstacle() {
  obstacles.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 160),
    width: 70,
    height: 40
  });
}

// Update
function update() {
  if (!gameStarted || gameOver) return;

  player.velocity += gravity;
  player.y += player.velocity;

  // Ground collision
  if (player.y + player.height > canvas.height) {
    gameOver = true;
  }

  // Obstacles
  obstacleTimer++;
  if (obstacleTimer > 120) {
    createObstacle();
    obstacleTimer = 0;
  }

  obstacles.forEach(o => {
    o.x -= 2.5;

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

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#1fa3a3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  if (player) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }

  // Obstacles
  obstacles.forEach(o => {
    ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  // Start / Game over text
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
