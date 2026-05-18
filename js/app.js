// Select slides and dots
const slides = document.querySelectorAll(".hero-slider .slide");
const dots = document.querySelectorAll(".slider-dots .dot");

let current = 0;

// Show specific slide
function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

// Auto next slide
function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

// Auto play (5 seconds)
setInterval(nextSlide, 5000);

// Optional: Click on dots
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    current = i;
    showSlide(current);
  });
});