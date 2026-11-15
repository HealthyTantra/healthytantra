/* Contact and seller forms. They post JSON to /api/... and only show success when the server confirms the email was sent. */
(function () {
  'use strict';
  document.querySelectorAll('form[data-api]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');

    function say(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status ' + (ok ? 'ok' : 'err');
      status.hidden = false;
    }
    function resetCaptcha() { if (window.turnstile) { try { window.turnstile.reset(); } catch (e) {} } }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
      var label = button ? button.textContent : '';
      if (button) { button.disabled = true; button.textContent = 'Sending...'; }
      if (status) status.hidden = true;

      fetch(form.getAttribute('data-api'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.status === 200 && res.body.ok) {
            form.reset();
            say(form.getAttribute('data-success') || 'Thank you. We have received your message and will get back to you soon.', true);
          } else {
            say((res.body && res.body.error) || 'Sorry, we could not send your message. Please email us directly.', false);
          }
          resetCaptcha();
        })
        .catch(function () { say('Network problem. Please try again, or email us directly.', false); resetCaptcha(); })
        .then(function () { if (button) { button.disabled = false; button.textContent = label; } });
    });
  });
})();
