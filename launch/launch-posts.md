# Baseline — ready-to-post launch copy

Replace `{URL}` with https://knowyourbaseline.surge.sh everywhere.
Each channel's copy is deliberately different. Do not cross-post identical text.

---

## 1. Show HN

**Title** (boring and neutral on purpose — HN buries anything that sounds like marketing):

```
Show HN: A rule-based longevity self-assessment (no wearables, no signup)
```

**First comment** (post this yourself, immediately after submitting):

```
I got tired of longevity advice being either a $2M/year regimen or a
supplement funnel, so I built the boring middle: a 29-question self-assessment
that scores eight domains (sleep, movement, nutrition, stress, connection,
substances, body basics, daily structure) and generates a plan from the
well-evidenced basics.

It's deliberately not "AI". It's a deterministic rules engine — the same
answers always produce the same plan. Every recommendation shows the rule that
fired, an honest evidence grade (strong / moderate / emerging), and a named
primary source (Walker on sleep, Attia's Outlive and Galpin on training,
Laukkanen's sauna cohorts, Holt-Lunstad's social-connection meta-analyses). The
scoring weights and the whole question bank are in the repo — I'd genuinely like
people to tear the weights apart.

Two design decisions I think are the interesting part:

1. Everything runs client-side. Your answers live in localStorage and never hit
a server — there's nothing for me to store, sell, or leak, and no cookie banner
because there are no cookies. That also happens to sidestep most of the
health-data compliance surface.

2. It refuses to output a "biological age" number. The scientists who build
epigenetic clocks say they don't validate single-person interventions, so a fake
age would make me the thing I'm reacting against. It scores current habits
instead, because that's what you can actually change.

It's free, no account, nothing for sale inside the results. Happy to talk about
the engine design, the evidence grading, or where you think the weights are
wrong. Source: https://github.com/krishannaik2902-dot/baseline
```

**Rules reminder:** post Tue–Thu 9am–12pm ET. Do NOT ask anyone to upvote
(vote-ring detection). Stay in the thread 6+ hours; reply to substantive
comments within the first hour.

---

## 2. Product Hunt

**Name:** Baseline

**Tagline** (60 char max, NO "AI" — helps Featured curation):

```
Know where you stand — a free, private longevity self-check
```

**Description:**

```
Baseline is a 29-question self-assessment that scores the eight things that
actually move healthspan and builds you a plan from the boring, well-evidenced
basics — sleep, movement, food, stress, connection.

What's different:
• Free, no account, and your answers never leave your device (localStorage only).
• Every recommendation shows its evidence grade and a named source. No secret sauce.
• A deterministic rules engine, not a chatbot — same answers, same plan.
• It refuses to sell you supplements or guess your "biological age".
• Includes a running page of popular trends we DON'T recommend, and why.

Pro (one payment, not a subscription) adds the full protocol library, a 12-week
progression, and self-test benchmarks. The free plan is a genuinely complete
plan.
```

**First maker comment:**

```
Hi PH. I built this because the longevity space forces a choice between a
$2M/year regimen and a supplement funnel, and the honest middle — do the free
basics, consistently — wasn't anywhere. So Baseline is the free basics,
personalised to your answers, with every source shown and nothing for sale in
the results. The whole scoring engine is open source. I'd love feedback on the
question set and where you think the domain weights are wrong.
```

**Rules reminder:** launch 12:01 AM PT. Reply to every comment as maker.

---

## 3. Reddit — r/InternetIsBeautiful (best fit)

**Title:**

```
I built a free longevity self-assessment that runs entirely in your browser — no signup, no tracking, and it shows the source behind every recommendation
```

**Body:**

```
It's 29 questions about sleep, movement, food, stress, and habits. It scores
eight domains and builds a plan from well-evidenced basics — with an honest
evidence grade and a named source (Walker, Attia, Laukkanen, Holt-Lunstad) on
every recommendation.

Two things I'm a bit proud of:
- It's client-side only. Your answers stay in your browser; there's no server,
no account, no cookies. Clear your data and it's gone.
- It refuses to give you a fake "biological age" number, and it keeps a running
page of popular trends it does NOT recommend (CGMs for healthy people, hydrogen
water, $6k cold plunges) with the reasoning.

Free, nothing for sale in the results. Would love to hear where the questions or
the scoring feel off. {URL}
```

**Rules reminder:** r/InternetIsBeautiful likes free no-signup tools; this fits.
Still, read the current sidebar first and disclose it's yours.

---

## 4. Reddit — r/QuantifiedSelf (share the methodology, not the pitch)

**Title:**

```
I built a rules engine that scores 8 health domains from a questionnaire — here's how it weights them, poke holes in it
```

**Body:**

