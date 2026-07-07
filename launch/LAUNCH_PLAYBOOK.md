# Baseline — launch playbook

Live: **https://knowyourbaseline.surge.sh** (canonical) · mirror: https://krishannaik2902-dot.github.io/baseline/
Repo: https://github.com/krishannaik2902-dot/baseline

Everything below is grounded in the July 2026 channel research. The honest
one-liner: **the only compounding growth engine a quiz product has is the
share rate of the results card.** Every channel here is a spark; sharing is the
fire. So the single most important number to watch is what fraction of people
who finish the assessment tap "Share my score."

---

## The one thing that has to be true

The exact product shape already has a proven viral precedent: **Death Clock**
(deathclock.co) turned a 29-question longevity quiz into 1M+ users across 100+
countries with press from Bloomberg to Colbert. TikTok spent late 2025 obsessed
with "biological age test" formats. We are the honest, evidence-graded version
of that — and we deliberately *refuse* the fake bio-age number, which is our
credibility wedge, not a growth handicap. The share card carries a score, not a
death date, and the journal piece on why the viral tests are theatre is the
content that rides the same wave without lying.

## Realistic expectations (set them now, avoid disappointment later)

| Channel | Realistic first-launch yield | Notes |
|---|---|---|
| Direct network outreach | First 50–100 users | The reliable one. Do this first. |
| Show HN (if it lands) | 5k–30k visits | If it flops: 200–2k. Framing decides. |
| Show HN (typical) | 200–2,000 visits | Still worth it for the backlink + feedback. |
| Product Hunt | 30–150 signups | A credibility/backlink event, **not** a growth event. |
| Each tolerated Reddit post | 50–500 visits | r/InternetIsBeautiful is the best fit. |
| TikTok | Lottery ticket | Expect 20–40 posts before any signal. |

**Do not budget on SEO.** Health queries have ~88% AI-Overview coverage; a new
YMYL site won't rank for medical head terms for 6–12+ months. The calculators
and comparison pages are a compounding *side* bet, not a launch channel.

---

## Week-by-week sequence

### Week 0 — pre-flight (before telling anyone)
- [ ] Confirm the site is live on both hosts and the assessment→plan flow works on a phone.
- [ ] **Add a "How did you hear about us?" line** to the waitlist form — it's the only zero-cost attribution you'll get. (One-line change in `js/pro.js`.)
- [ ] Decide: are you launching under a real name/face? For a health product, a named human with a visible bio materially lifts trust. Consider adding a short "who's behind this" note on the methodology page with your real name.
- [ ] **Get a lawyer to review the three legal pages once.** This is cheap (the copy is a finite, bounded set) and the one genuinely important to-do before scale. The disclaimer/terms/privacy are solid drafts, not a substitute for sign-off.

### Week 1 — your own network (target: first 50–100 users)
The Lenny's-Newsletter finding: almost every big consumer app used ONE primary
channel to start, and the fastest zero-budget path is a direct, specific ask to
your own network.
- [ ] Message 20–30 people directly (not a broadcast). The ask: *"I built a free health self-assessment — no signup, nothing to buy. Could you take the 4-minute version and tell me one thing that felt off? Takes 5 minutes."*
- [ ] Post once to any niche Discords/Slacks you're actually a member of, with the same feedback ask, not a pitch.
- [ ] Watch three real people take it (in person or screen-share). You will find at least one confusing question. Fix it.

### Week 2 — Show HN (the big earnest swing)
- [ ] Post **Tuesday–Thursday, 9am–12pm ET**. Title is in `launch-posts.md` — boring and neutral, no "AI", no exclamation.
- [ ] Immediately add ONE calm context comment (also in `launch-posts.md`) explaining the rules engine, the sources, and what you're unsure about.
- [ ] **Stay in the thread for 6+ hours.** Reply to every substantive comment within the first 60 minutes especially. HN's algorithm now weights maker replies.
- [ ] Do **not** ask anyone to upvote. Vote-ring detection will bury you and it's against the rules.

