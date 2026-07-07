/*
 * Site configuration. This is the only file you should need to touch
 * to take payments live or change pricing copy.
 */

'use strict';

const CONFIG = {
  brand: 'Baseline',                 // display name; also used in <title>s
  canonicalOrigin: '',               // set at deploy, e.g. 'https://example.surge.sh'

  // --- Pro tier -----------------------------------------------------------
  // Until a payment link is set, the Pro CTA runs in founding-member waitlist
  // mode (email capture, discount promised at launch). To take payments:
  //   1. Create a Stripe Payment Link (Stripe dashboard -> Payment Links)
  //      for a recurring price. No code needed on their side.
  //   2. Paste the URL below. Buy buttons go live immediately.
  stripePaymentLink: '',
  proPriceMonthly: '$7',
  proPriceNote: 'or $49/year',
  foundingDiscountCopy: 'Founding members get 40% off for life when Pro launches.',

  // --- Waitlist / contact ---------------------------------------------------
  // FormSubmit AJAX endpoint (set after activation at deploy time).
  // Falls back to a mailto: link when empty, so the CTA never dead-ends.
  formEndpoint: '',
  contactEmail: '',
};

if (typeof module !== 'undefined') module.exports = { CONFIG };
