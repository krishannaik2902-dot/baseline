/*
 * Plan engine — pure, deterministic, no I/O.
 *
 * Everything here operates on two data banks defined in separate files:
 *   QUESTIONS  (js/questions.js)  — the assessment question bank
 *   PROTOCOLS  (js/protocols.js)  — the recommendation card bank
 *   DOMAINS    (below)            — scoring domains with evidence-based impact weights
 *
 * Data banks are JSON-pure (no functions) so they can be authored and
 * validated independently of this logic.
 *
 * Question shape:
 *   { id, domain, text, help?, type: 'choice'|'number'|'multi',
 *     options?: [{ value, label, score?, flags?: [flagId] }],   // choice/multi
 *     bands?:   [{ max, score }],                               // number: first band where value <= max wins
 *     min?, max?, unit?, placeholder?,                          // number inputs
 *     weight: 1..3,                                             // weight within its domain
 *     optional?: true }
 *
 * Protocol card shape:
 *   { id, domain, title, tldr, why, how: [step], evidence: 'strong'|'moderate'|'emerging',
 *     effort: 1..3, cost: 'free'|'low'|'medium', tier: 'free'|'pro',
 *     attribution: [{ who, what }], cautions?: [note], priority: 0..100,
 *     triggers?: { domain_below?: number,                 // include when domain score < n
 *                  answers?: [{ q, in: [value] }],        // OR: include when any listed answer matches
 *                  require_flags?: [flagId],              // only when flag present
 *                  exclude_flags?: [flagId] } }           // suppress when flag present
 *
 * Flags are raised by answer options and drive safety behaviour:
 *   see FLAG_BEHAVIOUR below.
 */

'use strict';

const DOMAINS = [
  { id: 'sleep',      label: 'Sleep',            weight: 20 },
  { id: 'movement',   label: 'Movement',         weight: 20 },
  { id: 'nutrition',  label: 'Nutrition',        weight: 15 },
  { id: 'mind',       label: 'Stress & Mind',    weight: 15 },
  { id: 'connection', label: 'People & Purpose', weight: 10 },
  { id: 'substances', label: 'Substances',       weight: 10 },
  { id: 'body',       label: 'Body Basics',      weight: 5  },
  { id: 'habits',     label: 'Daily Structure',  weight: 5  },
];

// How red flags alter the plan. suppress: card domains/kinds removed entirely.
// notice: a safety banner shown prominently on the plan.
const FLAG_BEHAVIOUR = {
  under18: {
    suppress_tags: ['supplement', 'fasting', 'heat', 'cold', 'calorie_restriction'],
    notice: 'This site is written for adults. Under 18, the honest advice is boring: sleep a lot, move a lot, eat real food, and talk to your GP (with a parent) about anything that worries you.',
  },
  pregnant: {
    suppress_tags: ['supplement', 'fasting', 'heat', 'cold'],
    notice: 'You told us you are pregnant or breastfeeding. We have removed supplement, fasting and heat/cold-exposure suggestions — please run any change past your midwife or doctor first.',
  },
  meds: {
    suppress_tags: ['supplement'],
    notice: 'Because you take regular medication, we have left supplements out of your plan. Even common ones interact with prescriptions — a pharmacist can check yours in five minutes, for free.',
  },
  heart_symptoms: {
    suppress_tags: ['vigorous_exercise'],
    notice: 'You mentioned chest pain, pressure or unusual breathlessness during activity. Please see a doctor before changing your exercise habits — this is one of the few things on this site we will not work around.',
  },
  eating_disorder_history: {
    suppress_tags: ['fasting', 'calorie_restriction', 'weight_focus'],
    notice: 'Given your history with disordered eating, this plan avoids fasting, calorie targets and weight-centric framing. If food rules start feeling compulsive again, please loop in a professional you trust.',
  },
  low_mood_severe: {
    suppress_tags: [],
    notice: 'Some of your answers suggest things have been genuinely heavy lately. The habits here can help at the margins, but they are not a substitute for real support. Talking to a GP or therapist is the strongest move on this page. If you are in crisis: 988 (US), 116 123 (UK/Samaritans), or findahelpline.com.',
  },
  severe_sleep: {
    suppress_tags: [],
    notice: 'Chronic very short sleep (or suspected sleep apnea — loud snoring, gasping, unrefreshing sleep) is worth raising with a doctor. The sleep protocols below still apply, but they cannot fix a medical sleep disorder.',
  },
};

