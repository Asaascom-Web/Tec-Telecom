document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtn = document.querySelector(".mobile-dropdown-btn");
  const navTabs = document.querySelector(".nav-tabs");
  const tabs = document.querySelectorAll(".nav-tab");
  const progressBar = document.querySelector(".progress-bar");

  // Keep track of dropdown state
  let isOpen = false;
  let sections = [];
  let currentSection = "";

  // Initialize sections array
  const initializeSections = () => {
    tabs.forEach((tab) => {
      const sectionId = tab.getAttribute("data-section");
      const section = document.getElementById(sectionId);
      if (section) {
        sections.push({
          id: sectionId,
          element: section,
          tab: tab,
        });
      }
    });
  };

  // Calculate scroll percentage
  const calculateScrollProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.scrollY;
    const progress = (scrollTop / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
  };

  // Update active section based on scroll position
  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    // Find the current section
    let newCurrentSection = "";
    for (const section of sections) {
      const element = section.element;
      const rect = element.getBoundingClientRect();
      const offset = element.offsetTop;

      if (scrollPosition >= offset && scrollPosition < offset + rect.height) {
        newCurrentSection = section.id;
        break;
      }
    }

    // If we found a new section and it's different from the current one
    if (newCurrentSection && newCurrentSection !== currentSection) {
      currentSection = newCurrentSection;

      // Update active tab
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute("data-section") === currentSection;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", isActive);

        if (isActive) {
          updateButtonText(tab);
        }
      });
    }
  };

  // Update button text to match active tab
  const updateButtonText = (activeTab) => {
    dropdownBtn.textContent = activeTab.textContent;
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    isOpen = !isOpen;
    navTabs.classList.toggle("show");
    dropdownBtn.classList.toggle("active");

    // Update ARIA attributes
    dropdownBtn.setAttribute("aria-expanded", isOpen);
    navTabs.setAttribute("aria-hidden", !isOpen);

    // If closing dropdown, move focus back to button
    if (!isOpen) {
      dropdownBtn.focus();
    }
  };

  // Set up initial ARIA attributes and roles
  const initializeAccessibility = () => {
    dropdownBtn.setAttribute("aria-haspopup", "true");
    dropdownBtn.setAttribute("aria-expanded", "false");
    dropdownBtn.setAttribute("aria-label", "Navigation menu");
    navTabs.setAttribute("role", "menu");
    navTabs.setAttribute("aria-hidden", "true");

    tabs.forEach((tab) => {
      tab.setAttribute("role", "menuitem");
      tab.setAttribute("tabindex", "-1");
    });
  };

  // Handle keyboard navigation
  const handleKeyboard = (event) => {
    const activeElement = document.activeElement;
    const firstTab = tabs[0];
    const lastTab = tabs[tabs.length - 1];

    switch (event.key) {
      case "Escape":
        if (isOpen) {
          toggleDropdown();
        }
        break;

      case "ArrowDown":
        if (activeElement === dropdownBtn) {
          event.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          }
          firstTab.focus();
        } else if (
          activeElement.nextElementSibling?.querySelector(".nav-tab")
        ) {
          event.preventDefault();
          activeElement.nextElementSibling.querySelector(".nav-tab").focus();
        }
        break;

      case "ArrowUp":
        if (activeElement !== dropdownBtn) {
          event.preventDefault();
          if (activeElement === firstTab) {
            dropdownBtn.focus();
          } else {
            activeElement.parentElement.previousElementSibling
              .querySelector(".nav-tab")
              .focus();
          }
        }
        break;

      case "Tab":
        if (isOpen && !event.shiftKey && activeElement === lastTab) {
          event.preventDefault();
          toggleDropdown();
          dropdownBtn.focus();
        }
        break;
    }
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (event) => {
    if (
      isOpen &&
      !navTabs.contains(event.target) &&
      !dropdownBtn.contains(event.target)
    ) {
      toggleDropdown();
    }
  };

  // Handle window resize
  const handleResize = () => {
    const isMobile = window.innerWidth <= 1023;

    // Reset states when switching between mobile and desktop
    if (!isMobile && isOpen) {
      isOpen = false;
      navTabs.classList.remove("show");
      dropdownBtn.classList.remove("active");
      dropdownBtn.setAttribute("aria-expanded", "false");
      navTabs.setAttribute("aria-hidden", "true");
    }

    // Update tab indices based on viewport
    tabs.forEach((tab) => {
      tab.setAttribute("tabindex", isMobile ? "-1" : "0");
    });
  };

  // Handle tab selection
  const handleTabSelection = (selectedTab) => {
    // Remove active class from all tabs
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    // Add active class to selected tab
    selectedTab.classList.add("active");
    selectedTab.setAttribute("aria-selected", "true");

    // Update dropdown button text
    updateButtonText(selectedTab);

    // Close dropdown if on mobile
    if (window.innerWidth <= 1023) {
      toggleDropdown();
    }

    // Smooth scroll to section
    const sectionId = selectedTab.getAttribute("data-section");
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll with throttle
  const throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Initialize
  const init = () => {
    initializeAccessibility();
    initializeSections();
    handleResize(); // Set initial state based on viewport

    // Event Listeners
    dropdownBtn.addEventListener("click", toggleDropdown);
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);

    // Add scroll event listeners with throttling
    window.addEventListener(
      "scroll",
      throttle(() => {
        calculateScrollProgress();
        updateActiveSection();
      }, 100)
    );

    // Tab click handlers
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => handleTabSelection(tab));
    });

    // Set initial button text and section
    const activeTab = document.querySelector(".nav-tab.active");
    if (activeTab) {
      updateButtonText(activeTab);
      currentSection = activeTab.getAttribute("data-section");
    }

    // Initial scroll position check
    calculateScrollProgress();
    updateActiveSection();
  };

  init();
});
