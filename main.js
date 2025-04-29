// 遊戲狀態變數
let snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
let food = { x: 10, y: 10 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let speed = 200;
let gameInterval = null;
let isRunning = false;
const GRID_SIZE = 20;

// 初始化遊戲棋盤
function initBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            gameBoard.appendChild(cell);
        }
    }
}

// 繪製遊戲畫面
function draw() {
    clearBoard();
    drawFood();
    drawSnake();
}

function clearBoard() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('snake', 'food');
    });
}

function drawFood() {
    const cell = getCell(food.x, food.y);
    if (cell) cell.classList.add('food');
}

function drawSnake() {
    snake.forEach(segment => {
        const cell = getCell(segment.x, segment.y);
        if (cell) cell.classList.add('snake');
    });
}

function getCell(x, y) {
    return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

// 處理鍵盤輸入
function handleKey(event) {
    const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
    };
    const newDirection = keyMap[event.key];
    if (newDirection && (newDirection.x !== -direction.x || newDirection.y !== -direction.y)) {
        nextDirection = newDirection;
    }
}

// 遊戲主迴圈
function gameLoop() {
    update();
    draw();
}

function update() {
    moveSnake();
    if (isCollision(snake[0])) {
        endGame();
        return;
    }
    if (!handleFood(snake[0])) {
        snake.pop();
    }
}

function moveSnake() {
    direction = nextDirection;
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };
    snake.unshift(newHead);
}

function isCollision(head) {
    // 檢查是否撞到自己
    const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    // 檢查是否碰到邊界
    const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
    return hitSelf || hitWall;
}

function handleFood(head) {
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        randomFood();
        increaseSpeed();
        return true;
    }
    return false;
}

function randomFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function increaseSpeed() {
    speed = Math.max(50, speed - 10);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// 遊戲控制
function startGame() {
    clearInterval(gameInterval);
    initBoard();
    snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    food = { x: 10, y: 10 };
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    speed = 200;
    isRunning = true;
    updateScore();
    randomFood();
    gameInterval = setInterval(gameLoop, speed);
}

function endGame() {
    clearInterval(gameInterval);
    isRunning = false;
    alert('Game Over');
}

function togglePause() {
    if (!isRunning) return;
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    } else {
        gameInterval = setInterval(gameLoop, speed);
    }
}

// 事件監聽
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.addEventListener('keydown', handleKey);

