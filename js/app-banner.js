(function () {
  if (!window.matchMedia('(min-width: 769px)').matches) return;

  // Festive message window: Diwali 2026 (8 Nov). Switches off automatically on 11 Nov, IST.
  var festive = new Date() < new Date('2026-11-11T00:00:00+05:30');
  var KEY = festive ? 'ht_banner_hidden_diwali26' : 'ht_banner_hidden_until';
  try { if (+localStorage.getItem(KEY) > Date.now()) return; } catch (e) {}

  // Reserve the space immediately so the header doesn't jump
  var root = document.documentElement;
  root.classList.add('ht-banner-on');

  var IOS = 'https://apps.apple.com/in/app/healthy-tantra/id6799877739';
  var AND = 'https://play.google.com/store/apps/details?id=com.healthytantra.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dbanner';

  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);

  var GAP = '<span class="htb-gap"></span>';
  var CRACKER = '\uD83C\uDF86'; // fireworks emoji
  var DIYA = '\uD83E\uDE94';    // diya lamp emoji

  var text =
    (festive
          ? DIYA + ' ' + CRACKER + ' Happy Diwali, Healthy Diwali ' + CRACKER + ' ' + DIYA + GAP
      : '') +
    'Consult Doctor Now' + GAP +
    'Book Appointments' + GAP +
    'Order Medicines &amp; Wellness Products on the Healthy Tantra app' + GAP +
    'Pay Only for the Minutes You Consult';
   (festive
          ? DIYA + ' Wishing You Very Very Happy Deepawali - Healthy Tantra! ' + CRACKER + ' ' + DIYA + GAP
      : '') +
  function btn(href, label) {
    return '<a class="htb-btn" href="' + href + '" rel="noopener">' + label + '</a>';
  }
  var buttons = isIOS ? btn(IOS, 'App Store')
    : isAndroid ? btn(AND, 'Google Play')
    : btn(IOS, 'App Store') + btn(AND, 'Google Play');

  function build() {
    var bar = document.createElement('div');
    bar.id = 'ht-banner';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Download the app');
    bar.innerHTML =
      '<div class="htb-track"><span class="htb-move">' + text + '</span></div>' +
      buttons +
      '<button class="htb-x" type="button" aria-label="Close banner">&times;</button>';
    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelector('.htb-x').onclick = function () {
      bar.remove();
      root.classList.remove('ht-banner-on');
      try { localStorage.setItem(KEY, Date.now() + 7 * 864e5); } catch (e) {}
    };
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();