
class ProjectCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.nextButton = document.querySelector('.carousel-button.next');
        
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
        window.addEventListener('resize', () => this.handleResize());
    }

    getSlidesPerView() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 767) return 1;
        if (viewportWidth <= 1024) return 2;
        return 3;
    }

    generateDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    setupButtons() {
        this.prevButton.addEventListener('click', () => this.prev());
        this.nextButton.addEventListener('click', () => this.next());
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
            this.track.style.transition = 'none';
        } else {
            this.track.style.transition = 'transform 0.3s ease-out';
        }
        
        this.track.style.transform = `translateX(${translation}%)`;
        
        if (!animation) {
            // Force reflow
            this.track.offsetHeight;
            this.track.style.transition = '';
        }
        
        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update buttons
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.totalSlides - 1;
    }

    setupTouchEvents() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.touchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.touchMove(e), { passive: false });
        this.track.addEventListener('touchend', () => this.touchEnd());

        // Mouse events
        this.track.addEventListener('mousedown', (e) => this.touchStart(e));
        this.track.addEventListener('mousemove', (e) => this.touchMove(e));
        this.track.addEventListener('mouseup', () => this.touchEnd());
        this.track.addEventListener('mouseleave', () => this.touchEnd());
    }

    touchStart(e) {
        this.isDragging = true;
        this.touchStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.startTranslate = this.currentTranslate;
        
        this.track.style.transition = 'none';
    }

    touchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diff = currentPosition - this.touchStartX;
        
        const dragPercentage = (diff / this.track.offsetWidth) * 100;
        this.currentTranslate = this.startTranslate + dragPercentage;
        
        const maxTranslate = 0;
        const minTranslate = -((this.totalSlides - 1) * (100 / this.slidesPerView));
        this.currentTranslate = Math.max(Math.min(this.currentTranslate, maxTranslate), minTranslate);
        
        this.track.style.transform = `translateX(${this.currentTranslate}%)`;
    }

    touchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.transition = 'transform 0.3s ease-out';
        
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
document.addEventListener('DOMContentLoaded', () => {
    new ProjectCarousel();
});