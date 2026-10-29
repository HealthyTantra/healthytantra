(function () {
    if (!window.matchMedia('(min-width: 769px)').matches) return;
  var KEY = 'ht_banner_hidden_until';
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

 var text =
  'Consult Doctor Now' +
  '<span class="htb-gap"></span>' +
  'Book Appointments' +
  '<span class="htb-gap"></span>' +
  'Orders Medicines || Wellness products on Healthy Tantra app.' +
  '<span class="htb-gap"></span>' +
  'Download Healthy Tantra app';

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