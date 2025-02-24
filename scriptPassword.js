const passwordInput = document.getElementById('password-input');
const rulesList = document.getElementById('rules-list');
const gameList = document.querySelector('.game-list');

// List of possible rules
const rules = [
  { id: 1, text: "Your password must include a month (e.g., JANUARY).", validator: (password) => /(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(password) },
  { id: 2, text: "Your password must include a Roman numeral (e.g., V).", validator: (password) => /[IVXLCDM]/i.test(password) },
  { id: 3, text: "Your password must include a digit.", validator: (password) => /\d/.test(password) },
  { id: 4, text: "Your password must include a special character.", validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  { id: 5, text: "The sum of all digits must equal 10.", validator: (password) => {
    const digits = password.match(/\d/g) || [];
    return digits.reduce((sum, digit) => sum + Number(digit), 0) === 10;
  }},
  { id: 6, text: "The product of all Roman numerals must equal 10.", validator: (password) => {
    const romanNumerals = password.match(/[IVXLCDM]/gi) || [];
    const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const product = romanNumerals.reduce((prod, numeral) => prod * values[numeral.toUpperCase()], 1);
    return product === 10;
  }},
  { id: 7, text: "Your password must include an emoji.", validator: (password) => /\p{Emoji}/u.test(password) },
  { id: 8, text: "Your password must be at least 12 characters long.", validator: (password) => password.length >= 12 },
  { id: 9, text: "Your password must include a palindrome of at least 3 characters.", validator: (password) => {
    for (let i = 0; i <= password.length - 3; i++) {
      const substring = password.slice(i, i + 3);
      if (substring === substring.split('').reverse().join('')) return true;
    }
    return false;
  }},
  { id: 10, text: "Your password must include the current year.", validator: (password) => password.includes(new Date().getFullYear().toString()) },
  { id: 11, text: "Your password must include a prime number.", validator: (password) => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    return primes.some(prime => password.includes(prime.toString()));
  }},
  { id: 12, text: "Your password must include a country name.", validator: (password) => {
    const countries = ["USA", "India", "Canada", "Japan", "Germany"];
    return countries.some(country => password.includes(country));
  }},
  { id: 13, text: "Your password must include a mathematical symbol (+, -, *, /).", validator: (password) => /[+\-*/]/.test(password) },
  { id: 14, text: "Your password must include a color name.", validator: (password) => {
    const colors = ["red", "blue", "green", "yellow", "black", "white"];
    return colors.some(color => password.includes(color));
  }},
  { id: 15, text: "Your password must include a planet name.", validator: (password) => {
    const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
    return planets.some(planet => password.includes(planet));
  }},
];

let currentRuleIndex = 0;

// Initialize rules list
function initializeRules() {
  addNextRule();
}

// Add the next rule
function addNextRule() {
  if (currentRuleIndex < rules.length) {
    const rule = rules[currentRuleIndex];
    const li = document.createElement('li');
    li.id = `rule-${rule.id}`;
    li.textContent = rule.text;
    rulesList.appendChild(li);
    currentRuleIndex++;
  }
}

// Validate password against rules
function validatePassword() {
  const password = passwordInput.value;
  rules.slice(0, currentRuleIndex).forEach(rule => {
    const li = document.getElementById(`rule-${rule.id}`);
    if (rule.validator(password)) {
      li.classList.add('completed');
      li.classList.remove('failed');
      if (rule.id === currentRuleIndex) addNextRule(); // Add next rule if current is completed
    } else {
      li.classList.add('failed');
      li.classList.remove('completed');
    }
  });
}

// Event listener for password input
passwordInput.addEventListener('input', validatePassword);

// Initialize the game
initializeRules();

// Shuffle and display recommended games
const games = [
  { name: 'Game 1', image: 'Images/BABYSHOWERPC.jpg', link: 'ChildBirth.html' },
  { name: 'Game 2', image: 'Images/Drawaperfectcircle.jpg', link: 'DrawCircle.html' },
  { name: 'Game 3', image: 'Images/Drawaperfetsquare.jpg', link: 'DrawSquare.html' },
  { name: 'Game 4', image: 'Images/logoGame.jpg', link: 'logoGame.html' },
  { name: 'Game 5', image: 'Images/Password.jpg', link: 'Passwordgame.html' },
];

function shuffleGames() {
    const shuffledGames = games.sort(() => Math.random() - 0.5).slice(0, 4); // Show 4 games
    gameList.innerHTML = '';
    shuffledGames.forEach(game => {
      const gameBanner = document.createElement('div');
      gameBanner.className = 'game-banner';
      gameBanner.onclick = () => window.location.href = game.link;
      gameBanner.innerHTML = `<img src="${game.image}" alt="${game.name}">`;
      gameList.appendChild(gameBanner);
    });
  }
  
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







  // MailerLite success handler
function ml_webform_success_22982383() {
  const successContent = document.querySelector('.ml-form-successBody');
  const formContent = document.querySelector('.ml-form-embedBody');

  // Show success message
  successContent.style.display = 'block';
  formContent.style.display = 'none';

  // Auto-close popup after 3 seconds
  setTimeout(() => {
    const newsletterPopup = document.getElementById('newsletter-popup');
    newsletterPopup.style.display = 'none';

    // Reset form and success message
    formContent.style.display = 'block';
    successContent.style.display = 'none';
  }, 3000); // 3 seconds delay
}
