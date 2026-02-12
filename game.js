const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== FULL SCREEN CANVAS (FIXED) =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Images
const playerImg = new Image();
const obstacleImg = new Image();
playerImg.src = "player.png";
obstacleImg.src = "brinjal.png";

// Game state
let gravity = 0.45;
let jumpPower = -8;
let maxUpSpeed = -9;
let score = 0;
let gameOver = false;
let gameStarted = false;

// Player
let player;

// Obstacles
let obstacles = [];
let obstacleTimer = 0;

// Zig-zag pattern (relative positions)
function getZigZagPattern() {
  const h = canvas.height;
  return [
    h * 0.15,
    h * 0.75,
    h * 0.25,
    h * 0.65,
    h * 0.35,
    h * 0.55,
    h * 0.45
  ];
}

// Init / Reset
function initGame() {
  player = {
    x: canvas.width * 0.25,
    y: canvas.height * 0.5,
    width: canvas.width * 0.14,
    height: canvas.width * 0.18,
    velocity: 0
  };

  obstacles = [];
  score = 0;
  obstacleTimer = 0;
  gameOver = false;
  gameStarted = true;
}

// Jump
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
document.addEventListener("touchstart", jump, { passive: true });
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

// Create zig-zag obstacles (screen-fit)
function createZigZag() {
  const pattern = getZigZagPattern();
  let startX = canvas.width + 50;
  let spacing = canvas.width * 0.35;

  pattern.forEach((y, i) => {
    obstacles.push({
      x: startX + i * spacing,
      y: y,
      width: canvas.width * 0.18,
      height: canvas.width * 0.08
    });
  });
}

// Update
function update() {
  if (!gameStarted || gameOver) return;

  player.velocity += gravity;
  player.y += player.velocity;

  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) {
    gameOver = true;
  }

  obstacleTimer++;
  if (obstacleTimer > 120) {
    createZigZag();
    obstacleTimer = 0;
  }

  obstacles.forEach(o => {
    o.x -= canvas.width * 0.004;

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

  // Obstacles
  obstacles.forEach(o => {
    ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);
  });

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameStarted) {
    ctx.font = "28px Arial";
    ctx.fillText("TAP TO START", canvas.width / 2 - 100, canvas.height / 2);
  }

  if (gameOver) {
    ctx.font = "32px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = "16px Arial";
    ctx.fillText("Tap to Restart", canvas.width / 2 - 60, canvas.height / 2 + 20);
  }
}

// Loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start when images loaded
let loaded = 0;
[playerImg, obstacleImg].forEach(img => {
  img.onload = () => {
    loaded++;
    if (loaded === 2) loop();
  };
});
