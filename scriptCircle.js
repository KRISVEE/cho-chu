const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const accuracyDisplay = document.getElementById('accuracy');
const highestRecordDisplay = document.getElementById('highest-record');
const resetButton = document.getElementById('reset-button');
const blueprintToggle = document.getElementById('blueprint-toggle');
const gameList = document.querySelector('.game-list');

let isDrawing = false;
let points = [];
let perfectCircle = null;
let highestRecord = 0;
let previousAccuracy = 0;

// Sound Effects
const happySfx = new Audio('sounds/happy-sfx.mp3'); // Happy sound effect
const errorSfx = new Audio('sounds/error-sfx.mp3'); // Error sound effect

// Minimum radius for a valid circle
const MIN_RADIUS = 50; // Adjust this value as needed

// Function to calculate the distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Function to calculate the center and radius of the drawn circle
function calculateCircle(points) {
  const center = {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
  const radius =
    points.reduce((sum, point) => sum + distance(point.x, point.y, center.x, center.y), 0) /
    points.length;
  return { center, radius };
}

// Function to calculate the accuracy of the drawn circle
function calculateAccuracy(drawnPoints, center, radius) {
  let totalError = 0;
  drawnPoints.forEach((point) => {
    const dist = distance(point.x, point.y, center.x, center.y);
    totalError += Math.abs(dist - radius);
  });
  const avgError = totalError / drawnPoints.length;
  const accuracy = Math.max(0, 100 - (avgError / radius) * 100);
  return accuracy.toFixed(2);
}

// Function to draw the perfect circle
function drawPerfectCircle(center, radius) {
  if (blueprintToggle.checked) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
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
  perfectCircle = null;
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
  points = [];
  const { x, y } = getCoordinates(e);
  points.push({ x, y });
}

// Function to handle drawing
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault(); // Prevent default behavior for touch events
  const { x, y } = getCoordinates(e);
  points.push({ x, y });

  // Draw the user's circle
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.strokeStyle = '#0000ff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw the perfect circle (if enabled)
  if (perfectCircle) {
    drawPerfectCircle(perfectCircle.center, perfectCircle.radius);
  }
}

// Function to handle the end of drawing
function stopDrawing() {
  isDrawing = false;

  // Calculate the center and radius of the drawn circle
  const { center, radius } = calculateCircle(points);

  // Validate the circle size
  if (radius < MIN_RADIUS) {
    showNotification('Circle is too small! Please draw a larger circle.', 'error');
    errorSfx.play(); // Play error sound effect
    resetGame();
    return;
  }

  // Store the perfect circle
  perfectCircle = { center, radius };

  // Draw the perfect circle
  drawPerfectCircle(center, radius);

  // Calculate and display accuracy
  const accuracy = calculateAccuracy(points, center, radius);
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

// Shuffle recommended games on page load
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





// for share btn



 
 // Function to handle sharing the score
 function shareScore() {
  const shareButton = document.getElementById('share-button');
  const accuracy = accuracyDisplay.textContent;
  const highestRecord = highestRecordDisplay.textContent;

  // Create a shareable message
  const shareText = `I just scored ${accuracy} accuracy in Draw a Perfect Circle! Can you beat my highest record of ${highestRecord}? 🎉 Beat me here: https://golden-semolina-a12c0d.netlify.app/drawcircle`;

  console.log('Shareable Text:', shareText); // Debugging

  // Disable the share button to prevent multiple clicks
  shareButton.disabled = true;
  shareButton.textContent = 'Sharing...';

  try {
    // Create a custom share modal
    const shareModal = document.createElement('div');
    shareModal.style.position = 'fixed';
    shareModal.style.top = '50%';
    shareModal.style.left = '50%';
    shareModal.style.transform = 'translate(-50%, -50%)';
    shareModal.style.backgroundColor = '#fff';
    shareModal.style.padding = '20px';
    shareModal.style.borderRadius = '10px';
    shareModal.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    shareModal.style.zIndex = '1000';
    shareModal.style.width = '300px';
    shareModal.style.textAlign = 'center';
    shareModal.style.fontFamily = 'Arial, sans-serif';

    // Modal content
    shareModal.innerHTML = `
      <h3 style="margin: 0 0 15px; font-size: 18px; color: #333;">Share Your Score</h3>
      <p style="margin: 0 0 20px; font-size: 14px; color: #555;">${shareText}</p>
      <button style="margin: 5px; padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="copyToClipboard('${shareText}')">Copy Link</button>
      <button style="margin: 5px; padding: 10px 15px; background-color: #1877F2; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="shareOnFacebook('${shareText}')">Share on Facebook</button>
      <button style="margin: 5px; padding: 10px 15px; background-color: #25D366; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="shareOnWhatsApp('${shareText}')">Share on WhatsApp</button>
      <button style="margin: 5px; padding: 10px 15px; background-color: #E4405F; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="shareOnInstagram('${shareText}')">Share on Instagram</button>
      <button style="margin: 5px; padding: 10px 15px; background-color: #1DA1F2; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="shareOnTwitter('${shareText}')">Share on Twitter</button>
      <button style="margin: 5px; padding: 10px 15px; background-color: #EA4335; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="shareViaEmail('${shareText}')">Share via Email</button>
      <button style="margin: 5px; padding: 10px 15px; background-color: #888; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="closeModal()">Close</button>
    `;

    // Append the modal to the body
    document.body.appendChild(shareModal);

    // Add a semi-transparent overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);

    // Function to close the modal and remove the overlay
    window.closeModal = () => {
      shareModal.remove();
      overlay.remove();
    };
  } catch (error) {
    console.error('Error sharing score:', error);
    alert('Failed to share. Please try again.');
  } finally {
    // Re-enable the share button
    shareButton.disabled = false;
    shareButton.textContent = 'Share Your Score';
  }
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Share text copied to clipboard!');
  }).catch((error) => {
    console.error('Failed to copy text:', error);
    alert('Failed to copy text. Please manually share the link.');
  });
}

// Function to share on Facebook
function shareOnFacebook(text) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://golden-semolina-a12c0d.netlify.app/drawsquare')}&quote=${encodeURIComponent(text)}`;
  window.open(facebookUrl, '_blank');
}

// Function to share on WhatsApp
function shareOnWhatsApp(text) {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}

// Function to share on Instagram
function shareOnInstagram(text) {
  // Instagram does not support direct sharing of text or links via URL.
  // Users can copy the link and paste it into Instagram manually.
  copyToClipboard(text);
  alert('Copy the link and paste it into Instagram!');
}

// Function to share on Twitter
function shareOnTwitter(text) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, '_blank');
}

// Function to share via email
function shareViaEmail(text) {
  const emailUrl = `mailto:?subject=Draw a Perfect Square&body=${encodeURIComponent(text)}`;
  window.location.href = emailUrl;
}

// Attach event listener to the share button
document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('share-button');
  if (shareButton) {
    console.log('Share button found');
    shareButton.addEventListener('click', () => {
      console.log('Share button clicked');
      shareScore();
    });
  } else {
    console.error('Share button not found');
  }
});