/* Blog index: category filter pills. */
(function () {
  'use strict';
  var pills = document.querySelectorAll('.blog-categories .pill');
  var cards = document.querySelectorAll('.blog-page .card[data-category]');
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      var cat = pill.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      cards.forEach(function (card) {
        var c = (card.getAttribute('data-category') || '').toLowerCase();
        card.style.display = (cat === 'all' || c.indexOf(cat) !== -1) ? '' : 'none';
      });
    });
  });
})();
