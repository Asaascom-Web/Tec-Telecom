document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav--toggle");
  const navMenu = document.getElementById("nav--menu");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  // Determine if current view is mobile
  const isMobileView = () => window.innerWidth < 1119;

  // Mobile Menu Toggle
  const toggleMobileMenu = () => {
    navMenu.classList.toggle("show-menu");
    navToggle.classList.toggle("show-icon");

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains("show-menu")
      ? "hidden"
      : "auto";
  };

  // Mobile Dropdown Toggle
  const toggleMobileDropdown = (item) => {
    // Close other open dropdowns
    dropdownItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });

    // Toggle current dropdown
    item.classList.toggle("active");
  };

  // Desktop Dropdown Hover
  const setupDesktopDropdown = (item) => {
    item.addEventListener("mouseenter", () => {
      item.classList.add("active");
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("active");
    });
  };

  // Mobile Dropdown Click Handler
  const setupMobileDropdown = (item) => {
    const dropdownLink = item.querySelector(".nav-link");

    dropdownLink.addEventListener("click", (e) => {
      // Prevent default only if it's a dropdown
      if (item.querySelector(".dropdown-menu")) {
        e.preventDefault();
        toggleMobileDropdown(item);
      }
    });
  };

  // Navigation Toggle Setup
  navToggle.addEventListener("click", toggleMobileMenu);

  // Responsive Dropdown Setup
  const setupDropdowns = () => {
    dropdownItems.forEach((item) => {
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
  document.addEventListener("click", (e) => {
    // Check if click is outside nav menu and nav toggle
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      // Close mobile menu
      navMenu.classList.remove("show-menu");
      navToggle.classList.remove("show-icon");

      // Reset body scroll
      document.body.style.overflow = "auto";

      // Close all dropdowns
      dropdownItems.forEach((item) => {
        item.classList.remove("active");
      });
    }
  });

  // Keyboard Accessibility for Dropdowns
  document.addEventListener("keydown", (e) => {
    // Close menu with Escape key
    if (e.key === "Escape") {
      navMenu.classList.remove("show-menu");
      navToggle.classList.remove("show-icon");
      document.body.style.overflow = "auto";

      dropdownItems.forEach((item) => {
        item.classList.remove("active");
      });
    }
  });

  // Initial setup
  setupDropdowns();

  // Reapply setup on window resize
  window.addEventListener("resize", () => {
    setupDropdowns();
  });
});
