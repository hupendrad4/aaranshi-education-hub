/**
 * Trusted By Section Loader
 * This script ensures consistent implementation of the Trusted By section across all pages
 */

function loadTrustedBy() {
  try {
    // Don't load on certain pages
    const excludedPages = []; // No pages are excluded now
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (excludedPages.includes(currentPage)) {
      return; // Skip if current page is in excluded list
    }
    
    // Remove any existing trusted-by sections to prevent duplicates
    $('.trusted-by-section').remove();
    
    // Create container for the trusted by section
    const container = document.createElement('div');
    container.id = 'trusted-by';
    container.className = 'trusted-by-section';
    
    // Trusted By content
    const trustedContent = `
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <h3 class="mb-4" style="color: var(--edu-navy); font-weight: 700; font-size: 1.75rem;">
              Trusted by Top Scorers
            </h3>
            <div class="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5">
              <div class="trusted-by-item">
                <div class="trusted-score">98%</div>
                <div class="trusted-text">Success Rate</div>
              </div>
              <div class="trusted-by-item">
                <div class="trusted-score">500+</div>
                <div class="trusted-text">Students Trained</div>
              </div>
              <div class="trusted-by-item">
                <div class="trusted-score">50+</div>
                <div class="trusted-text">Top Rankers</div>
              </div>
              <div class="trusted-by-item">
                <div class="trusted-score">10+</div>
                <div class="trusted-text">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Set the content
    container.innerHTML = trustedContent;
    
    // Find the best position to insert the section
    let targetElement = null;
    
    // Try different selectors to find a good insertion point
    if (currentPage === 'index.html') {
      targetElement = document.querySelector('.hero, .hero-section, section:first-of-type, main');
    } else if (currentPage === 'register.html') {
      targetElement = document.querySelector('.registration-wrap .container, .registration-form, main');
    } else {
      // For other pages, try to find the first section or main content area
      targetElement = document.querySelector('section:first-of-type, .main-content, main, .container:first-of-type, body');
    }
    
    // If we found a target element, insert the section
    if (targetElement) {
      if (targetElement.tagName === 'MAIN' || targetElement.classList.contains('main-content')) {
        // For main content areas, insert after the first section or at the beginning
        const firstSection = targetElement.querySelector('section:first-of-type');
        if (firstSection) {
          firstSection.insertAdjacentElement('afterend', container);
        } else {
          targetElement.insertAdjacentElement('afterbegin', container);
        }
      } else {
        // For other elements, insert after them
        targetElement.insertAdjacentElement('afterend', container);
      }
    } else {
      // Last resort: append to body
      document.body.insertAdjacentElement('afterbegin', container);
    }
    
  } catch (error) {
    console.error('Error loading Trusted By section:', error);
  }
}

// Run when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Load after a small delay to ensure other elements are loaded
  setTimeout(loadTrustedBy, 100);
});
