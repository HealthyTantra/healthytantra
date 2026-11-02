
(function () {
  'use strict';

  // Desktop announcement banner only
  if (!window.matchMedia('(min-width: 769px)').matches) return;

  var IOS = 'https://apps.apple.com/in/app/healthy-tantra/id6799877739';
  var AND = 'https://play.google.com/store/apps/details?id=com.healthytantra.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dbanner';

  // Diwali 2026 campaign: ends at midnight IST on 11 November
  var festive = Date.now() < new Date('2026-11-11T00:00:00+05:30').getTime();

  var KEY = festive
    ? 'ht_banner_hidden_diwali26'
    : 'ht_banner_hidden_until';

  try {
    if (Number(localStorage.getItem(KEY)) > Date.now()) return;
  } catch (e) {}

  var root = document.documentElement;

  var ua = navigator.userAgent || '';

  var isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  var isAndroid = /Android/i.test(ua);

  function btn(href, label) {
    return '<a class="htb-btn" href="' + href +
      '" target="_blank" rel="noopener noreferrer">' +
      label + '</a>';
  }

  var buttons = isIOS
    ? btn(IOS, 'Download on App Store')
    : isAndroid
      ? btn(AND, 'Get it on Google Play')
      : btn(IOS, 'App Store') + btn(AND, 'Google Play');

  var gap = '<span class="htb-gap"></span>';

  var message = festive
    ? '🪔 Happy Diwali, Healthy Diwali! Wishing you a season of health and happiness.'
    : 'Discover Many Ways to Heal with Healthy Tantra.';

  var announcements = [
    message,
    'Consult Doctors Online',
    'Book Appointments',
    'Order Medicines &amp; Wellness Products',
    'Pay Only for the Minutes You Consult'
  ];

  var text = announcements.join(gap) + gap;

  function build() {
    if (document.getElementById('ht-banner')) return;

    var bar = document.createElement('div');

    bar.id = 'ht-banner';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Healthy Tantra app announcement');

    bar.innerHTML =
      '<div class="htb-track">' +
        '<span class="htb-move">' + text + text + '</span>' +
      '</div>' +
      buttons +
      '<button class="htb-x" type="button" aria-label="Close banner">&times;</button>';

    document.body.insertBefore(bar, document.body.firstChild);

    // Reserve space only after the banner has been inserted
    root.classList.add('ht-banner-on');

    bar.querySelector('.htb-x').addEventListener('click', function () {
      bar.remove();
      root.classList.remove('ht-banner-on');

      try {
        localStorage.setItem(KEY, Date.now() + 7 * 864e5);
      } catch (e) {}
    });
  }

  if (document.body) {
    build();
  } else {
    document.addEventListener('DOMContentLoaded', build);
  }
})();
