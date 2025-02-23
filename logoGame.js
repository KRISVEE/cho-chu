const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const companyNameDisplay = document.getElementById('company-name');
const revealButton = document.getElementById('reveal-button');
const resetButton = document.getElementById('reset-button');
const nextButton = document.getElementById('next-button');
const logoReveal = document.getElementById('logo-reveal');
const logoImage = document.getElementById('logo-image');
const gameList = document.querySelector('.game-list');

let isDrawing = false;
let currentPath = []; // Stores points for the current drawing segment
let allPaths = []; // Stores all drawing segments
let selectedColor = '#000000'; // Default color is black

// List of companies and their logos
const companies = [
  { name: 'Apple', logo: 'logos/apple.png' },
  { name: 'Google', logo: 'logos/google.png' },
  { name: 'Microsoft', logo: 'logos/microsoft.png' },
  { name: 'Nike', logo: 'logos/nike.png' },
];

let currentCompanyIndex = 0;

// Function to start the game
function startGame() {
  // Select the current company
  const currentCompany = companies[currentCompanyIndex];
  companyNameDisplay.textContent = currentCompany.name;
  logoImage.src = currentCompany.logo;
  logoReveal.classList.add('hidden'); // Hide the logo initially
  resetGame(); // Clear the canvas
}

// Function to reset the game
function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentPath = [];
  allPaths = [];
  logoReveal.classList.add('hidden'); // Hide the logo on reset
}

// Function to reveal the logo
function revealLogo() {
  logoReveal.classList.remove('hidden');
}

// Function to hide the logo reveal section
function hideLogoReveal() {
  logoReveal.classList.add('hidden');
}

// Function to move to the next logo
function nextLogo() {
  currentCompanyIndex = (currentCompanyIndex + 1) % companies.length; // Loop through companies
  startGame(); // Start the next game
}

// Event listeners for both mouse and touch events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', startDrawing, { passive: false });

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw, { passive: false });

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchend', stopDrawing);

// Function to handle the start of drawing
function startDrawing(e) {
  e.preventDefault(); // Prevent default behavior for touch events
  isDrawing = true;
  const { x, y } = getCoordinates(e);
  currentPath = [{ x, y, color: selectedColor }]; // Start a new segment with the selected color
  allPaths.push(currentPath); // Add the segment to all paths
}

// Function to handle drawing
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault(); // Prevent default behavior for touch events
  const { x, y } = getCoordinates(e);
  currentPath.push({ x, y, color: selectedColor }); // Add the current point to the path

  // Redraw all paths
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allPaths.forEach((path) => {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = point.color || '#000000'; // Use the selected color
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// Function to handle the end of drawing
function stopDrawing() {
  isDrawing = false;
}

// Function to get coordinates from mouse or touch events
function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  let x, y;

  if (e.touches) {
    // Touch event
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    // Mouse event
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  return { x, y };
}

// Event listener for color selection
document.querySelectorAll('.color').forEach((color) => {
  color.addEventListener('click', () => {
    // Remove active class from all colors
    document.querySelectorAll('.color').forEach((c) => c.classList.remove('active'));
    // Add active class to the selected color
    color.classList.add('active');
    // Update the selected color
    selectedColor = color.getAttribute('data-color');
  });
});

// Function to shuffle recommended games
function shuffleGames() {
  const games = [
    { name: 'Game 1', image: 'Images/BABYSHOWERPC.jpg', link: 'ChildBirth.html' },
    { name: 'Game 2', image: 'Images/Drawaperfectcircle.jpg', link: 'DrawCircle.html' },
    { name: 'Game 3', image: 'Images/Drawaperfetsquare.jpg', link: 'DrawSquare.html' },
    { name: 'Game 4', image: 'Images/logoGame.jpg', link: 'logoGame.html' },
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

// Initialize the game
startGame();
shuffleGames();

// Event listeners for buttons
revealButton.addEventListener('click', revealLogo);
resetButton.addEventListener('click', resetGame);
nextButton.addEventListener('click', nextLogo);
document.getElementById('exit-button').addEventListener('click', hideLogoReveal);