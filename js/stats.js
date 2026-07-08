/*
 * Anonymous usage counting. The complete list of what this file sends is
 * documented in /privacy.html — keep the two in sync or delete this file.
 *
 * Principles, enforced in code:
 * - No cookies, no localStorage identifiers, no fingerprinting, no user IDs.
 *   Every request is identical for every visitor; uniqueness is never tracked
 *   client-side.
 * - Assessment ANSWERS never leave the device. Only coarse events do
 *   (e.g. "assessment-completed", "score-band-40s") — never raw scores,
 *   never answer values.
 * - Respects Do Not Track and Global Privacy Control, and a manual opt-out
 *   (the one localStorage key this file touches is the visitor's own
 *   opt-out preference).
 * - No third-party script is loaded; this is the whole client.
 */

'use strict';

(function () {
  const OPTOUT_KEY = 'baseline.stats.optout';

  function optedOut() {
    try {
      if (localStorage.getItem(OPTOUT_KEY)) return true;
    } catch (e) { /* storage unavailable -> treat as opted out, fail private */ return true; }
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return true;
    if (navigator.globalPrivacyControl) return true;
    return false;
  }

  function endpoint() {
    return (typeof CONFIG !== 'undefined' && CONFIG.statsEndpoint) ? CONFIG.statsEndpoint : '';
  }

  function send(params) {
    const base = endpoint();
    if (!base || optedOut()) return;
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return; // don't count development
    const q = new URLSearchParams(params);
    q.set('rnd', String(Date.now()));
    // a plain GET image request: no cookies attached (cross-origin, none exist), no response read
    const img = new Image();
    img.src = base + '?' + q.toString();
  }

  // one pageview per page load
  function pageview() {
    send({ p: location.pathname, r: document.referrer || '' });
  }

  // named coarse events; see privacy.html for the complete list
  function event(name) {
    send({ p: name, e: 'true' });
  }

  window.Stats = {
    event,
    optedOut,
    optOut() { try { localStorage.setItem(OPTOUT_KEY, '1'); } catch (e) {} },
    optIn() { try { localStorage.removeItem(OPTOUT_KEY); } catch (e) {} },
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') pageview();
  else document.addEventListener('DOMContentLoaded', pageview);
})();
