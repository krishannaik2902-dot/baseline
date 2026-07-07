/* Engine test harness. Run: node tests/engine.test.js
 * Uses stub banks until the real content lands; then also validates the real banks. */

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const E = require('../js/engine.js');

const stubQuestions = [
  { id: 'sleep_hours', domain: 'sleep', text: 'Hours of sleep?', type: 'choice', weight: 3,
    options: [
      { value: 'lt5', label: '<5', score: 10, flags: ['severe_sleep'] },
      { value: '7to8', label: '7-8', score: 95 },
    ] },
  { id: 'exercise_days', domain: 'movement', text: 'Days/week exercise?', type: 'number', weight: 2,
    bands: [ { max: 0, score: 10 }, { max: 2, score: 45 }, { max: 4, score: 75 }, { max: 7, score: 95 } ] },
  { id: 'meds', domain: 'body', text: 'Regular medication?', type: 'choice', weight: 1,
    options: [
      { value: 'yes', label: 'Yes', score: 50, flags: ['meds'] },
      { value: 'no', label: 'No', score: 80 },
    ] },
  { id: 'mood_multi', domain: 'mind', text: 'Which apply?', type: 'multi', weight: 2,
    options: [
      { value: 'calm', label: 'Mostly calm', score: 90 },
      { value: 'wired', label: 'Wired at night', score: 40 },
      { value: 'heavy', label: 'Everything feels heavy', score: 10, flags: ['low_mood_severe'] },
    ] },
];

const stubProtocols = [
  { id: 'morning-light', domain: 'sleep', title: 'Morning light', tldr: 't', why: 'w', how: ['step'],
    evidence: 'strong', effort: 1, cost: 'free', tier: 'free', priority: 90,
    attribution: [{ who: 'Andrew Huberman', what: 'sleep toolkit' }],
    triggers: { domain_below: 85 } },
  { id: 'creatine', domain: 'movement', title: 'Creatine', tldr: 't', why: 'w', how: ['step'],
    evidence: 'strong', effort: 1, cost: 'low', tier: 'free', priority: 70, tags: ['supplement'],
    attribution: [{ who: 'Rhonda Patrick', what: 'podcast' }] },
  { id: 'zone2', domain: 'movement', title: 'Zone 2 base', tldr: 't', why: 'w', how: ['step'],
    evidence: 'strong', effort: 2, cost: 'free', tier: 'pro', priority: 85,
    attribution: [{ who: 'Peter Attia', what: 'Outlive' }],
    triggers: { answers: [{ q: 'exercise_days', in: ['0', '1', '2'] }] } },
];

// validation of stubs
assert.deepStrictEqual(E.validateData(stubQuestions, stubProtocols), [], 'stub banks validate');

// scoring
const answers = { sleep_hours: 'lt5', exercise_days: 1, meds: 'yes', mood_multi: ['calm', 'wired'] };
const scores = E.scoreDomains(stubQuestions, answers);
assert.strictEqual(scores.sleep, 10, 'sleep scored from choice');
assert.strictEqual(scores.movement, 45, 'movement scored from band');
assert.strictEqual(scores.mind, 65, 'multi scores average');
assert.strictEqual(scores.nutrition, null, 'unanswered domain is null');

// flags
const flags = E.collectFlags(stubQuestions, answers);
assert.ok(flags.includes('severe_sleep') && flags.includes('meds'), 'flags collected');
assert.ok(!flags.includes('low_mood_severe'), 'unselected multi option raises no flag');

// baseline ignores unanswered domains
const overall = E.baselineScore(scores);
assert.ok(overall > 0 && overall < 100, 'baseline in range');

// plan: meds flag suppresses supplement-tagged card
const plan = E.buildPlan(stubQuestions, stubProtocols, answers);
assert.ok(!plan.free.find(c => c.id === 'creatine'), 'meds flag suppresses supplement card');
assert.ok(plan.free.find(c => c.id === 'morning-light'), 'triggered card present');
assert.ok(plan.pro.find(c => c.id === 'zone2'), 'answer-trigger matches numeric answer as string');
assert.ok(plan.safetyNotices.length >= 2, 'safety notices for meds + severe_sleep');
assert.ok(plan.week1.length >= 1 && plan.week1.length <= 5, 'week1 sized');
const w1domains = plan.week1.map(c => c.domain);
assert.strictEqual(new Set(w1domains).size, w1domains.length, 'week1 max one card per domain');

// no meds: supplement allowed
const plan2 = E.buildPlan(stubQuestions, stubProtocols, { ...answers, meds: 'no' });
assert.ok(plan2.free.find(c => c.id === 'creatine'), 'supplement present without meds flag');

// priorities sorted by gap x weight
const pri = E.domainPriorities(scores);
assert.strictEqual(pri[0].id, 'sleep', 'weakest heavy domain ranks first');

// real banks, when they exist, must validate and produce a sane plan for a smoke profile
const qPath = path.join(__dirname, '../js/questions.js');
const pPath = path.join(__dirname, '../js/protocols.js');
if (fs.existsSync(qPath) && fs.existsSync(pPath)) {
  const { QUESTIONS } = require(qPath);
  const { PROTOCOLS } = require(pPath);
  const errs = E.validateData(QUESTIONS, PROTOCOLS);
  assert.deepStrictEqual(errs, [], 'real banks validate: ' + errs.slice(0, 5).join(' | '));
  assert.ok(QUESTIONS.length >= 20, 'question bank has >= 20 questions');
  assert.ok(PROTOCOLS.length >= 40, 'protocol bank has >= 40 cards');
  const freeCards = PROTOCOLS.filter(c => c.tier === 'free');
  assert.ok(freeCards.length >= 15, 'free tier is genuinely valuable (>= 15 cards)');
  // every domain has at least one free card so no plan renders empty
  for (const d of E.DOMAINS) {
    assert.ok(PROTOCOLS.some(c => c.domain === d.id && c.tier === 'free'), `domain ${d.id} has a free card`);
  }
  // worst-case profile: pick lowest-scoring answer everywhere; plan must still build
  const worst = {};
  for (const q of QUESTIONS) {
    if (q.type === 'number') worst[q.id] = 0;
    else if (q.type === 'multi') worst[q.id] = [q.options.reduce((a, b) => ((a.score ?? 100) < (b.score ?? 100) ? a : b)).value];
    else worst[q.id] = q.options.reduce((a, b) => ((a.score ?? 100) < (b.score ?? 100) ? a : b)).value;
  }
  const worstPlan = E.buildPlan(QUESTIONS, PROTOCOLS, worst);
  assert.ok(worstPlan.week1.length >= 3, 'worst-case profile still gets a starter week');
  assert.ok(worstPlan.free.length >= 5, 'worst-case profile gets free cards');
  console.log(`real banks OK: ${QUESTIONS.length} questions, ${PROTOCOLS.length} cards, worst-case baseline ${worstPlan.overall}`);
} else {
  console.log('real banks not present yet — stub tests only');
}

console.log('ALL ENGINE TESTS PASSED');