### Week 3 — Reddit maker posts (permission-first)
- [ ] **r/InternetIsBeautiful** — best fit: a genuinely free, no-signup tool. Post the version in `launch-posts.md`.
- [ ] **r/QuantifiedSelf** — share the *methodology and your own result*, framed as "I built a scoring model, here's how it weights the domains — tear it apart."
- [ ] **r/SideProject** and **r/InternetIsBeautiful** are maker-tolerant. 
- [ ] **r/Biohackers** — message the mods for approval BEFORE posting anything. Promotion without approval = account + domain ban.
- [ ] **Do NOT post to r/longevity or r/Supplements.** Both ban commercial promotion on sight and will ban the domain. Use them read-only to mine the language people actually use.
- [ ] **Re-verify every subreddit's current sidebar rules in the Reddit app before posting.** Reddit blocks automated retrieval, so the rules above are as of early 2026 and may have changed.
- [ ] Respect the 90/10 rule (≤10% of your Reddit activity self-promotional) and the 3:1 helpful-comments-to-posts ratio. Be a real member first.

### Week 4–5 — Product Hunt (credibility, not growth)
- [ ] Launch **12:01 AM PT**. Weekday if you can rally 100+ *genuine* supporters; weekend if not (fewer upvotes needed, less traffic).
- [ ] **Non-AI tagline** — founders repeatedly report this helps with the editorial team's Featured curation, and only ~10% of launches get Featured (which drives ~70% of PH success).
- [ ] Reply to every comment as the maker. The algorithm weights this over raw upvotes.
- [ ] Treat the result as a DR-91 backlink and 30–150 signups, and be pleased with that.

### Ongoing from Week 3 — TikTok / IG (3–5×/week)
- [ ] Ride the "the viral jump test is fake — here's what actually predicts your health" format. Scripts in `launch-posts.md`.
- [ ] The 2026 bar: ~70% completion rate, shares/saves outweigh likes, consistency beats sporadic virality. Post 3–5×/week and expect 20–40 posts before signal.
- [ ] Every video ends on the same CTA: the free, no-signup assessment.

### Once the list is >500 — newsletters
- [ ] Join the **beehiiv Recommendations network** (~$49/mo Scale plan) for free reciprocal cross-promos with longevity newsletters (Join Longevity, Brain Health Kitchen-adjacent).
- [ ] The weekly plan-progress email doubles as retention *and* cross-promo inventory.

---

## PR angle (zero budget)
Steal the Death Clock playbook. Pitch consumer-health and tech journalists a
*demonstrable, slightly provocative free tool* ("what's your health baseline?"),
not a startup announcement. Answer HARO/journalist source requests as an expert.
The hook that got Death Clock on Colbert was "29 questions predict your death" —
ours is gentler and more defensible: "the honest health quiz that refuses to
guess your biological age."

## GEO — get cited by AI assistants (the sleeper channel)
AI-assistant referrals convert at ~7.1% (second only to paid search) and became
a real channel in 2026. Every page already leads with a direct answer in the
first ~120 words and has clean tool/product pages (ChatGPT cites product pages
~50× more than Perplexity). Add an `llms.txt` and keep the brand name
consistent. Target ChatGPT *and* Gemini — the share is fragmenting.

## What NOT to do
- Don't buy upvotes or astroturf. Reddit and HN both detect it; in this
  community it's a reputational death sentence, and mods now use AI to flag slop.
- Don't post the same copy everywhere. Each channel's version is tailored for a
  reason; identical cross-posts read as spam.
- Don't quantify lifespan in any marketing ("add 10 years"). Keep every claim at
  FDA "general wellness" level. The "not medical advice" disclaimer does **not**
  legally offset an express marketing claim.
- Don't use "AI" in the PH tagline or hero. It hurts curation and it's not even
  true — the engine is deterministic rules.
- Don't launch everything in one week. The sequence is deliberate: network →
  earnest maker communities → PH → ongoing social.

## The metric that matters
Instrument the **share rate of the results card** and the **assessment
completion rate**. Everything else is vanity. If 4-minute completion is above
~50% and share rate is climbing, you have a product that grows; if not, fix the
assessment before spending another hour on any channel above.
