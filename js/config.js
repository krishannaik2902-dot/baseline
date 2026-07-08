/*
 * Site configuration. This is the only file you should need to touch
 * to take payments live or change pricing copy.
 */

'use strict';

const CONFIG = {
  brand: 'Baseline',                 // display name; also used in <title>s
  canonicalOrigin: 'https://knowyourbaseline.surge.sh',

  // --- Pro tier -----------------------------------------------------------
  // Until a payment link is set, the Pro CTA runs in founding-member waitlist
  // mode (email capture, discount promised at launch). To take payments:
  //   1. Create a Stripe Payment Link (Stripe dashboard -> Payment Links)
  //      for a recurring price. No code needed on their side.
  //   2. Paste the URL below. Buy buttons go live immediately.
  stripePaymentLink: '',
  proPriceOneTime: '$29',
  proPriceNote: 'One payment. Not a subscription. 14-day refund, no questions.',
  foundingDiscountCopy: 'Founding members get Pro for $17 instead of $29 when it opens — and that price includes all future updates.',

  // --- Waitlist / contact ---------------------------------------------------
  // FormSubmit AJAX endpoint (set after activation at deploy time).
  // Falls back to a mailto: link when empty, so the CTA never dead-ends.
  formEndpoint: '',
  contactEmail: 'product@louisa.ai',

  // --- Anonymous usage counting (js/stats.js) -------------------------------
  // GoatCounter: no cookies, no identifiers, aggregate counts only.
  // The complete list of events sent is documented in privacy.html.
  // Set to '' to disable all counting site-wide.
  statsEndpoint: 'https://knowyourbaseline.goatcounter.com/count',
};

if (typeof module !== 'undefined') module.exports = { CONFIG };
