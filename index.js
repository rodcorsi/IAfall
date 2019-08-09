const numInputs = 1;
const numOutputs = 2;

function calcDistance(bar, ball) {
  return bar().center().x - ball().center().x;
}

function calcMovement(neuralNet, distance) {
  const output = neuralNet.update([distance]);
  //console.log("distance:", distance, " outputs:", output);
  if (output[0] > 0.5 && output[1] < 0.5) {
    return 1;
  } else if (output[1] > 0.5 && output[0] < 0.5) {
    return -1;
  }
  return 0;
}

const canvas = document.getElementById("game");
canvas.width = GameWidth;
canvas.height = GameHeight;

function playGame(neuralNet) {
  return new Promise(resolve => {
    const game = new Game(canvas);
    const looping = new Looping(canvas);
    looping
      .onupdate(() => {
        if (game.terminated()) {
          looping.terminate();
          resolve(game.result());
          return;
        }
        game.next();
        const move = calcMovement(neuralNet, calcDistance(game.bar, game.ball));
        if (move > 0) {
          game.moveRight();
        } else if (move < 0) {
          game.moveLeft();
        }
      })
      .onrender(ctx => renderGame(ctx, game))
      .start();
  });
}

function FakeLooping() {
  let _onupdate;
  let terminated = false;
  this.onupdate = handler => {
    _onupdate = handler;
    return this;
  };
  this.onrender = () => {
    return this;
  };
  this.terminate = () => {
    terminated = true;
  };
  this.start = () => {
    while (!terminated) {
      _onupdate();
    }
  };
}

function mutate(weights) {
  const result = weights.slice(0);
  position = Math.round(Math.random() * (weights.length - 1));
  result[position] = Math.random() * 2 - 1;
  return result;
}

function printChart(neuralNet) {
  const chart = document.getElementById("chart");
  chart.width = GameWidth;
  chart.height = GameHeight;
  ctx = chart.getContext("2d");
  ctx.fillStyle = "red";
  maxDistance = GameWidth - ballRadius - barWidth / 2;
  for (let x = -maxDistance; x <= maxDistance; x++) {
    y = calcMovement(neuralNet, x);
    ctx.fillRect(x + barWidth, y * 100 + 200, 1, 1);
  }
}

async function testGenerations() {
  const info = document.getElementById("info");
  let generation = 1;
  while (true) {
    info.innerText = `Generation: ${generation}`;
    const neuralNet = new NeuralNet(numInputs, numOutputs);
    printChart(neuralNet);
    const result = await playGame(neuralNet);
    if (result.win) {
      info.innerText = `Generation:${generation} Win! Score:${result.score}`;
      console.log(neuralNet.getWeights());
      return;
    }
    generation++;
  }
}

testGenerations();
