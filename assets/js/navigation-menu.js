// DOM Elements with performance optimizations
const navElements = {
    toggle: document.getElementById('nav--toggle'),
    menu: document.getElementById('nav--menu'),
    dropdowns: document.querySelectorAll('.dropdown-item'),
    links: document.querySelectorAll('.nav-link'),
    body: document.body
  };
  
  // Improved device detection with feature detection
  const deviceDetection = {
    supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isLargeScreen: () => window.innerWidth >= 1119
  };
  
  // Enhanced accessibility management
  const a11yManager = {
    updateAriaStates(element, isExpanded) {
      element.setAttribute('aria-expanded', isExpanded);
      element.setAttribute('aria-label', `${isExpanded ? 'Close' : 'Open'} menu`);
    },
    
    setupA11y() {
      navElements.dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.nav-link');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        
        const menu = dropdown.querySelector('.dropdown-menu');
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-label', 'Submenu');
      });
    }
  };
  
  // Desktop-specific navigation handlers
  const desktopNavigation = {
    setupHoverEvents() {
      navElements.dropdowns.forEach(dropdown => {
        let hoverTimeout;
  
        // Mouse enter event
        dropdown.addEventListener('mouseenter', () => {
          if (deviceDetection.isLargeScreen()) {
            clearTimeout(hoverTimeout);
            // Close other dropdowns
            navElements.dropdowns.forEach(other => {
              if (other !== dropdown) {
                other.classList.remove('active');
                const otherButton = other.querySelector('.nav-link');
                a11yManager.updateAriaStates(otherButton, false);
              }
            });
            
            // Open current dropdown
            dropdown.classList.add('active');
            const button = dropdown.querySelector('.nav-link');
            a11yManager.updateAriaStates(button, true);
          }
        });
  
        // Mouse leave event
        dropdown.addEventListener('mouseleave', () => {
          if (deviceDetection.isLargeScreen()) {
            hoverTimeout = setTimeout(() => {
              dropdown.classList.remove('active');
              const button = dropdown.querySelector('.nav-link');
              a11yManager.updateAriaStates(button, false);
            }, 150); // Small delay to prevent flickering
          }
        });
      });
    },
  
    setupKeyboardNavigation() {
      navElements.dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = menu.querySelectorAll('.dropdown-link');
  
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            dropdown.classList.add('active');
            a11yManager.updateAriaStates(button, true);
            items[0]?.focus();
          }
        });
  
        items.forEach((item, index) => {
          item.addEventListener('keydown', (e) => {
            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                items[index + 1]?.focus();
                break;
              case 'ArrowUp':
                e.preventDefault();
                if (index === 0) {
                  button.focus();
                } else {
                  items[index - 1]?.focus();
                }
                break;
              case 'Escape':
                e.preventDefault();
                dropdown.classList.remove('active');
                a11yManager.updateAriaStates(button, false);
                button.focus();
                break;
            }
          });
        });
      });
    }
  };
  
  // Performance-optimized event handlers
  const eventHandlers = {
    touchStart: null,
    touchMove: null,
    
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    handleTouchStart(e) {
      eventHandlers.touchStart = e.touches[0].clientY;
    },
    
    handleTouchMove(e) {
      if (!eventHandlers.touchStart) return;
      
      const touchEnd = e.touches[0].clientY;
      const diff = eventHandlers.touchStart - touchEnd;
      
      if (navElements.menu.classList.contains('show-menu') && diff > 5) {
        e.preventDefault();
      }
    }
  };
  
  // Enhanced menu management
  const menuManager = {
    toggle() {
      const isOpen = navElements.menu.classList.toggle('show-menu');
      navElements.toggle.classList.toggle('show-icon');
      
      navElements.body.style.setProperty('--scroll-behavior', isOpen ? 'hidden' : 'initial');
      a11yManager.updateAriaStates(navElements.toggle, isOpen);
      
      requestAnimationFrame(() => {
        navElements.menu.classList.toggle('menu-animating');
      });
    },
    
    close() {
      navElements.menu.classList.remove('show-menu', 'menu-animating');
      navElements.toggle.classList.remove('show-icon');
      navElements.body.style.setProperty('--scroll-behavior', 'initial');
      navElements.dropdowns.forEach(dropdown => {
        if (!deviceDetection.isLargeScreen()) {
          dropdown.classList.remove('active');
          const button = dropdown.querySelector('.nav-link');
          a11yManager.updateAriaStates(button, false);
        }
      });
    },
    
    handleDropdown(dropdown, isDesktop = false) {
      if (!isDesktop && deviceDetection.isLargeScreen()) return;
      
      const isActive = dropdown.classList.toggle('active');
      const button = dropdown.querySelector('.nav-link');
      a11yManager.updateAriaStates(button, isActive);
      
      // Close other dropdowns
      if (!isDesktop) {
        navElements.dropdowns.forEach(other => {
          if (other !== dropdown && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherButton = other.querySelector('.nav-link');
            a11yManager.updateAriaStates(otherButton, false);
          }
        });
      }
    }
  };
  
  // Initialization with performance optimizations
  const init = () => {
    // Setup accessibility
    a11yManager.setupA11y();
    
    // Setup desktop-specific behavior
    desktopNavigation.setupHoverEvents();
    desktopNavigation.setupKeyboardNavigation();
    
    // Event delegation for better performance
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Handle menu toggle
      if (target.closest('#nav--toggle')) {
        menuManager.toggle();
        return;
      }
      
      // Handle dropdown toggles
      const dropdownButton = target.closest('.dropdown-item .nav-link');
      if (dropdownButton && !deviceDetection.isLargeScreen()) {
        e.preventDefault();
        menuManager.handleDropdown(dropdownButton.closest('.dropdown-item'));
        return;
      }
      
      // Handle outside clicks
      if (!target.closest('.nav-menu') && !deviceDetection.isLargeScreen()) {
        menuManager.close();
      }
    });
    
    // Touch event optimization
    if (deviceDetection.supportsTouch) {
      navElements.menu.addEventListener('touchstart', eventHandlers.handleTouchStart, { passive: true });
      navElements.menu.addEventListener('touchmove', eventHandlers.handleTouchMove, { passive: false });
    }
    
    // Smooth scroll with performance considerations
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            menuManager.close();
            const behavior = deviceDetection.isReducedMotion ? 'auto' : 'smooth';
            target.scrollIntoView({ behavior, block: 'center' });
          }
        }
      });
    });
    
    // Optimized resize handler
    window.addEventListener('resize', eventHandlers.debounce(() => {
      if (deviceDetection.isLargeScreen()) {
        menuManager.close();
      }
    }, 150));
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Service worker registration with error handling
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }