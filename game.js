const GameWidth = 300;
const GameHeight = 300;
const barWidth = Math.round(GameWidth * 0.2);
const barHeight = Math.round(GameWidth * 0.04);
const barStep = Math.round(GameWidth / 20);
const ballRadius = Math.round(GameWidth * 0.07);
const ballStep = Math.round(GameWidth / 20);
const maxScore = 30;
const maxMiss = 0;
const maxMoves = 10;

function genBallXPos() {
  const maxValue = GameWidth - 2 * ballRadius;
  return Math.round(Math.random() * maxValue);
}

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.clone = () => new Rect(this.x, this.y, this.width, this.height);
  this.center = () => ({
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  });
}

function Game() {
  let terminated = false;
  let score = 0;
  let miss = 0;
  let moves = 0;
  const ball = new Rect(genBallXPos(), 0, ballRadius * 2, ballRadius * 2);
  const bar = new Rect(0, GameWidth - barHeight, barWidth, barHeight);

  this.ball = () => ball.clone();
  this.bar = () => bar.clone();
  this.terminated = () => terminated;
  this.result = () => ({ win: score >= maxScore, score, miss, moves });
  const checkIfTerminate = () => {
    terminated = moves > maxMoves || miss > maxMiss || score > maxScore;
  };

  this.moveLeft = () => {
    const maxBarX = GameWidth - barWidth;
    if (bar.x + barStep <= maxBarX) {
      bar.x += barStep;
    }
    moves++;
    checkIfTerminate();
  };

  this.moveRight = () => {
    if (bar.x - barStep >= 0) {
      bar.x -= barStep;
    }
    moves++;
    checkIfTerminate();
  };

  const restartBall = () => {
    ball.y = 0;
    ball.x = genBallXPos();
    moves = 0;
  };
  const computeScore = () => {
    const space = bar.y - ball.y - ball.height;
    if (space > 0) {
      return;
    }
    const centerX = ball.center().x;
    if (centerX >= bar.x && centerX <= bar.x + barWidth) {
      score += 1;
    } else {
      miss++;
    }
    checkIfTerminate();
    if (!terminated) {
      restartBall();
    }
  };
  this.next = () => {
    if (terminated) {
      throw new Error("game already terminated");
    }
    ball.y += ballStep;
    computeScore();
    return !terminated;
  };
}

function renderBar(ctx, bar) {
  ctx.beginPath();
  ctx.fillStyle = "gray";
  ctx.rect(bar.x, bar.y, bar.width, bar.height);
  ctx.fill();
}

function renderBall(ctx, ball) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  const { x, y } = ball.center();
  ctx.arc(x, y, ball.width / 2, 0, Math.PI * 360);
  ctx.fill();
}

function renderGame(ctx, game) {
  ctx.clearRect(0, 0, GameWidth, GameHeight);
  renderBall(ctx, game.ball());
  renderBar(ctx, game.bar());
}
