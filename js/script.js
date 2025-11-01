https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js
``` :contentReference[oaicite:6]{index=6}

---

## **File: js/script.js**
```js
// Modern JavaScript for Aaranshi Education Hub
document.addEventListener("DOMContentLoaded", function() {

  // Loading Screen
  const loading = document.getElementById('loading');
  if (loading) {
    setTimeout(() => {
      loading.classList.add('hidden');
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    }, 1000);
  }

  // Initialize WOW animations
  if (typeof WOW === "function") {
    new WOW({
      boxClass: 'wow',
      animateClass: 'animate__animated',
      offset: 0,
      mobile: true,
      live: true
    }).init();
  }

  // Scroll animations for elements with animate-on-scroll class
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Enhanced Course Filtering with 3D animations
  const filterButtons = document.querySelectorAll('[data-filter]');
  const courseCards = document.querySelectorAll('[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Add loading state
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);

      // Filter and animate cards
      courseCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const cardElement = card.querySelector('.card');

        if (filter === 'all' || category === filter) {
          // Show card with staggered animation
          setTimeout(() => {
            card.style.display = 'block';
            cardElement.style.transform = 'translateY(20px) rotateX(10deg)';
            cardElement.style.opacity = '0';

            setTimeout(() => {
              cardElement.style.transform = 'translateY(0) rotateX(0)';
              cardElement.style.opacity = '1';
            }, 50);
          }, index * 100);
        } else {
          // Hide card with animation
          cardElement.style.transform = 'translateY(-20px) rotateX(-10deg)';
          cardElement.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Navbar scroll effect with enhanced glassmorphism
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.backdropFilter = 'blur(25px)';
      navbar.style.boxShadow = '0 10px 40px rgba(99, 102, 241, 0.15)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.backdropFilter = 'blur(20px)';
      navbar.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.1)';
    }

    lastScrollTop = scrollTop;
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced counter animation for statistics
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
      const suffix = counter.textContent.replace(/[\d]/g, '');
      let current = 0;
      const increment = target / 150;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          // Add completion effect
          counter.style.transform = 'scale(1.1)';
          setTimeout(() => {
            counter.style.transform = 'scale(1)';
          }, 200);
        }
        counter.textContent = Math.floor(current) + suffix;
      }, 20);
    });
  };

  // Trigger counter animation when stats section is visible
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // Enhanced form validation with visual feedback
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form elements
      const formData = new FormData(this);
      const email = formData.get('email') || this.querySelector('input[type="email"]')?.value;

      // Add loading animation to submit button
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          // Basic email validation
          if (email && !isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
          }

          // Show success message
          showNotification('Thank you! We\'ll be in touch soon.', 'success');
          this.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  });

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enhanced notification system with 3D effects
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
      notification.style.transform = 'translateX(100%) rotateY(90deg)';
      setTimeout(() => notification.remove(), 300);
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add enhanced styles with 3D effects
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 15px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      z-index: 10000;
      transform: translateX(100%) rotateY(90deg);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 400px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    notification.querySelector('.notification-content').style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      margin-left: auto;
      transition: transform 0.2s ease;
    `;

    // Add to DOM and animate in
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = 'translateX(0) rotateY(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%) rotateY(90deg)';
      setTimeout(() => notification.remove(), 400);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.style.transform = 'translateX(100%) rotateY(90deg)';
      setTimeout(() => notification.remove(), 400);
    });

    // Hover effects
    notification.querySelector('.notification-close').addEventListener('mouseenter', function() {
      this.style.transform = 'rotate(90deg) scale(1.2)';
    });

    notification.querySelector('.notification-close').addEventListener('mouseleave', function() {
      this.style.transform = 'rotate(0deg) scale(1)';
    });
  }

  // Enhanced parallax effect for hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }

  // Enhanced card hover effects with 3D transforms
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / rect.height) * 10;
      const rotateY = (mouseX / rect.width) * -10;

      this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / rect.height) * 5;
      const rotateY = (mouseX / rect.width) * -5;

      this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // Enhanced feature box interactions
  const featureBoxes = document.querySelectorAll('.feature-box');
  featureBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) rotateX(10deg) scale(1.05)';
      const icon = this.querySelector('.feature-icon');
      if (icon) {
        icon.style.transform = 'rotateY(360deg) scale(1.2)';
      }
    });

    box.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotateX(0) scale(1)';
      const icon = this.querySelector('.feature-icon');
      if (icon) {
        icon.style.transform = 'rotateY(0deg) scale(1)';
      }
    });
  });

  // Enhanced mobile menu
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      navbarToggler.classList.toggle('active');
      // Add rotation animation
      navbarToggler.style.transform = navbarToggler.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      });
    });
  }

  // Enhanced button interactions
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) rotateX(10deg) scale(1.05)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotateX(0) scale(1)';
    });

    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(-1px) rotateX(5deg) scale(0.98)';
    });

    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-3px) rotateX(10deg) scale(1.05)';
    });
  });

  // Enhanced scroll to top functionality with 3D effects
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    font-size: 1.2rem;
    transform: translateY(100px) rotateX(90deg);
  `;

  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
      scrollToTopBtn.style.transform = 'translateY(0) rotateX(0)';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
      scrollToTopBtn.style.transform = 'translateY(100px) rotateX(90deg)';
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    scrollToTopBtn.style.transform = 'scale(0.8) rotateX(180deg)';
    setTimeout(() => {
      scrollToTopBtn.style.transform = 'scale(1) rotateX(0)';
    }, 200);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px) rotateX(15deg) scale(1.1)';
    this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.5)';
  });

  scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotateX(0) scale(1)';
    this.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)';
  });

  console.log('🎓 Aaranshi Education Hub - Enhanced 3D website loaded successfully!');
});
```
