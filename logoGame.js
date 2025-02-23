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
  { name: 'Nike', logo: 'logos/nike.jpeg' },
  { name: 'Facebook', logo: 'logos/facebook.png' },
  { name: 'Instagram', logo: 'logos/Instagram.png' },
  { name: 'Tata', logo: 'logos/tata.png' },
  { name: 'Xbox', logo: 'logos/xbox.jpeg' },
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



  // Get elements
  const newsletterBtn = document.getElementById('newsletter-btn');
  const newsletterPopup = document.getElementById('newsletter-popup');
  const closePopup = document.getElementById('close-popup');

  // Open popup when button is clicked
  newsletterBtn.addEventListener('click', () => {
    newsletterPopup.style.display = 'flex';
    if (typeof ml_account !== 'undefined') {
      ml_account.reload();
    }
  });

  // Close popup when close button is clicked
  closePopup.addEventListener('click', () => {
    newsletterPopup.style.display = 'none';
  });

  // Close popup when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === newsletterPopup) {
      newsletterPopup.style.display = 'none';
    }
  });

  // MailerLite success handler
  function ml_webform_success_22982383() {
    const successContent = document.querySelector('.ml-form-successBody');
    const formContent = document.querySelector('.ml-form-embedBody');
    
    successContent.style.display = 'block';
    formContent.style.display = 'none';
    
    // Optional: Auto-close popup after success
    setTimeout(() => {
      newsletterPopup.style.display = 'none';
      formContent.style.display = 'block';
      successContent.style.display = 'none';
    }, 3000);
  }



 src="https://assets.mailerlite.com/js/universal.js"

  ml('account', '1348609');


// Get the form element
const newsletterForm = document.getElementById('newsletter-form');

// Add a submit event listener
newsletterForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the email input value
  const emailInput = newsletterForm.querySelector('input[type="email"]');
  const email = emailInput.value;

  // Validate the email
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }

  // Use MailerLite's API to submit the form
  if (typeof ml_account !== 'undefined') {
    ml_account('webforms', '147109408369805286', '1348609', 'show'); // Initialize the form
    ml_account('webforms', '147109408369805286', '1348609', 'submit', {
      email: email, // Pass the email value
    });

    // Show success message
    const successContent = document.querySelector('.ml-form-successBody');
    const formContent = document.querySelector('.ml-form-embedBody');

    successContent.style.display = 'block';
    formContent.style.display = 'none';

    // Auto-close popup after 3 seconds
    setTimeout(() => {
      const newsletterPopup = document.getElementById('newsletter-popup');
      newsletterPopup.style.display = 'none';

      // Reset form and success message
      formContent.style.display = 'block';
      successContent.style.display = 'none';
      newsletterForm.reset(); // Clear the form
    }, 3000); // 3 seconds delay
  } else {
    alert('MailerLite is not loaded. Please try again.');
  }
});