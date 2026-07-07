/* Pro-tier CTA: waitlist mode until CONFIG.stripePaymentLink is set,
 * then live checkout. Never dead-ends: with no form endpoint configured
 * it falls back to a prefilled mailto. */

'use strict';

(function () {
  const JOINED_KEY = 'baseline.waitlist.v1';

  function joined() {
    try { return !!localStorage.getItem(JOINED_KEY); } catch (e) { return false; }
  }
  function markJoined(email) {
    try { localStorage.setItem(JOINED_KEY, JSON.stringify({ email, at: new Date().toISOString() })); } catch (e) {}
  }

  window.renderProCTA = function (el, context) {
    if (!el) return;

    // Live payments mode
    if (CONFIG.stripePaymentLink) {
      el.innerHTML = `
        <a class="btn btn-primary btn-big" href="${CONFIG.stripePaymentLink}" rel="noopener">
          Get Pro — ${CONFIG.proPriceOneTime}, one payment
        </a>
        <p class="cta-small">${CONFIG.proPriceNote}</p>`;
      return;
    }

    // Waitlist mode
    if (joined()) {
      el.innerHTML = `<p class="cta-joined">You’re on the founding list. We’ll email you once, when Pro opens — that’s it.</p>`;
      return;
    }

    el.innerHTML = `
      <form class="waitlist" id="waitlist-form-${context}">
        <p class="waitlist-pitch"><strong>Pro isn’t open yet.</strong> ${CONFIG.foundingDiscountCopy} One email when it opens, nothing else.</p>
        <div class="waitlist-row">
          <input type="email" required placeholder="you@example.com" aria-label="Email address">
          <button class="btn btn-primary" type="submit">Save my spot</button>
        </div>
        <p class="waitlist-status" aria-live="polite"></p>
      </form>`;

    const form = el.querySelector('form');
    const status = el.querySelector('.waitlist-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input').value.trim();
      if (!email) return;

      if (!CONFIG.formEndpoint) {
        // no backend configured — hand off to their mail client
        const to = CONFIG.contactEmail || 'hello@example.com';
        window.location.href = `mailto:${to}?subject=${encodeURIComponent('Founding list')}&body=${encodeURIComponent('Put me on the Pro founding list: ' + email)}`;
        markJoined(email);
        return;
      }

      status.textContent = 'Saving…';
      try {
        const res = await fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, _subject: 'Founding list signup', page: context }),
        });
        if (!res.ok) throw new Error('bad status ' + res.status);
        markJoined(email);
        status.textContent = 'Done. You’re on the list — one email at launch, no drip campaign, promise.';
        form.querySelector('.waitlist-row').style.display = 'none';
      } catch (err) {
        status.textContent = 'Hmm, that didn’t go through. Try again in a minute — or email ' + (CONFIG.contactEmail || 'us') + ' and we’ll add you by hand.';
      }
    });
  };
})();
