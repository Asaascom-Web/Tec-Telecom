// JavaScript for Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-button.next');
  const prevButton = document.querySelector('.carousel-button.prev');
  const dotsNav = document.querySelector('.carousel-dots');
  const slideWidth = slides[0].getBoundingClientRect().width;
  const slideMargin = 32; // 2rem margin-right
  
  // Arrange slides next to each other
  const setSlidePosition = (slide, index) => {
      slide.style.left = (slideWidth + slideMargin) * index + 'px';
  };
  slides.forEach(setSlidePosition);

  // Create navigation dots
  const createDots = () => {
      slides.forEach((_, index) => {
          const button = document.createElement('button');
          button.classList.add('dot');
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-label', `Slide ${index + 1}`);
          if (index === 0) {
              button.classList.add('active');
              button.setAttribute('aria-selected', 'true');
          } else {
              button.setAttribute('aria-selected', 'false');
          }
          dotsNav.appendChild(button);
      });
  };
  createDots();

  const dots = Array.from(dotsNav.children);

  // Move slide function
  const moveToSlide = (currentSlide, targetSlide) => {
      const targetIndex = slides.findIndex(slide => slide === targetSlide);
      const amountToMove = targetIndex * -(slideWidth + slideMargin);
      
      track.style.transform = `translateX(${amountToMove}px)`;
      currentSlide.classList.remove('current-slide');
      targetSlide.classList.add('current-slide');
  };

  // Update dots
  const updateDots = (currentDot, targetDot) => {
      currentDot.classList.remove('active');
      currentDot.setAttribute('aria-selected', 'false');
      targetDot.classList.add('active');
      targetDot.setAttribute('aria-selected', 'true');
  };

  // Update arrows
  const updateArrows = (targetIndex) => {
      prevButton.disabled = targetIndex === 0;
      nextButton.disabled = targetIndex === slides.length - 1;
  };

  // Handle next button click
  nextButton.addEventListener('click', () => {
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      const nextSlide = currentSlide.nextElementSibling;
      const currentDot = dotsNav.querySelector('.active');
      const nextDot = currentDot.nextElementSibling;
      const nextIndex = slides.findIndex(slide => slide === nextSlide);

      if (nextSlide) {
          moveToSlide(currentSlide, nextSlide);
          updateDots(currentDot, nextDot);
          updateArrows(nextIndex);
      }
  });

  // Handle previous button click
  prevButton.addEventListener('click', () => {
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      const prevSlide = currentSlide.previousElementSibling;
      const currentDot = dotsNav.querySelector('.active');
      const prevDot = currentDot.previousElementSibling;
      const prevIndex = slides.findIndex(slide => slide === prevSlide);

      if (prevSlide) {
          moveToSlide(currentSlide, prevSlide);
          updateDots(currentDot, prevDot);
          updateArrows(prevIndex);
      }
  });

  // Handle dot clicks
  dotsNav.addEventListener('click', e => {
      const targetDot = e.target.closest('button');
      if (!targetDot) return;

      const currentSlide = track.querySelector('.current-slide') || slides[0];
      const currentDot = dotsNav.querySelector('.active');
      const targetIndex = dots.findIndex(dot => dot === targetDot);
      const targetSlide = slides[targetIndex];

      moveToSlide(currentSlide, targetSlide);
      updateDots(currentDot, targetDot);
      updateArrows(targetIndex);
  });

  // Initialize first slide
  slides[0].classList.add('current-slide');
  updateArrows(0);

  // Add touch support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
  });

  track.addEventListener('touchmove', e => {
      touchEndX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', () => {
      const difference = touchStartX - touchEndX;
      if (Math.abs(difference) > 50) {
          if (difference > 0) {
              nextButton.click();
          } else {
              prevButton.click();
          }
      }
  });
});