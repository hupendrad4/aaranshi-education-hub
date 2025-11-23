/**
 * Aaranshi Education Hub - Animation & Interaction Scripts
 * Modern, smooth animations and user interactions
 */

(function() {
  'use strict';

  // ========== Initialize on DOM Ready ==========
  document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initBackToTop();
    initScrollAnimations();
    initCounters();
    initParallax();
    initActiveNavLinks();
    initSmoothScroll();
    initFormValidation();
  });

  // ========== Loading Screen ==========
  function initLoader() {
    const loader = document.getElementById('loading');
    if (!loader) return;

    window.addEventListener('load', function() {
      setTimeout(function() {
        loader.classList.remove('show');
        loader.style.display = 'none';
      }, 500);
    });
  }

  // ========== Back to Top Button ==========
  function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========== Scroll Animations ==========
  function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards and features
    const animatedElements = document.querySelectorAll(
      '.feature-card, .course-card, .stat, .card, .hero-card'
    );

    animatedElements.forEach(function(el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ========== Animated Counters ==========
  function initCounters() {
    const counters = document.querySelectorAll('.stat h3, .fact strong');
    let hasAnimated = false;

    const animateCounter = function(counter) {
      const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
      if (isNaN(target)) return;

      const suffix = counter.textContent.replace(/[0-9]/g, '');
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(function() {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, 16);
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          counters.forEach(function(counter) {
            setTimeout(function() {
              animateCounter(counter);
            }, Math.random() * 200);
          });
        }
      });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
      observer.observe(counters[0].closest('section') || counters[0]);
    }
  }

  // ========== Parallax Effect ==========
  function initParallax() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    window.addEventListener('scroll', function() {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
      }
    });
  }

  // ========== Active Navigation Links ==========
  function initActiveNavLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ========== Smooth Scroll ==========
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ========== Form Validation Enhancement ==========
  function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
        }
        form.classList.add('was-validated');
      });

      // Real-time validation feedback
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          if (this.checkValidity()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
          }
        });
      });
    });
  }

  // ========== Card Hover Effects ==========
  const cards = document.querySelectorAll('.course-card, .feature-card, .card');
  cards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // ========== Lazy Loading Images ==========
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ========== Navbar Scroll Effect ==========
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.scrollY;

      if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
      }

      lastScroll = currentScroll;
    });
  }

  // ========== Toast Notifications ==========
  window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#22B573' : '#EF4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      font-weight: 500;
    `;

    document.body.appendChild(toast);

    setTimeout(function() {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 3000);
  };

  // ========== Add Animation Keyframes ==========
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

})();

