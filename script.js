// Animated dollar sign in corner
function setupDollarAnimation() {
    const dollarElement = document.getElementById('animated-dollar');
    dollarElement.innerHTML = `
        <svg viewBox="0 0 100 100" width="100" height="100">
            <text x="50" y="70" text-anchor="middle" font-size="80" fill="#00c853" font-weight="bold">$</text>
        </svg>
    `;
    
    // Add click event to make money rain
    dollarElement.addEventListener('click', makeMoneySplash);
}

function makeMoneySplash() {
    // Create flying money numbers
    for (let i = 0; i < 10; i++) {
        createFloatingNumber();
    }
}

function createFloatingNumber() {
    const numberElement = document.createElement('div');
    numberElement.className = 'floating-number';
    
    // Random dollar amount
    const amounts = ['$100', '$500', '$1000', '$50', '$4500', '$35'];
    numberElement.textContent = amounts[Math.floor(Math.random() * amounts.length)];
    
    // Random position
    numberElement.style.left = Math.random() * 80 + 10 + '%';
    numberElement.style.top = Math.random() * 80 + 10 + '%';
    
    // Random animation duration
    const duration = 3 + Math.random() * 5;
    numberElement.style.animationDuration = duration + 's';
    
    document.body.appendChild(numberElement);
    
    // Remove after animation completes
    setTimeout(() => {
        document.body.removeChild(numberElement);
    }, duration * 1000);
}

// Function to prefetch a link
function prefetchLink(url) {
    if (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType === '2g')) {
        // Don't prefetch if the user is on data-saving mode or slow connection
        return;
    }
    
    // Create a prerender link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    // Alternative approach: create a hidden iframe
    // This is more aggressive but ensures the page is ready instantly
    // Only for important landing pages where UX is critical
    // const iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    // iframe.src = url;
    // document.body.appendChild(iframe);
    // setTimeout(() => document.body.removeChild(iframe), 5000); // Remove after 5 seconds
}

// Initialize animations when page loads
window.onload = function() {
    setupDollarAnimation();
    
    // Create some initial money effects
    setTimeout(makeMoneySplash, 1000);
    
    // Add floating $ animation to all highlights
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseover', () => {
            createFloatingNumber();
        });
    });
    
    // Make CTA more interactive
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('mouseover', makeMoneySplash);
    
    // Add click event to show loading message
    ctaButton.addEventListener('click', function(e) {
        e.preventDefault();
        this.innerHTML = "PLEASE WAIT... REDIRECTING YOU TO QUALIFICATION QUIZ";
        this.style.background = "linear-gradient(45deg, #888, #666)";
        this.style.pointerEvents = "none";
        
        // Create and add a loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        this.appendChild(spinner);
        
        // Redirect after a short delay to show the loading state
        setTimeout(() => {
            window.location.href = this.href;
        }, 2000);
    });
    
    // Prefetch the link when the user scrolls down near the button
    // This creates an invisible iframe that loads the target page in the background
    document.addEventListener('scroll', function() {
        const button = document.getElementById('cta-button');
        const rect = button.getBoundingClientRect();
        
        // If the button is within 500px of the viewport, prefetch the link
        if (rect.top < window.innerHeight + 500) {
            prefetchLink(button.href);
            // Remove this listener after prefetching once
            document.removeEventListener('scroll', arguments.callee);
        }
    });
    
    // Also prefetch when mouse moves anywhere on the page (user is active)
    let prefetchTriggered = false;
    document.addEventListener('mousemove', function() {
        if (!prefetchTriggered) {
            const button = document.getElementById('cta-button');
            prefetchLink(button.href);
            prefetchTriggered = true;
            // Remove this listener after prefetching once
            document.removeEventListener('mousemove', arguments.callee);
        }
    });
};
