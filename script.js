// Get references to the elements
const snakeHead = document.getElementById('snake');
const circle = document.getElementById('circle');
const gameOverMessage = document.getElementById('game-over');
const boundary = document.getElementById('boundary');

// Snake linked list data structure
class SnakeSegment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.next = null;
    }
}

// Initialize the snake linked list with one segment (the head)
let snake = new SnakeSegment(0, 0);

// Function to add a new segment to the snake
function addSnakeSegment() {
    let current = snake;
    while (current.next !== null) {
        current = current.next;
    }
    current.next = new SnakeSegment(current.x, current.y);
}

// Initialize positionX and positionY variables
let positionX = 0;
let positionY = 0;

// Variable to keep track of game over state
let gameOver = false;

// Initialize direction variables
let directionX = 0;
let directionY = 0;

// Function to handle snake movement
function moveSnake() {
    if (gameOver) return;

    const speed = 20;
    let newPosX = positionX + directionX * speed;
    let newPosY = positionY + directionY * speed;

    // Get boundary dimensions and position
    const boundaryRect = boundary.getBoundingClientRect();

    // Check for collision with boundary walls
    if (newPosX < 0 || newPosX >= boundaryRect.width || newPosY < 0 || newPosY >= boundaryRect.height) {
        endGame(false);  // false indicates game over
        return;
    }

    // Check for collision with itself
    let currentSegment = snake.next;
    while (currentSegment !== null) {
        if (currentSegment.x === newPosX && currentSegment.y === newPosY) {
            endGame(false);  // false indicates game over
            return;
        }
        currentSegment = currentSegment.next;
    }

    // Update snake's segments
    currentSegment = snake;
    let previousX = currentSegment.x;
    let previousY = currentSegment.y;
    currentSegment.x = newPosX;
    currentSegment.y = newPosY;

    while (currentSegment.next !== null) {
        currentSegment = currentSegment.next;
        let tempX = currentSegment.x;
        let tempY = currentSegment.y;
        currentSegment.x = previousX;
        currentSegment.y = previousY;
        previousX = tempX;
        previousY = tempY;
    }

    positionX = newPosX;
    positionY = newPosY;
    snakeHead.style.left = `${newPosX}px`;
    snakeHead.style.top = `${newPosY}px`;

    // Check for intersection with the circle
    const rect1 = snakeHead.getBoundingClientRect();
    const rect2 = circle.getBoundingClientRect();

    if (rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left) {
        // If they intersect, move the circle to a random position within the boundary
        const randomX = Math.floor(Math.random() * (boundaryRect.width - 20));
        const randomY = Math.floor(Math.random() * (boundaryRect.height - 20));
        circle.style.left = `${randomX}px`;
        circle.style.top = `${randomY}px`;

        // Add a new segment to the snake when it eats the circle
        addSnakeSegment();
    }

    // Check if the snake length is 5 times the width of the boundary
    let segmentCount = 0;
    currentSegment = snake;
    while (currentSegment !== null) {
        segmentCount++;
        currentSegment = currentSegment.next;
    }

    if (segmentCount * 20 >= boundaryRect.width * 5) {
        endGame(false);  // false indicates game over
        return;
    }

    // Update the display of all segments
    updateSnakeDisplay();
}

// Function to update the display of all snake segments
function updateSnakeDisplay() {
    let currentSegment = snake.next;
    let segmentIndex = 1; // Start from 1 because 0 is the head
    while (currentSegment !== null) {
        let segmentElement = document.getElementById(`segment-${segmentIndex}`);
        if (!segmentElement) {
            segmentElement = document.createElement('div');
            segmentElement.id = `segment-${segmentIndex}`;
            segmentElement.className = 'snake-segment';
            segmentElement.style.position = 'absolute';
            segmentElement.style.width = '20px';
            segmentElement.style.height = '20px';
            segmentElement.style.backgroundColor = 'green';
            boundary.appendChild(segmentElement);
        }
        segmentElement.style.left = `${currentSegment.x}px`;
        segmentElement.style.top = `${currentSegment.y}px`;
        currentSegment = currentSegment.next;
        segmentIndex++;
    }
}

// Function to handle game over
function endGame(isWin) {
    gameOver = true;
    gameOverMessage.textContent = isWin ? 'You win!' : 'You lose!';
    gameOverMessage.style.display = 'block';
    clearInterval(gameInterval); // Stop the game loop
    clearInterval(fastGameInterval); // Stop the fast game loop if it's running
}

// Add event listeners for snake movement and speed control
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && directionX === 0) {
        directionX = -1;
        directionY = 0;
    } else if (event.key === 'ArrowRight' && directionX === 0) {
        directionX = 1;
        directionY = 0;
    } else if (event.key === 'ArrowUp' && directionY === 0) {
        directionX = 0;
        directionY = -1;
    } else if (event.key === 'ArrowDown' && directionY === 0) {
        directionX = 0;
        directionY = 1;
    }

    // Speed up the snake when a key is held down
    if (!fastGameInterval) {
        clearInterval(gameInterval);
        fastGameInterval = setInterval(moveSnake, 0); // Faster speed
    }
});

document.addEventListener('keyup', () => {
    // Slow down the snake when the key is released
    if (fastGameInterval) {
        clearInterval(fastGameInterval);
        fastGameInterval = null;
        gameInterval = setInterval(moveSnake, 200); // Normal speed
    }
});

// Initialize the position of the snake and the circle within the boundary
function initializeGame() {
    const boundaryRect = boundary.getBoundingClientRect();
    positionX = 10; // Start slightly inside the left boundary
    positionY = 10; // Start slightly inside the top boundary

    snakeHead.style.left = `${positionX}px`;
    snakeHead.style.top = `${positionY}px`;

    const randomX = Math.floor(Math.random() * (boundaryRect.width - 20));
    const randomY = Math.floor(Math.random() * (boundaryRect.height - 20));
    circle.style.left = `${randomX}px`;
    circle.style.top = `${randomY}px`;
}

// Start the game loop
let gameInterval = setInterval(moveSnake, 200); // Move the snake every 200ms
let fastGameInterval = null; // Initialize fastGameInterval as null

initializeGame();
