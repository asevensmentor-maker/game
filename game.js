const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Images
const playerImg = new Image();
playerImg.src = "player.png";

const obstacleImg = new Image();
obstacleImg.src = "brinjal.png";

// Game variables
let gravity = 0.5;
let jumpPower = -9;
let score = 0;
let gameOver = false;

// Player
const player = {
  x: 130,
  y: 280,
  width: 70,
  height: 90,
  velocity: 0
};

// Obstacles
let obstacles = [];

// Create obstacle
function createObstacle() {
  let y = Math.random() * (canvas.height - 150);

  obstacles.push({
    x: canvas.width,
    y: y,
    width: 80,
    height: 40
  });
}

// Create obstacles every 2 seconds
setInterval(() => {
  if (!gameOver) createObstacle();
}, 2000);

// Controls
document.addEventListener("click", () => {
  if (!gameOver) player.velocity = jumpPower;
});

document.addEventListener("keydown", e => {
  if (e.code === "Space" && !gameOver) {
    player.velocity = jumpPower;
  }
});

// Update game
function update() {
  if (gameOver) return;

  // Player movement
  player.velocity += gravity;
  player.y += player.velocity;

  // Boundaries
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) {
    gameOver = true;
  }

  // Obstacles movement & collision
  obstacles.forEach(o => {
    o.x -= 3;

    // Collision detection
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      gameOver = true;
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(o => o.x + o.width > 0);

  score++;
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.drawImage(
    playerImg,
    player.x,
    player.y,
    player.width,
    player.height
  );

  // Obstacles
  obstacles.forEach(o => {
    ctx.drawImage(
      obstacleImg,
      o.x,
      o.y,
      o.width,
      o.height
    );
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Game Over
  if (gameOver) {
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 80, 320);
    ctx.font = "16px Arial";
    ctx.fillText("Refresh to Restart", 95, 350);
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
