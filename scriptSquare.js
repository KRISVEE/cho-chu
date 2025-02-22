const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const accuracyDisplay = document.getElementById('accuracy');
const highestRecordDisplay = document.getElementById('highest-record');
const resetButton = document.getElementById('reset-button');
const blueprintToggle = document.getElementById('blueprint-toggle');
const gameList = document.querySelector('.game-list');

let isDrawing = false;
let points = [];
let perfectSquare = null;
let highestRecord = 0;
let previousAccuracy = 0;

// Sound Effects
const happySfx = new Audio('sounds/happy-sfx.mp3'); // Happy sound effect
const errorSfx = new Audio('sounds/error-sfx.mp3'); // Error sound effect

// Minimum size for a valid square
const MIN_SIZE = 100; // Adjust this value as needed

// Function to calculate the distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Function to calculate the bounding box of the drawn shape
function calculateBoundingBox(points) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

// Function to calculate the angle between three points
function calculateAngle(A, B, C) {
  const AB = distance(A.x, A.y, B.x, B.y);
  const BC = distance(B.x, B.y, C.x, C.y);
  const AC = distance(A.x, A.y, C.x, C.y);
  return Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC)) * (180 / Math.PI);
}

// Function to calculate the accuracy of the drawn square
function calculateAccuracy(points, boundingBox) {
  const { width, height } = boundingBox;
  const expectedSize = Math.min(width, height); // Use the smaller side as the expected size

  // Find the four corners of the drawn shape
  const corners = [
    points[0], // Start point
    points[Math.floor(points.length * 0.25)], // 25% of the way
    points[Math.floor(points.length * 0.5)], // 50% of the way
    points[Math.floor(points.length * 0.75)], // 75% of the way
  ];

  // Calculate side lengths
  const sideLengths = [
    distance(corners[0].x, corners[0].y, corners[1].x, corners[1].y),
    distance(corners[1].x, corners[1].y, corners[2].x, corners[2].y),
    distance(corners[2].x, corners[2].y, corners[3].x, corners[3].y),
    distance(corners[3].x, corners[3].y, corners[0].x, corners[0].y),
  ];

  // Calculate angles
  const angles = [
    calculateAngle(corners[0], corners[1], corners[2]),
    calculateAngle(corners[1], corners[2], corners[3]),
    calculateAngle(corners[2], corners[3], corners[0]),
    calculateAngle(corners[3], corners[0], corners[1]),
  ];

  // Check if the shape is close to a square
  const sideError = sideLengths.reduce((sum, length) => sum + Math.abs(length - expectedSize), 0);
  const angleError = angles.reduce((sum, angle) => sum + Math.abs(angle - 90), 0);

  const totalError = sideError + angleError;
  const accuracy = Math.max(0, 100 - (totalError / (expectedSize * 4 + 360)) * 100);
  return accuracy.toFixed(2);
}

// Function to draw the perfect square
function drawPerfectSquare(boundingBox) {
  if (blueprintToggle.checked) {
    const { x, y, width, height } = boundingBox;
    const size = Math.min(width, height); // Use the smaller side for a perfect square
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Function to reset the game
function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
  accuracyDisplay.textContent = '0%';
  perfectSquare = null;
}

// Function to show a notification
function showNotification(message, type = 'error') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '10px 20px';
  notification.style.backgroundColor = type === 'error' ? '#ff5f5f' : '#4caf50';
  notification.style.color = '#fff';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  notification.style.zIndex = '1000';
  notification.style.fontSize = '1rem';
  notification.style.fontWeight = 'bold';
  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Event listeners
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  points = [];
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  points.push({ x, y });

  // Draw the user's shape
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.strokeStyle = '#0000ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw the perfect square (if enabled)
  if (perfectSquare) {
    drawPerfectSquare(perfectSquare);
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;

  // Calculate the bounding box of the drawn shape
  const boundingBox = calculateBoundingBox(points);

  // Validate the square size
  if (boundingBox.width < MIN_SIZE || boundingBox.height < MIN_SIZE) {
    showNotification('Square is too small! Please draw a larger square.', 'error');
    errorSfx.play(); // Play error sound effect
    resetGame();
    return;
  }

  // Store the perfect square
  perfectSquare = boundingBox;

  // Draw the perfect square
  drawPerfectSquare(boundingBox);

  // Calculate and display accuracy
  const accuracy = calculateAccuracy(points, boundingBox);
  accuracyDisplay.textContent = `${accuracy}%`;

  // Play sound effects
  if (parseFloat(accuracy) > parseFloat(highestRecord)) {
    highestRecord = accuracy; // Update the highest record
    highestRecordDisplay.textContent = `${highestRecord}%`;
    showNotification('New Record! 🎉', 'success');
    happySfx.play(); // Play happy sound effect
  } else if (parseFloat(accuracy) < previousAccuracy) {
    errorSfx.play(); // Play error sound effect
  }
  previousAccuracy = parseFloat(accuracy); // Update previous accuracy
});

resetButton.addEventListener('click', resetGame);

// Function to shuffle recommended games
function shuffleGames() {
  const games = [
    { name: 'Child Birth', image: 'game1.jpg', link: 'ChildBirth.html' },
    { name: 'Game 2', image: 'game2.jpg', link: 'game2.html' },
    { name: 'Game 3', image: 'game3.jpg', link: 'game3.html' },
    { name: 'Game 4', image: 'game4.jpg', link: 'game4.html' },
  ];

  // Shuffle the games array
  const shuffledGames = games.sort(() => Math.random() - 0.5).slice(0, 4);

  // Clear existing games
  gameList.innerHTML = '';

  // Add shuffled games to the list
  shuffledGames.forEach((game) => {
    const gameBanner = document.createElement('div');
    gameBanner.className = 'game-banner';
    gameBanner.onclick = () => window.location.href = game.link;
    gameBanner.innerHTML = `
      <img src="${game.image}" alt="${game.name}">
    `;
    gameList.appendChild(gameBanner);
  });
}

// Shuffle recommended games on page load
shuffleGames();