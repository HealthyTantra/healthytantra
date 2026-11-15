/* Shared behaviour for every page. No inline scripts anywhere: this keeps the Content Security Policy strict. */
(function () {
  'use strict';

  // 1. Send "Download / Install / Consult" links to the right store for the visitor's device
  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/.test(ua);
  document.querySelectorAll('.app-smart-link').forEach(function (link) {
    var ios = link.getAttribute('data-ios-href');
    var android = link.getAttribute('data-android-href');
    if (isIOS && ios) link.setAttribute('href', ios);
    else if (isAndroid && android) link.setAttribute('href', android);
  });

  // 2. Highlight the current page in the menu
  var here = location.pathname.replace(/\/+$/, '') || '/';
  var section = [
    ['/blog', '/blog'],
    ['/consult', '/online-doctor-consultation'],
    ['/doctor', '/online-doctor-consultation']
  ];
  var active = here;
  section.forEach(function (s) { if (here === s[0] || here.indexOf(s[0] + '/') === 0) active = s[1]; });
  document.querySelectorAll('.header nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (href === active) a.classList.add('active');
  });

  // 3. Mobile menu
  var header = document.querySelector('.header');
  var btn = document.querySelector('.mobile-menu-toggle');
  if (header && btn) {
    var setOpen = function (open) {
      header.classList.toggle('mobile-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      btn.textContent = open ? '\u2715' : '\u2630';
    };
    btn.addEventListener('click', function () { setOpen(!header.classList.contains('mobile-open')); });
    header.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }
})();
