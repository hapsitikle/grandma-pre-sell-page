// Add simple form submission with modal
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      document.getElementById('success-modal').style.display = 'flex';
    });
  }
 
  // Countdown Timer
  let timeLeft = 15 * 60; // 15 minutes in seconds
  const timerDisplay = document.querySelector('.timer');
 
  if (timerDisplay) {
    setInterval(function() {
      if (timeLeft > 0) {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 1000);
  }
});
