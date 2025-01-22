// DOM Elements
const navToggle = document.getElementById('nav--toggle');
const navMenu = document.getElementById('nav--menu');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Toggle Menu Function
const toggleMenu = () => {
    // Toggle menu visibility
    navMenu.classList.toggle('show-menu');
    // Toggle icon visibility
    navToggle.classList.toggle('show-icon');
    // Toggle body scroll
    document.body.style.overflow = navMenu.classList.contains('show-menu') ? 'hidden' : '';
};

// Close Menu Function
const closeMenu = () => {
    navMenu.classList.remove('show-menu');
    navToggle.classList.remove('show-icon');
    document.body.style.overflow = '';
    // Close all dropdowns when closing menu
    dropdownItems.forEach(item => {
        item.classList.remove('active');
    });
};

// Initialize Dropdowns
const initializeDropdowns = () => {
    dropdownItems.forEach(dropdown => {
        const dropdownButton = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Mobile Dropdown Click Handler
        const handleMobileClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            dropdownItems.forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        };

        // Desktop Hover Handler
        const handleDesktopHover = () => {
            if (window.innerWidth >= 1119) {
                dropdown.classList.add('active');
            }
        };

        const handleDesktopLeave = () => {
            if (window.innerWidth >= 1119) {
                dropdown.classList.remove('active');
            }
        };

        // Add click listener for mobile
        dropdownButton.addEventListener('click', (e) => {
            if (window.innerWidth < 1119) {
                handleMobileClick(e);
            }
        });

        // Add hover listeners for desktop
        if (window.innerWidth >= 1119) {
            dropdown.addEventListener('mouseenter', handleDesktopHover);
            dropdown.addEventListener('mouseleave', handleDesktopLeave);
        }

        // Update hover listeners on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1119) {
                dropdown.addEventListener('mouseenter', handleDesktopHover);
                dropdown.addEventListener('mouseleave', handleDesktopLeave);
            } else {
                dropdown.removeEventListener('mouseenter', handleDesktopHover);
                dropdown.removeEventListener('mouseleave', handleDesktopLeave);
            }
        });
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dropdowns
    initializeDropdowns();

    // Menu Toggle Click Event
    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 1119) {
                closeMenu();
            }
        }, 250);
    });

    // Close menu when pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Handle focus trap within mobile menu
    const focusableElements = navMenu.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu.classList.contains('show-menu')) {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    closeMenu();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});