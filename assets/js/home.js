// Automatic Cycling
const serviceNavItems = document.querySelectorAll(".service-nav-item");
const servicePanels = document.querySelectorAll(".service-panel");
let currentServiceIndex = 0;

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

// Manual Navigation
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
    cycleInterval = setInterval(cycleServices, 5000);
  });
});
class ProjectCarousel {
  constructor() {
    this.track = document.querySelector(".carousel-track");
    this.slides = document.querySelectorAll(".carousel-slide");
    this.dotsContainer = document.querySelector(".carousel-dots");
    this.prevButton = document.querySelector(".carousel-button.prev");
    this.nextButton = document.querySelector(".carousel-button.next");

    this.currentIndex = 0;
    this.slidesPerView = this.getSlidesPerView();
    this.totalSlides = Math.ceil(this.slides.length / this.slidesPerView);

    // Touch handling variables
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.startTranslate = 0;
    this.currentTranslate = 0;

    this.init();
  }

  init() {
    this.generateDots();
    this.updateCarousel();
    this.setupTouchEvents();
    this.setupButtons();
    window.addEventListener("resize", () => this.handleResize());
  }

  getSlidesPerView() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth <= 767) return 1;
    if (viewportWidth <= 1024) return 2;
    return 3;
  }

  generateDots() {
    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === this.currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  setupButtons() {
    this.prevButton.addEventListener("click", () => this.prev());
    this.nextButton.addEventListener("click", () => this.next());
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  next() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel(animation = true) {
    const slideWidth = 100 / this.slidesPerView;
    const translation = -this.currentIndex * slideWidth;

    if (!animation) {
      this.track.style.transition = "none";
    } else {
      this.track.style.transition = "transform 0.3s ease-out";
    }

    this.track.style.transform = `translateX(${translation}%)`;

    if (!animation) {
      // Force reflow
      this.track.offsetHeight;
      this.track.style.transition = "";
    }

    // Update dots
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });

    // Update buttons
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex === this.totalSlides - 1;
  }

  setupTouchEvents() {
    // Touch events
    this.track.addEventListener("touchstart", (e) => this.touchStart(e), {
      passive: true,
    });
    this.track.addEventListener("touchmove", (e) => this.touchMove(e), {
      passive: false,
    });
    this.track.addEventListener("touchend", () => this.touchEnd());

    // Mouse events
    this.track.addEventListener("mousedown", (e) => this.touchStart(e));
    this.track.addEventListener("mousemove", (e) => this.touchMove(e));
    this.track.addEventListener("mouseup", () => this.touchEnd());
    this.track.addEventListener("mouseleave", () => this.touchEnd());
  }

  touchStart(e) {
    this.isDragging = true;
    this.touchStartX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    this.startTranslate = this.currentTranslate;

    this.track.style.transition = "none";
  }

  touchMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    const currentPosition = e.type.includes("mouse")
      ? e.pageX
      : e.touches[0].pageX;
    const diff = currentPosition - this.touchStartX;

    const dragPercentage = (diff / this.track.offsetWidth) * 100;
    this.currentTranslate = this.startTranslate + dragPercentage;

    const maxTranslate = 0;
    const minTranslate = -((this.totalSlides - 1) * (100 / this.slidesPerView));
    this.currentTranslate = Math.max(
      Math.min(this.currentTranslate, maxTranslate),
      minTranslate
    );

    this.track.style.transform = `translateX(${this.currentTranslate}%)`;
  }

  touchEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track.style.transition = "transform 0.3s ease-out";

    const slideWidth = 100 / this.slidesPerView;
    const slideIndex = Math.round(Math.abs(this.currentTranslate) / slideWidth);

    this.currentIndex = Math.max(0, Math.min(slideIndex, this.totalSlides - 1));
    this.updateCarousel();
  }

  handleResize() {
    const newSlidesPerView = this.getSlidesPerView();
    if (newSlidesPerView !== this.slidesPerView) {
      this.slidesPerView = newSlidesPerView;
      this.totalSlides = Math.ceil(this.slides.length / this.slidesPerView);
      this.currentIndex = Math.min(this.currentIndex, this.totalSlides - 1);
      this.generateDots();
      this.updateCarousel(false);
    }
  }
}

// Initialize the carousel when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProjectCarousel();
});
// Configuration object for easy maintenance
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
    offset: 1, // Additional offset adjustment
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

    if (!section) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

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
    if (this.ticking) return;

    this.ticking = true;

    window.requestAnimationFrame(() => {
      this.updateProgressBar();
      this.updateActiveTabOnScroll();
      this.ticking = false;
    });
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

// Intersection Observer for optimized scroll handling
class ScrollObserver {
  constructor(navigationController) {
    this.navController = navigationController;
    this.observer = this.createObserver();
    this.observeSections();
  }

  createObserver() {
    return new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0,
        rootMargin: `-${this.navController.totalOffset}px 0px 0px 0px`,
      }
    );
  }

  observeSections() {
    document
      .querySelectorAll(this.navController.config.selectors.section)
      .forEach((section) => this.observer.observe(section));
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.navController.updateTabsForSection(entry.target.id);
      }
    });
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  try {
    const navController = new NavigationController(CONFIG);
    new ScrollObserver(navController);
  } catch (error) {
    console.error("Failed to initialize navigation:", error);
  }
});

// Handle dynamic content loading (if needed)
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target.tagName.toLowerCase() === "section") {
      // Recalculate scroll positions if section content changes
      window.dispatchEvent(new CustomEvent("scroll"));
    }
  });
});

document.querySelectorAll("section").forEach((section) => {
  resizeObserver.observe(section);
});

// Simple performance monitoring
window.addEventListener("load", () => {
  setTimeout(() => {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
  }, 0);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}
