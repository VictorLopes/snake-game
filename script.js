const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;

let loop = true;
const time = 1000; // 1s
const fps = 10;
const ctx = canvas.getContext("2d");
const blockSize = 10;
const mapDirection = {
  KeyA: [1, 0],
  KeyD: [-1, 0],
  KeyW: [0, -1],
  KeyS: [0, 1],
}
const multiples = Array(canvas.width / blockSize).fill(0).map((_, i) => i * blockSize);

const randomMulpleByBlockSize = () => {
  const number = Math.round(Math.random() * 50);
  return multiples[number];
}

let direction;
let posFruitX;
let posFruitY;
let snake;

const changePositionFruit = () => {
  posFruitX = randomMulpleByBlockSize();
  posFruitY = randomMulpleByBlockSize();
}

const gameOver = () => {
  loop = false;
  alert('Game Over!')
}

const boardCollision = () => {
  const conditions = {
    x: [blockSize * -1, canvas.width],
    y: [blockSize * -1, canvas.height]
  }
  if ( conditions.x.some(el => snake[0].x >= el && snake[0].x <= el) 
  || conditions.y.some(el => snake[0].y >= el && snake[0].y <= el) ) {
    gameOver();
  }
}

const move = () => {
  for (let i = snake.length - 1; i >= 0; i--) {
    if (i === 0) {
      const obj = {
        x: blockSize * mapDirection[direction][0],
        y: blockSize * mapDirection[direction][1]
      }

      const newX = snake[0].x - obj.x;
      const newY = snake[0].y + obj.y;

      if (!snake.some(({ x, y }) => x === newX && y === newY)) {
        snake[0].x = newX;
        snake[0].y = newY;
      } else {
        gameOver();
      }
    } else {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
    }
  }
  boardCollision();
}

// onDraw each frame

const createBlock = (x, y, color = '#ffffff') => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
}

const renderSnake = () => {
  for (let i = 0; i < snake.length; i++) {
    createBlock(snake[i].x, snake[i].y, i === 0 ? '#18ad1d' : i === snake.length - 1 ? '#e0d609' : '#ffffff');
  }
}

const renderFruit = () => {
  createBlock(posFruitX, posFruitY, "#f54272");
}

const grow = () => {
  const newX = snake[snake.length - 1].x + blockSize * mapDirection[direction][0];
  const newY = snake[snake.length - 1].y + blockSize * mapDirection[direction][1];
  snake.push({ x: newX, y: newY });
}

const eat = () => {
  if (snake[0].x === posFruitX && snake[0].y === posFruitY) {
    grow();
    changePositionFruit();
  }
}

const setup = () => {
  snake = [{ x: randomMulpleByBlockSize(), y: randomMulpleByBlockSize() }];
  changePositionFruit();
  direction = ["KeyA", "KeyD", "KeyW", "KeyS"][Math.round(Math.random() * 3)];
}

const onDraw = () => {
  renderSnake();
  renderFruit();
  eat();
  document.getElementById('score').innerText = snake.length - 1;
};

const couldMove = (eventCode) => {
  const conditions = {
    'KeyW': 'KeyS',
    'KeyA': 'KeyD',
    'KeyS': 'KeyW',
    'KeyD': 'KeyA',
  }
  return eventCode !== direction && eventCode !== conditions[direction]
}

// Event on key press
document.addEventListener("keypress", (event) => {
  if (couldMove(event.code) || snake.length === 1) direction = event.code;
});

const eventLoop = () => {
  if (!loop) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  onDraw();
  move();
  setTimeout(eventLoop, (time / fps));
};

document.getElementById('start').addEventListener("click", (event) => {
  loop = true;
  setup();
  eventLoop();
});
