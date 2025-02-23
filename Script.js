

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



src="https://assets.mailerlite.com/js/universal.js">

  ml('account', '1348609');




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
