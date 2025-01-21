document.addEventListener("DOMContentLoaded", initializeNavigation);

// Make the function global so it can be called after page loads
window.initializeNavigation = function() {
  const navToggle = document.getElementById("nav--toggle");
  const navMenu = document.getElementById("nav--menu");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  // First, remove any existing event listeners
  function cleanupOldListeners() {
    if (navToggle) {
      const oldToggle = navToggle.cloneNode(true);
      navToggle.parentNode.replaceChild(oldToggle, navToggle);
    }
    
    dropdownItems.forEach(item => {
      const trigger = item.querySelector(".nav-link");
      if (trigger) {
        const oldTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(oldTrigger, trigger);
      }
    });
  }

  // Clean up old listeners
  cleanupOldListeners();

  // Re-get elements after cleanup
  const newNavToggle = document.getElementById("nav--toggle");
  const newDropdownItems = document.querySelectorAll(".dropdown-item");

  // Setup Accessibility
  newNavToggle.setAttribute("aria-label", "Toggle navigation menu");
  newNavToggle.setAttribute("aria-expanded", "false");
  newNavToggle.setAttribute("role", "button");
  navMenu.setAttribute("aria-label", "Main navigation");

  // Set up ARIA labels and roles for dropdowns
  newDropdownItems.forEach((item, index) => {
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
    
    menu.querySelectorAll(".dropdown-link").forEach(link => {
      link.setAttribute("role", "menuitem");
      link.setAttribute("tabindex", "-1");
    });
  });

  // Mobile menu toggle with accessibility
  const toggleMobileMenu = () => {
    const isExpanded = navMenu.classList.toggle("show-menu");
    newNavToggle.classList.toggle("show-icon");
    newNavToggle.setAttribute("aria-expanded", isExpanded);
    navMenu.setAttribute("aria-hidden", !isExpanded);

    if (isExpanded) {
      document.body.style.overflow = "hidden";
      const firstFocusable = navMenu.querySelector("a, button, [tabindex='0']");
      if (firstFocusable) firstFocusable.focus();
    } else {
      document.body.style.overflow = "auto";
      newNavToggle.focus();
    }
  };

  newNavToggle.addEventListener("click", toggleMobileMenu);

  // Handle dropdown interactions
  newDropdownItems.forEach(item => {
    const trigger = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown-menu");
    
    const handleInteraction = (e) => {
      if (window.innerWidth < 1119) { // Mobile view
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = item.classList.toggle("active");
        trigger.setAttribute("aria-expanded", isExpanded);
        menu.setAttribute("aria-hidden", !isExpanded);
        
        // Close other dropdowns
        newDropdownItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            const otherTrigger = otherItem.querySelector(".nav-link");
            const otherMenu = otherItem.querySelector(".dropdown-menu");
            otherItem.classList.remove("active");
            otherTrigger.setAttribute("aria-expanded", "false");
            otherMenu.setAttribute("aria-hidden", "true");
          }
        });
      }
    };

    // Add both touch and click listeners
    trigger.addEventListener("touchstart", handleInteraction, { passive: false });
    trigger.addEventListener("click", handleInteraction);

    // Desktop hover behavior
    if (window.innerWidth >= 1119) {
      let hoverTimeout;
      
      item.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimeout);
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        menu.setAttribute("aria-hidden", "false");
      });

      item.addEventListener("mouseleave", () => {
        hoverTimeout = setTimeout(() => {
          item.classList.remove("active");
          trigger.setAttribute("aria-expanded", "false");
          menu.setAttribute("aria-hidden", "true");
        }, 150);
      });
    }

    // Keyboard navigation
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleInteraction(e);
      } else if (e.key === "ArrowDown" && item.classList.contains("active")) {
        e.preventDefault();
        const firstMenuItem = menu.querySelector(".dropdown-link");
        if (firstMenuItem) firstMenuItem.focus();
      }
    });

    const menuItems = menu.querySelectorAll(".dropdown-link");
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
            handleInteraction(e);
            break;
        }
      });
    });
  });

  // Close menu when clicking/touching outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !newNavToggle.contains(e.target)) {
      navMenu.classList.remove("show-menu");
      newNavToggle.classList.remove("show-icon");
      newNavToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "auto";

      newDropdownItems.forEach(item => {
        const trigger = item.querySelector(".nav-link");
        const menu = item.querySelector(".dropdown-menu");
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      });
    }
  });

  // Close menu when touching outside
  document.addEventListener("touchstart", (e) => {
    if (!navMenu.contains(e.target) && !newNavToggle.contains(e.target)) {
      newDropdownItems.forEach(item => {
        const trigger = item.querySelector(".nav-link");
        const menu = item.querySelector(".dropdown-menu");
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      });
    }
  });
};

// Handle page transitions
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', initializeNavigation);
  window.addEventListener('load', initializeNavigation);
}