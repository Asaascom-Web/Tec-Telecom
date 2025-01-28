document.addEventListener('DOMContentLoaded', function() {
  const dropdownBtn = document.querySelector('.mobile-dropdown-btn');
  const navTabs = document.querySelector('.nav-tabs');
  const tabs = document.querySelectorAll('.nav-tab');
  
  // Update dropdown button text
  function updateDropdownText(text) {
    if (text) {
      dropdownBtn.textContent = text;
    }
  }

  // Get all sections
  const sections = {};
  tabs.forEach(tab => {
    const sectionId = tab.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) {
      sections[sectionId] = section;
    }
  });

  // Scroll detection and section update
  function updateActiveSection() {
    // Only run on mobile and tablet
    if (window.innerWidth >= 1024) return;

    const scrollPosition = window.scrollY + 100; // Offset for better detection

    // Find the current section
    for (const [sectionId, section] of Object.entries(sections)) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Update active tab
        tabs.forEach(tab => {
          if (tab.getAttribute('data-section') === sectionId) {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateDropdownText(tab.textContent);
          }
        });
        break;
      }
    }
  }

  // Toggle dropdown
  dropdownBtn.addEventListener('click', function() {
    navTabs.classList.toggle('show');
    this.classList.toggle('active');
  });

  // Handle tab selection
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Update dropdown button text
      updateDropdownText(this.textContent);
      
      // Hide dropdown
      navTabs.classList.remove('show');
      dropdownBtn.classList.remove('active');
      
      // Scroll to section
      const section = this.getAttribute('data-section');
      const targetSection = document.getElementById(section);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.nav-container')) {
      navTabs.classList.remove('show');
      dropdownBtn.classList.remove('active');
    }
  });

  // Add scroll event listener
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Add resize event listener to handle responsive changes
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateActiveSection, 100);
  });

  // Initial updates
  updateActiveSection();
});