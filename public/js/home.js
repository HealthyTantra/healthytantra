/* Home page only: hero slider and the category scroller. */
(function () {
  'use strict';
  var slides = document.querySelectorAll('.hero-slider .slide');
  var dots = document.querySelectorAll('.slider-dots .dot');
  var current = 0;

  function show(i) {
    if (!slides.length) return;
    slides.forEach(function (s) { s.classList.remove('active'); });
    dots.forEach(function (d) { d.classList.remove('active'); });
    slides[i].classList.add('active');
    if (dots[i]) dots[i].classList.add('active');
  }
  if (slides.length > 1) {
    var timer = setInterval(function () { current = (current + 1) % slides.length; show(current); }, 5000);
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { current = i; show(i); clearInterval(timer); });
    });
  }

  var scroller = document.getElementById('categoryScroll');
  var next = document.querySelector('.next-btn');
  var prev = document.querySelector('.prev-btn');
  if (scroller && next) next.addEventListener('click', function () { scroller.scrollBy({ left: 320, behavior: 'smooth' }); });
  if (scroller && prev) prev.addEventListener('click', function () { scroller.scrollBy({ left: -320, behavior: 'smooth' }); });
})();
