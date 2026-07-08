/*
 * Local persistence. Answers and plans stay on the user's device — no cookies,
 * no server. That is a product decision, not an accident: see /privacy.html.
 * (Anonymous, identifier-free usage counts live separately in stats.js.)
 */

'use strict';

const STORE_KEY = 'baseline.v1';

const Store = {
  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() }));
      return true;
    } catch (e) {
      return false;
    }
  },
  clear() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* noop */ }
  },
};

if (typeof module !== 'undefined') module.exports = { Store, STORE_KEY };
