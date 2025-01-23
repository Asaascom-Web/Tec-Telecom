document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav--toggle');
    const navMenu = document.getElementById('nav--menu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Determine if current view is mobile
    const isMobileView = () => window.innerWidth < 1119;

    // Mobile Menu Toggle
    const toggleMobileMenu = () => {
        navMenu.classList.toggle('show-menu');
        navToggle.classList.toggle('show-icon');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('show-menu') 
            ? 'hidden' 
            : 'auto';
    };

    // Mobile Dropdown Toggle
    const toggleMobileDropdown = (item) => {
        // Close other open dropdowns
        dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current dropdown
        item.classList.toggle('active');
    };

    // Desktop Dropdown Hover
    const setupDesktopDropdown = (item) => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            item.classList.remove('active');
        });
    };

    // Mobile Dropdown Click Handler
    const setupMobileDropdown = (item) => {
        const dropdownLink = item.querySelector('.nav-link');
        
        dropdownLink.addEventListener('click', (e) => {
            // Prevent default only if it's a dropdown
            if (item.querySelector('.dropdown-menu')) {
                e.preventDefault();
                toggleMobileDropdown(item);
            }
        });
    };

    // Navigation Toggle Setup
    navToggle.addEventListener('click', toggleMobileMenu);

    // Responsive Dropdown Setup
    const setupDropdowns = () => {
        dropdownItems.forEach(item => {
            // Remove existing listeners to prevent duplicates
            item.onmouseenter = null;
            item.onmouseleave = null;

            if (isMobileView()) {
                // Mobile setup
                setupMobileDropdown(item);
            } else {
                // Desktop setup
                setupDesktopDropdown(item);
            }
        });
    };

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if click is outside nav menu and nav toggle
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            // Close mobile menu
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('show-icon');
            
            // Reset body scroll
            document.body.style.overflow = 'auto';
            
            // Close all dropdowns
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Keyboard Accessibility for Dropdowns
    document.addEventListener('keydown', (e) => {
        // Close menu with Escape key
        if (e.key === 'Escape') {
            navMenu.classList.remove('show-menu');
            navToggle.classList.remove('show-icon');
            document.body.style.overflow = 'auto';
            
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Initial setup
    setupDropdowns();

    // Reapply setup on window resize
    window.addEventListener('resize', () => {
        setupDropdowns();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.service-section');
    const navTracker = document.createElement('div');
    navTracker.className = 'elegant-section-nav';
    
    // Create navigation items for each section
    sections.forEach((section, index) => {
      const navItem = document.createElement('div');
      navItem.className = 'section-nav-item';
      
      // Create dot
      const dot = document.createElement('button');
      dot.className = 'section-nav-dot';
      dot.setAttribute('aria-label', `Navigate to ${section.id} section`);
      dot.dataset.section = section.id;
      
      // Create title
      const title = document.createElement('span');
      title.className = 'section-nav-title';
      title.textContent = section.querySelector('.service-title').textContent;
      
      navItem.appendChild(dot);
      navItem.appendChild(title);
      
      navItem.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
        updateActiveNavItem(index);
      });
      
      navTracker.appendChild(navItem);
    });
    
    // Function to update active nav item
    function updateActiveNavItem(activeIndex = 0) {
      const navItems = navTracker.querySelectorAll('.section-nav-item');
      navItems.forEach(item => item.classList.remove('active'));
      navItems[activeIndex]?.classList.add('active');
    }
    
    // Add scroll event listener to dynamically update active section
    window.addEventListener('scroll', () => {
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          updateActiveNavItem(index);
        }
      });
    });
    
    // Initial active state
    updateActiveNavItem();
    
    // Append navigation tracker to body
    document.body.appendChild(navTracker);
  });
  
  // Accompanying CSS for styling
  const style = document.createElement('style');
  style.textContent = `
  .elegant-section-nav {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .section-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  .section-nav-item:hover,
  .section-nav-item.active {
    opacity: 1;
  }
  
  .section-nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #007bff;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease;
    margin-right: 1rem;
  }
  
  .section-nav-item.active .section-nav-dot {
    transform: scale(1.3);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  }
  
  .section-nav-title {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    transform: translateX(-10px);
    transition: all 0.3s ease;

  }
  
  .section-nav-item:hover .section-nav-title,
  .section-nav-item.active .section-nav-title {
    opacity: 1;
    transform: translateX(0);
  }
  
  @media (max-width: 768px) {
    .elegant-section-nav {
      display: none;
    }
  }
  `;
  document.head.appendChild(style);