```
I wanted a way to turn a self-report questionnaire into a prioritised plan
without a wearable or bloodwork, so I built a deterministic scoring model. Eight
domains, each weighted by how strongly the literature ties it to healthspan:
sleep and movement at 20 each, nutrition and stress at 15, connection and
substances at 10, body basics and daily structure at 5. Within each domain,
individual questions carry their own weights.

The part I'd love this sub's take on: the plan ranks recommendations by (how
weak your domain is) × (how much that domain matters) × (how foundational the
habit is), so five small high-yield changes surface first instead of a 40-item
overhaul. Evidence grade is shown on every card and applied honestly (creatine =
strong, sauna = moderate, journaling = emerging).

It's all client-side and open source, so you can read the exact weights and
trigger rules: [repo]. My own result and the full methodology write-up are
linked. Where would you weight differently? {URL}
```

**Rules reminder:** share your OWN data + methodology, stick around to discuss.
Blatant ad-style posts get removed even here.

---

## 5. Reddit — r/Biohackers (ONLY after mod approval)

**Message to mods first:**

```
Hi mods — I've built a free, no-signup, no-supplement-sales longevity
self-assessment (open-source rules engine, client-side only, sources shown on
every recommendation). I know promotion needs approval here. Would a single
value-first post be OK, and is there a format you'd prefer? Happy to follow
whatever rules you set.
```

Do not post to this sub without a yes.

---

## 6. X / Twitter thread (build-in-public; audience is founders, not consumers)

```
1/ I spent the last stretch building the anti-wearable health assessment.

No ring. No bloodwork. No subscription. No "your biological age is 34!"

29 questions → a scored baseline → a plan built from the boring basics that
actually have evidence. Free, and your answers never leave your device.

{URL}

2/ The wedge: longevity content is either a $2M/year regimen (Bryan Johnson) or
a supplement funnel. But Johnson himself says ~80% of the results come from free
habits. So I built the 80%, personalised, with the sources shown.

3/ It's not AI. It's a deterministic rules engine — same answers, same plan.
Every recommendation shows the rule that fired, an evidence grade, and a named
source. The whole thing is open source. I want people to argue with the weights.

4/ The privacy design is the part I'm most happy with. Everything runs in your
browser. localStorage only. No server, no account, no cookies, no analytics.
There's nothing for me to sell or leak. It's a feature, and it's also most of
the compliance surface, gone.

5/ It refuses to output a "biological age". The scientists who build those
clocks say they can't validate one person's intervention. So it scores current
habits — the thing you can change — instead of guessing a number to make you
feel good.

6/ There's a "what we're skeptical of" page: CGMs for healthy people, NMN,
hydrogen water, $6k cold plunges. A plan you can trust has to be willing to say
"the data isn't there yet." I sell none of the alternatives either.

7/ Free tier is a real plan, not a teaser. Pro is one payment ($29), not a
subscription, because you have enough subscriptions.

Take it, then tell me what's wrong with it: {URL}
```

---

## 7. TikTok / IG scripts (3, ~30–40s each)

### Script A — "the viral jump test is fake"
```
HOOK (on screen, first 2s): "That viral jump test can't tell your real age."

You've seen it — jump from your knees to your feet, and if you can, your
"biological age" is under 30. It's fun. It's also not measuring your age.

Here's what actually tracks how you're ageing, and none of it needs a lab:
- Grip strength. In a 140,000-person study, every 5kg drop was linked to 16%
higher mortality — a bigger signal than blood pressure.
- How fit you are. The least-fit group in a 122,000-person study had five times
the risk of the fittest.
- A dead hang. Two minutes is a solid functional target.

The difference: you can train these, and when the number moves, it's because you
changed something real. I put the honest version in a free assessment — link in
bio, no signup.
```

### Script B — "the free 80%"
```
HOOK: "Bryan Johnson spends $2 million a year to not age. He says 80% of it is
free."

And he's right. Strip away the pills and the MRIs, and what's left is: a
consistent sleep schedule, a cool dark room, morning light, lifting something
heavy twice a week, and real food.

That's the part with the strongest evidence. The $2M buys the last 20%, at a
brutal price curve.

I built a free assessment around the free 80% — scores your habits, shows you
the sources. No signup, nothing to buy. Link in bio.
```

### Script C — "the honest health quiz"
```
HOOK: "I made a health quiz that refuses to sell you anything."

No supplements. No affiliate links. No 'your biological age is 34.' It won't
even keep your answers — everything stays on your phone.

29 questions, four minutes, and you get a real plan: what to fix first, why, and
the actual study behind it. It even has a page of popular stuff it tells you NOT
to bother with.

Free. Link in bio. Tell me your score.
```

**Rules reminder:** 2026 TikTok wants ~70% completion, so keep them tight and
front-load the hook. Shares and saves matter more than likes. Post 3–5×/week;
expect 20–40 posts before signal.

---

## 8. The "how did you hear about us?" question
Add this to the waitlist form as a second, optional field before launch. It's
the only zero-cost attribution you'll get, and it tells you which of the above
channels to double down on. One-line change in `js/pro.js`.
