# Baseline (working name)

A consumer longevity self-assessment site. A visitor answers ~29 questions about
sleep, movement, nutrition, stress, connection and habits; a deterministic
client-side engine scores eight domains, raises safety flags, and builds a
personalised plan from a bank of protocol cards attributed to their sources
(Huberman Lab, Peter Attia's *Outlive*, Bryan Johnson's Blueprint, Rhonda
Patrick, and the underlying research).

**Architecture: static, no build step, no server, no database.**
All answers live in the visitor's `localStorage` and never leave their device.
That is the product's privacy story and its compliance posture in one decision:
no cookies → no cookie banner; no accounts → no breach surface; no tracking →
nothing to disclose beyond the waitlist form.

## Files

- `js/engine.js` — pure scoring/plan logic (works in browser + node). Tested.
- `js/questions.js` — assessment question bank (JSON-pure, validated).
- `js/protocols.js` — protocol card bank (JSON-pure, validated).
- `js/assess.js`, `js/plan.js` — assessment flow and plan renderer.
- `js/pro.js`, `js/config.js` — freemium CTA. See "Taking payments live".
- `tests/engine.test.js` — run `node tests/engine.test.js`. Deploy script runs it.
- `scripts/deploy.sh` — tests → git push (GitHub Pages) → surge.

## Taking payments live

Pro runs in founding-member waitlist mode until you:
1. Create a Stripe account → Payment Links → recurring price.
2. Paste the link into `stripePaymentLink` in `js/config.js`.
3. `scripts/deploy.sh "payments live"`.

## Editing content

Questions and protocol cards are data, not code. Add/edit entries in
`js/questions.js` / `js/protocols.js`; the test suite validates ids, domains,
flags, evidence labels and trigger references, and fails loudly on mistakes.
