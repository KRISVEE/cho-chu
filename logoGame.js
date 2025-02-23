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
let currentPath = [];
let allPaths = [];

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
  const currentCompany = companies[currentCompanyIndex];
  companyNameDisplay.textContent = currentCompany.name;
  logoImage.src = currentCompany.logo;
  logoReveal.classList.add('hidden');
  resetGame();
}

// Function to reset the game
function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentPath = [];
  allPaths = [];
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
  currentCompanyIndex = (currentCompanyIndex + 1) % companies.length;
  startGame();
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
  e.preventDefault();
  isDrawing = true;
  const { x, y } = getCoordinates(e);
  currentPath = [{ x, y }];
  allPaths.push(currentPath);
}

// Function to handle drawing
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const { x, y } = getCoordinates(e);
  currentPath.push({ x, y });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  allPaths.forEach(path => {
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach(point => ctx.lineTo(point.x, point.y));
  });
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
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

// Function to shuffle recommended games
function shuffleGames() {
  const games = [
    { name: 'Child Birth', image: 'Images/BABYSHOWERPC.jpg', link: 'ChildBirth.html' },
    { name: 'Draw a Circle', image: 'Images/Drawaperfectcircle.jpg', link: 'DrawCircle.html' },
    { name: 'Draw a Square', image: 'Images/Drawaperfetsquare.jpg', link: 'DrawSquare.html' },
    { name: 'Draw the Logo', image: 'Images/logoGame.jpg', link: 'logoGame.html' },
  ];

  // Clear existing games
  gameList.innerHTML = '';

  // Add shuffled games to the list
  games.forEach((game) => {
    const gameBanner = document.createElement('div');
    gameBanner.className = 'game-banner';
    gameBanner.onclick = () => window.location.href = game.link;
    gameBanner.innerHTML = `
      <img src="${game.image}" alt="${game.name}">
    `;
    gameList.appendChild(gameBanner);
  });
}

// Button functionalities
revealButton.addEventListener('click', revealLogo);
resetButton.addEventListener('click', resetGame);
nextButton.addEventListener('click', nextLogo);
document.getElementById('exit-button').addEventListener('click', hideLogoReveal);

// Initialize the game
startGame();
shuffleGames();