/* ---------------------------------------------------------------- scoring */

function scoreQuestion(q, answer) {
  if (answer === undefined || answer === null || answer === '') return null;
  if (q.type === 'choice') {
    const opt = q.options.find(o => o.value === answer);
    return opt && typeof opt.score === 'number' ? opt.score : null;
  }
  if (q.type === 'multi') {
    // multi answers score as the mean of selected options that carry scores
    const vals = Array.isArray(answer) ? answer : [answer];
    const scores = vals
      .map(v => q.options.find(o => o.value === v))
      .filter(o => o && typeof o.score === 'number')
      .map(o => o.score);
    return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  }
  if (q.type === 'number') {
    const n = Number(answer);
    if (!isFinite(n)) return null;
    if (!q.bands) return null;
    for (const band of q.bands) {
      if (n <= band.max) return band.score;
    }
    return q.bands[q.bands.length - 1].score;
  }
  return null;
}

function scoreDomains(questions, answers) {
  const byDomain = {};
  for (const d of DOMAINS) byDomain[d.id] = { num: 0, den: 0 };
  for (const q of questions) {
    const s = scoreQuestion(q, answers[q.id]);
    if (s === null) continue;
    const w = q.weight || 1;
    byDomain[q.domain].num += s * w;
    byDomain[q.domain].den += w;
  }
  const scores = {};
  for (const d of DOMAINS) {
    const { num, den } = byDomain[d.id];
    scores[d.id] = den > 0 ? Math.round(num / den) : null; // null = unanswered domain
  }
  return scores;
}

function baselineScore(domainScores) {
  let num = 0, den = 0;
  for (const d of DOMAINS) {
    const s = domainScores[d.id];
    if (s === null || s === undefined) continue;
    num += s * d.weight;
    den += d.weight;
  }
  return den > 0 ? Math.round(num / den) : 0;
}

function collectFlags(questions, answers) {
  const flags = new Set();
  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === null) continue;
    const vals = Array.isArray(a) ? a : [a];
    for (const v of vals) {
      const opt = (q.options || []).find(o => o.value === v);
      if (opt && opt.flags) opt.flags.forEach(f => flags.add(f));
    }
  }
  return [...flags];
}

/* ------------------------------------------------------------- selection */

function cardTriggered(card, ctx) {
  const t = card.triggers || {};
  if (t.require_flags && !t.require_flags.some(f => ctx.flags.includes(f))) return false;
  if (t.exclude_flags && t.exclude_flags.some(f => ctx.flags.includes(f))) return false;

  // suppression by flag behaviour (tags)
  const suppressed = new Set();
  for (const f of ctx.flags) {
    const beh = FLAG_BEHAVIOUR[f];
    if (beh) beh.suppress_tags.forEach(tag => suppressed.add(tag));
  }
  if ((card.tags || []).some(tag => suppressed.has(tag))) return false;

  // domain / answer conditions: if none present, card is generally applicable
  const conds = [];
  if (typeof t.domain_below === 'number') {
    const s = ctx.scores[card.domain];
    conds.push(s !== null && s !== undefined && s < t.domain_below);
  }
  if (t.answers && t.answers.length) {
    conds.push(t.answers.some(cond => {
      const a = ctx.answers[cond.q];
      const vals = Array.isArray(a) ? a : [a];
      const wanted = cond.in.map(String); // numeric answers vs string trigger values
      return vals.some(v => wanted.includes(String(v)));
    }));
  }
  return conds.length === 0 || conds.some(Boolean);
}

// Priority of a domain to fix = how weak it is x how much it matters.
function domainPriorities(scores) {
  return DOMAINS
    .map(d => ({
      id: d.id,
      label: d.label,
      score: scores[d.id],
      gap: scores[d.id] === null ? 0 : (100 - scores[d.id]) * d.weight,
    }))
    .sort((a, b) => b.gap - a.gap);
}

