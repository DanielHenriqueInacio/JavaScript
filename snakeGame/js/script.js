$(document).ready(function () {
  const canvas = $("#gameCanvas")[0];
  const ctx = canvas.getContext("2d");
  const box = 20;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  let snake = [];
  snake[0] = { x: 9 * box, y: 10 * box };

  let food = generateFood();

  let score = 0;
  let direction;
  let changingDirection = false;

  $(document).keydown(function (event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.which;
    const goingUp = direction === "UP";
    const goingDown = direction === "DOWN";
    const goingRight = direction === "RIGHT";
    const goingLeft = direction === "LEFT";

    if (keyPressed === 37 && !goingRight) {
      direction = "LEFT";
    } else if (keyPressed === 38 && !goingDown) {
      direction = "UP";
    } else if (keyPressed === 39 && !goingLeft) {
      direction = "RIGHT";
    } else if (keyPressed === 40 && !goingUp) {
      direction = "DOWN";
    }
  });

  function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "gray" : "lightgray";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = "black";
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY === food.y) {
      score++;
      food = generateFood();
    } else {
      snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (
      snakeX < 0 ||
      snakeY < 0 ||
      snakeX >= canvasWidth ||
      snakeY >= canvasHeight ||
      collision(newHead, snake)
    ) {
      clearInterval(game);
      alert("Fim de Jogo");
    }

    snake.unshift(newHead);
    changingDirection = false;
  }

  function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) {
        return true;
      }
    }
    return false;
  }

  function generateFood() {
    let foodX, foodY;
    let validPosition = false;
    while (!validPosition) {
      foodX = Math.floor(Math.random() * (canvasWidth / box)) * box;
      foodY = Math.floor(Math.random() * (canvasHeight / box)) * box;
      validPosition = !collision({ x: foodX, y: foodY }, snake);
    }
    return { x: foodX, y: foodY };
  }

  let game = setInterval(draw, 100);
});
