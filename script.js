document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. HEADER SCROLL STATE
  const navbar = document.querySelector('.navbar');
  const checkScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check

  // 2. MOBILE MENU TOGGLE
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      
      // Update menu icon
      const icon = mobileToggle.querySelector('[data-lucide]');
      if (icon) {
        if (isExpanded) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons({
          attrs: {
            class: 'lucide-icon'
          },
          nameAttr: 'data-lucide'
        });
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. SCROLL TO TOP ACCESSIBILITY
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. TESTIMONIAL SLIDER
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.querySelector('.testimonial-next');
  const prevBtn = document.querySelector('.testimonial-prev');
  
  if (slides.length > 0) {
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    }

    // Auto-advance slide every 7 seconds
    let slideInterval = setInterval(() => showSlide(currentSlide + 1), 7000);

    // Reset interval on user interaction
    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => showSlide(currentSlide + 1), 7000);
    };

    if (nextBtn) nextBtn.addEventListener('click', resetInterval);
    if (prevBtn) prevBtn.addEventListener('click', resetInterval);
  }

  // 6. ACCORDION FAQ
  const accordions = document.querySelectorAll('.accordion-header');
  if (accordions.length > 0) {
    accordions.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all other accordions
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.accordion-content').style.maxHeight = null;
          }
        });

        // Toggle current accordion
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // 7. DYNAMIC MAP LOADING ON CONTACT PAGE FOR BETTER PERFORMANCE
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe && 'IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
          }
          observer.unobserve(iframe);
        }
      });
    });
    mapObserver.observe(mapIframe);
  }
});
