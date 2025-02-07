// ==========================================
// Service Carousel Logic
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const serviceNavItems = document.querySelectorAll(".service-nav-item");
  const servicePanels = document.querySelectorAll(".service-panel");
  let currentServiceIndex = 0;
  let cycleInterval;

  /**
   * Cycles through service panels automatically
   */
  function cycleServices() {
      // Remove active class from current items
      serviceNavItems.forEach((item) => item.classList.remove("active"));
      servicePanels.forEach((panel) => panel.classList.remove("active"));

      // Update index, wrapping around if necessary
      currentServiceIndex = (currentServiceIndex + 1) % serviceNavItems.length;

      // Add active class to next items
      serviceNavItems[currentServiceIndex].classList.add("active");
      servicePanels[currentServiceIndex].classList.add("active");
  }

  // Manual Navigation Setup
  serviceNavItems.forEach((item) => {
      item.addEventListener("click", (e) => {
          e.preventDefault();

          // Remove active class from all items
          serviceNavItems.forEach((nav) => nav.classList.remove("active"));
          servicePanels.forEach((panel) => panel.classList.remove("active"));

          // Add active class to clicked item and corresponding panel
          const serviceId = item.dataset.service;
          item.classList.add("active");
          document.getElementById(serviceId).classList.add("active");

          // Reset automatic cycling timer
          clearInterval(cycleInterval);
          cycleInterval = setInterval(cycleServices, 10000);
      });
  });

  // Initialize auto-cycling
  cycleInterval = setInterval(cycleServices, 10000);

  // ==========================================
  // Navigation Setup
  // ==========================================

  const CONFIG = {
      selectors: {
          navTab: ".nav-tab",
          section: "section",
          progressBar: "#progressBar",
      },
      heights: {
          mainNav: 60,
          tabsNav: 60,
      },
      classes: {
          active: "active",
      },
      scroll: {
          behavior: "smooth",
          offset: 1,
      },
  };

  class NavigationController {
      constructor(config) {
          this.config = config;
          this.progressBar = document.querySelector(config.selectors.progressBar);
          this.ticking = false;
          this.totalOffset = config.heights.mainNav + config.heights.tabsNav;
          this.init();
      }

      init() {
          this.setupTabListeners();
          this.setupScrollListener();
      }

      setupTabListeners() {
          const tabs = document.querySelectorAll(this.config.selectors.navTab);
          tabs.forEach((tab) => {
              tab.addEventListener("click", (e) => this.handleTabClick(e));
          });
      }

      setupScrollListener() {
          window.addEventListener("scroll", () => this.handleScroll());
      }

      handleTabClick(e) {
          e.preventDefault();

          const sectionId = e.target.dataset.section;
          const section = document.getElementById(sectionId);

          if (!section) return;

          this.updateActiveTabs(e.target);
          this.scrollToSection(section);
      }

      updateActiveTabs(activeTab) {
          document
              .querySelectorAll(this.config.selectors.navTab)
              .forEach((tab) => tab.classList.remove(this.config.classes.active));

          activeTab.classList.add(this.config.classes.active);
      }

      scrollToSection(section) {
          const targetPosition =
              section.offsetTop - this.totalOffset + this.config.scroll.offset;

          window.scrollTo({
              top: targetPosition,
              behavior: this.config.scroll.behavior,
          });
      }

      handleScroll() {
          if (!this.ticking) {
              window.requestAnimationFrame(() => {
                  this.updateProgressBar();
                  this.updateActiveTabOnScroll();
                  this.ticking = false;
              });
              this.ticking = true;
          }
      }

      updateProgressBar() {
          if (!this.progressBar) return;

          const winScroll = document.documentElement.scrollTop;
          const height =
              document.documentElement.scrollHeight -
              document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;

          this.progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
      }

      updateActiveTabOnScroll() {
          const sections = document.querySelectorAll(this.config.selectors.section);

          sections.forEach((section) => {
              const rect = section.getBoundingClientRect();
              if (rect.top <= this.totalOffset && rect.bottom > this.totalOffset) {
                  this.updateTabsForSection(section.id);
              }
          });
      }

      updateTabsForSection(sectionId) {
          document.querySelectorAll(this.config.selectors.navTab).forEach((tab) => {
              tab.classList.toggle(
                  this.config.classes.active,
                  tab.dataset.section === sectionId
              );
          });
      }
  }

  // Initialize Navigation Controller
  const navController = new NavigationController(CONFIG);

  // ==========================================
  // Hero Button Setup
  // ==========================================

  const heroButton = document.querySelector('.hero-view-btn');
  if (heroButton) {
      const getHeaderOffset = () => {
          const viewportWidth = window.innerWidth;
          if (viewportWidth < 768) return 70;
          if (viewportWidth < 1024) return 85;
          return 100;
      };

      heroButton.addEventListener('click', (e) => {
          e.preventDefault();
          
          const targetSectionId = heroButton.dataset.section;
          const targetSection = document.getElementById(targetSectionId);
          
          if (targetSection) {
              const headerOffset = getHeaderOffset();
              const elementPosition = targetSection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      });
  }

  // ==========================================
  // Performance Monitoring
  // ==========================================

  window.addEventListener("load", () => {
      setTimeout(() => {
          if (window.performance && window.performance.timing) {
              const timing = window.performance.timing;
              const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
              console.log(`Page load time: ${pageLoadTime}ms`);
          }
      }, 0);
  });

  // ==========================================
  // Service Worker Registration
  // ==========================================

  if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
          navigator.serviceWorker.register("/sw.js").catch(console.error);
      });
  }
});