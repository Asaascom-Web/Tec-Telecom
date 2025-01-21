document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav--toggle");
  const navMenu = document.getElementById("nav--menu");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  // Accessibility setup
  navToggle.setAttribute("aria-label", "Toggle navigation menu");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("role", "button");
  navMenu.setAttribute("aria-label", "Main navigation");

  // Set up ARIA labels and roles for dropdowns
  dropdownItems.forEach((item, index) => {
    const trigger = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown-menu");
    const menuId = `dropdown-menu-${index}`;
    
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", menuId);
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-haspopup", "true");
    
    menu.setAttribute("id", menuId);
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-hidden", "true");
    
    // Set roles for dropdown items
    menu.querySelectorAll(".dropdown-link").forEach(link => {
      link.setAttribute("role", "menuitem");
      link.setAttribute("tabindex", "-1");
    });
  });

  // Determine if current view is mobile
  const isMobileView = () => window.innerWidth < 1119;

  // Enhanced Mobile Menu Toggle with accessibility
  const toggleMobileMenu = () => {
    const isExpanded = navMenu.classList.toggle("show-menu");
    navToggle.classList.toggle("show-icon");
    navToggle.setAttribute("aria-expanded", isExpanded);
    navMenu.setAttribute("aria-hidden", !isExpanded);

    // Manage focus trap in mobile menu
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      // Focus first interactive element
      const firstFocusable = navMenu.querySelector("a, button, [tabindex='0']");
      if (firstFocusable) firstFocusable.focus();
    } else {
      document.body.style.overflow = "auto";
      navToggle.focus(); // Return focus to toggle button
    }
  };

  // Enhanced Mobile Dropdown Toggle with accessibility
  const toggleMobileDropdown = (item) => {
    const trigger = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown-menu");
    const isExpanded = item.classList.toggle("active");

    // Update ARIA states
    trigger.setAttribute("aria-expanded", isExpanded);
    menu.setAttribute("aria-hidden", !isExpanded);

    // Close other dropdowns
    dropdownItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("active")) {
        const otherTrigger = otherItem.querySelector(".nav-link");
        const otherMenu = otherItem.querySelector(".dropdown-menu");
        otherItem.classList.remove("active");
        otherTrigger.setAttribute("aria-expanded", "false");
        otherMenu.setAttribute("aria-hidden", "true");
      }
    });
  };

  // Enhanced touch handling for dropdowns
  const handleDropdownTouch = (item, e) => {
    e.stopPropagation();
    const trigger = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown-menu");
    const isActive = item.classList.contains("active");

    // Close other dropdowns first
    dropdownItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("active")) {
        otherItem.classList.remove("active");
        const otherTrigger = otherItem.querySelector(".nav-link");
        const otherMenu = otherItem.querySelector(".dropdown-menu");
        otherTrigger.setAttribute("aria-expanded", "false");
        otherMenu.setAttribute("aria-hidden", "true");
      }
    });

    // Toggle current dropdown
    item.classList.toggle("active");
    trigger.setAttribute("aria-expanded", !isActive);
    menu.setAttribute("aria-hidden", isActive);

    // If this is a link with href and dropdown is already open, allow navigation
    const link = trigger.querySelector("a");
    if (link && link.href && isActive) {
      window.location.href = link.href;
    }
  };

  // Enhanced Desktop Dropdown Hover
  const setupDesktopDropdown = (item) => {
    const trigger = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown-menu");
    let hoverTimeout;

    const showDropdown = () => {
      clearTimeout(hoverTimeout);
      item.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
    };

    const hideDropdown = () => {
      hoverTimeout = setTimeout(() => {
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      }, 150);
    };

    item.addEventListener("mouseenter", showDropdown);
    item.addEventListener("mouseleave", hideDropdown);
  };

  // Enhanced focus management
  const setupFocusManagement = () => {
    const focusableElements = navMenu.querySelectorAll(
      'a[href], button, [tabindex="0"]'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Trap focus within mobile menu when open
    lastFocusable.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey && navMenu.classList.contains("show-menu")) {
        e.preventDefault();
        firstFocusable.focus();
      }
    });

    firstFocusable.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && e.shiftKey && navMenu.classList.contains("show-menu")) {
        e.preventDefault();
        lastFocusable.focus();
      }
    });
  };

  // Enhanced keyboard navigation
  const setupKeyboardNavigation = () => {
    dropdownItems.forEach((item) => {
      const trigger = item.querySelector(".nav-link");
      const menu = item.querySelector(".dropdown-menu");
      const menuItems = menu.querySelectorAll(".dropdown-link");

      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleMobileDropdown(item);
        } else if (e.key === "ArrowDown" && item.classList.contains("active")) {
          e.preventDefault();
          menuItems[0].focus();
        }
      });

      menuItems.forEach((menuItem, index) => {
        menuItem.addEventListener("keydown", (e) => {
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              if (index < menuItems.length - 1) {
                menuItems[index + 1].focus();
              }
              break;
            case "ArrowUp":
              e.preventDefault();
              if (index > 0) {
                menuItems[index - 1].focus();
              } else {
                trigger.focus();
              }
              break;
            case "Escape":
              e.preventDefault();
              trigger.focus();
              toggleMobileDropdown(item);
              break;
          }
        });
      });
    });
  };

  // Responsive behavior setup
  const setupResponsiveBehavior = () => {
    const isMobile = isMobileView();
    
    dropdownItems.forEach((item) => {
      const trigger = item.querySelector(".nav-link");
      
      // Remove existing listeners
      trigger.removeEventListener("touchstart", handleDropdownTouch);
      item.removeEventListener("mouseenter", null);
      item.removeEventListener("mouseleave", null);

      if (isMobile) {
        // Mobile behavior
        trigger.addEventListener("touchstart", (e) => handleDropdownTouch(item, e));
      } else {
        // Desktop behavior
        setupDesktopDropdown(item);
      }
    });
  };

  // Navigation Toggle Setup
  navToggle.addEventListener("click", toggleMobileMenu);

  // Initial setup
  setupFocusManagement();
  setupKeyboardNavigation();
  setupResponsiveBehavior();

  // Update on resize
  window.addEventListener("resize", setupResponsiveBehavior);

  // Close menu when clicking/touching outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("show-menu");
      navToggle.classList.remove("show-icon");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "auto";

      dropdownItems.forEach((item) => {
        const trigger = item.querySelector(".nav-link");
        const menu = item.querySelector(".dropdown-menu");
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      });
    }
  });

  document.addEventListener("touchstart", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      dropdownItems.forEach((item) => {
        item.classList.remove("active");
        const trigger = item.querySelector(".nav-link");
        const menu = item.querySelector(".dropdown-menu");
        trigger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      });
    }
  });
});