function buildPlan(questions, protocols, answers) {
  const scores = scoreDomains(questions, answers);
  const flags = collectFlags(questions, answers);
  const overall = baselineScore(scores);
  const priorities = domainPriorities(scores);
  const ctx = { scores, flags, answers };

  const eligible = protocols
    .filter(c => cardTriggered(c, ctx))
    .map(c => {
      // effective priority: card priority boosted by how weak its domain is
      const dScore = scores[c.domain];
      const need = dScore === null ? 0.5 : (100 - dScore) / 100;
      const dWeight = (DOMAINS.find(d => d.id === c.domain) || { weight: 10 }).weight;
      return { ...c, _rank: (c.priority || 50) * (0.4 + 0.6 * need) * (dWeight / 10) };
    })
    .sort((a, b) => b._rank - a._rank);

  const safetyNotices = flags
    .filter(f => FLAG_BEHAVIOUR[f] && FLAG_BEHAVIOUR[f].notice)
    .map(f => FLAG_BEHAVIOUR[f].notice);

  const free = eligible.filter(c => c.tier === 'free');
  const pro = eligible.filter(c => c.tier === 'pro');

  // Week-1 starter: the highest-rank low-effort cards, max 1 per domain, max 5.
  const week1 = [];
  const seen = new Set();
  for (const c of eligible) {
    if (c.effort > 2 || seen.has(c.domain)) continue;
    week1.push(c);
    seen.add(c.domain);
    if (week1.length >= 5) break;
  }

  return { overall, scores, flags, priorities, free, pro, week1, safetyNotices };
}

/* ------------------------------------------------------------ validation */

// Run against the data banks in tests so bad generated content fails loudly.
function validateData(questions, protocols) {
  const errors = [];
  const domainIds = new Set(DOMAINS.map(d => d.id));
  const qIds = new Set();
  for (const q of questions) {
    if (!q.id || qIds.has(q.id)) errors.push(`question bad/duplicate id: ${q.id}`);
    qIds.add(q.id);
    if (!domainIds.has(q.domain)) errors.push(`question ${q.id}: unknown domain ${q.domain}`);
    if (!['choice', 'number', 'multi'].includes(q.type)) errors.push(`question ${q.id}: bad type`);
    if ((q.type === 'choice' || q.type === 'multi') && (!q.options || q.options.length < 2))
      errors.push(`question ${q.id}: needs options`);
    if (q.type === 'number' && (!q.bands || !q.bands.length))
      errors.push(`question ${q.id}: number needs bands`);
    for (const o of q.options || []) {
      if (typeof o.score === 'number' && (o.score < 0 || o.score > 100))
        errors.push(`question ${q.id}/${o.value}: score out of range`);
      for (const f of o.flags || [])
        if (!FLAG_BEHAVIOUR[f]) errors.push(`question ${q.id}/${o.value}: unknown flag ${f}`);
    }
  }
  const cIds = new Set();
  for (const c of protocols) {
    if (!c.id || cIds.has(c.id)) errors.push(`card bad/duplicate id: ${c.id}`);
    cIds.add(c.id);
    if (!domainIds.has(c.domain)) errors.push(`card ${c.id}: unknown domain ${c.domain}`);
    if (!['strong', 'moderate', 'emerging'].includes(c.evidence)) errors.push(`card ${c.id}: bad evidence`);
    if (!['free', 'pro'].includes(c.tier)) errors.push(`card ${c.id}: bad tier`);
    if (!c.how || !c.how.length) errors.push(`card ${c.id}: needs how steps`);
    if (!c.attribution || !c.attribution.length) errors.push(`card ${c.id}: needs attribution`);
    const t = c.triggers || {};
    for (const cond of t.answers || [])
      if (!qIds.has(cond.q)) errors.push(`card ${c.id}: trigger references unknown question ${cond.q}`);
  }
  return errors;
}

// Works both in the browser (globals) and node tests (module.exports).
if (typeof module !== 'undefined') {
  module.exports = { DOMAINS, FLAG_BEHAVIOUR, scoreQuestion, scoreDomains, baselineScore, collectFlags, cardTriggered, domainPriorities, buildPlan, validateData };
}
