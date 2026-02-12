const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Full screen canvas (locked)
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

// ===== GAME SETTINGS (BALANCED) =====
let gravity = 0.45;
let jumpPower = -8;
let maxUpSpeed = -9;

let baseSpeed = 2.2;        // obstacle speed
let spawnDelay = 140;      // distance between zig-zags
let maxObstacles = 14;     // HARD LIMIT

let score = 0;
let gameOver = false;
let gameStarted = false;

// Player
let player;

// Obstacles
let obstacles = [];
let obstacleTimer = 0;

// Zig-zag path (screen-relative)
function getZigZagPattern() {
  const h = canvas.height;
  return [
    h * 0.18,
    h * 0.72,
    h * 0.28,
    h * 0.62,
    h * 0.38,
    h * 0.52
  ];
}

// Init / Reset
function initGame() {
  player = {
    x: canvas.width * 0.25,
    y: canvas.height * 0.5,
    width: canvas.width * 0.18,   // 👈 BIGGER PLAYER
    height: canvas.width * 0.22,
    velocity: 0
  };

  obstacles = [];
  score = 0;
  obstacleTimer = 0;
  gameOver = false;
  gameStarted = true;

  baseSpeed = 2.2;
  spawnDelay = 140;
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

// Create zig-zag (LIMITED)
function createZigZag() {
  if (obstacles.length > maxObstacles) return;

  const pattern = getZigZagPattern();
  let startX = canvas.width + 80;
  let spacing = canvas.width * 0.45;

  pattern.forEach((y, i) => {
    obstacles.push({
      x: startX + i * spacing,
      y: y,
      width: canvas.width * 0.24,   // 👈 BIGGER BRINJAL
      height: canvas.width * 0.12
    });
  });
}

// Update
function update() {
  if (!gameStarted || gameOver) return;

  // Player physics
  player.velocity += gravity;
  player.y += player.velocity;

  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) {
    gameOver = true;
  }

  // Spawn logic
  obstacleTimer++;
  if (obstacleTimer > spawnDelay) {
    createZigZag();
    obstacleTimer = 0;
  }

  // Move obstacles
  obstacles.forEach(o => {
    o.x -= baseSpeed;

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

  // 🎯 Difficulty increases SLOWLY
  if (score % 300 === 0 && score !== 0) {
    baseSpeed += 0.25;           // speed up slowly
    spawnDelay -= 6;             // closer but controlled
    if (spawnDelay < 110) spawnDelay = 110;
  }

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

  // UI
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameStarted) {
    ctx.font = "28px Arial";
    ctx.fillText("TAP TO START", canvas.width / 2 - 100, canvas.height / 2);
  }

  if (gameOver) {
    ctx.font = "34px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 110, canvas.height / 2 - 20);
    ctx.font = "18px Arial";
    ctx.fillText("Tap to Restart", canvas.width / 2 - 65, canvas.height / 2 + 20);
  }
}

// Loop
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
