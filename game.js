const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Bigger canvas
canvas.width = 420;
canvas.height = 700;

// Images
const playerImg = new Image();
const obstacleImg = new Image();
playerImg.src = "player.png";
obstacleImg.src = "brinjal.png";

// Game variables
let gravity = 0.45;
let jumpPower = -7;
let maxUpSpeed = -8;
let score = 0;
let gameOver = false;
let gameStarted = false;

// Player
let player;

// Obstacles
let obstacles = [];
let obstacleTimer = 0;

// Zig-zag path (TOP ↔ BOTTOM)
const zigZagPattern = [80, 520, 140, 460, 200, 400, 260, 340];

// Init / Reset game
function initGame() {
  player = {
    x: 170,
    y: 300,
    width: 70,
    height: 90,
    velocity: 0
  };

  obstacles = [];
  score = 0;
  obstacleTimer = 0;
  gameOver = false;
  gameStarted = true;
}

// Jump control
function jump() {
  if (!gameStarted || gameOver) {
    initGame();
    return;
  }

  if (player.velocity > maxUpSpeed) {
    player.velocity = jumpPower;
  }
}

document.addEventListener("click", jump);
document.addEventListener("touchstart", jump);
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// Create zig-zag obstacles (NO ROTATION)
function createZigZag() {
  let startX = canvas.width + 40;

  zigZagPattern.forEach((y, i) => {
    obstacles.push({
      x: startX + i * 110,
      y: y,
      width: 80,
      height: 45
    });
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

  // Spawn zig-zag
  obstacleTimer++;
  if (obstacleTimer > 180) {
    createZigZag();
    obstacleTimer = 0;
  }

  obstacles.forEach(o => {
    o.x -= 2.6;

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

  // Player
  if (player) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }

  // Obstacles (STATIC)
  obstacles.forEach(o => {
    ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  // Start / Game Over
  if (!gameStarted) {
    ctx.font = "26px Arial";
    ctx.fillText("TAP TO START", 110, 360);
  }

  if (gameOver) {
    ctx.font = "32px Arial";
    ctx.fillText("GAME OVER", 105, 330);
    ctx.font = "16px Arial";
    ctx.fillText("Tap to Restart", 150, 365);
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
