const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
let slidesToShow = 1;

// Determine slides to show based on viewport
function updateSlidesToShow() {
  if (window.innerWidth >= 1024) {
    slidesToShow = 3;
  } else if (window.innerWidth >= 768) {
    slidesToShow = 2;
  } else {
    slidesToShow = 1;
  }
}

function updateCarousel() {
  const slideWidth = 100 / slidesToShow;
  track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % (slides.length - slidesToShow + 1);
  updateCarousel();
});

prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + (slides.length - slidesToShow + 1)) % (slides.length - slidesToShow + 1);
  updateCarousel();
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateCarousel();
  });
});

// Update on resize
window.addEventListener('resize', () => {
  updateSlidesToShow();
  updateCarousel();
});

// Initial setup
updateSlidesToShow();
updateCarousel();