/* Plan page: recomputes the plan from stored answers and renders it.
 * Free tier: baseline score, domain breakdown, safety notices, week-1 starter,
 * top free protocol cards. Pro tier: full protocol depth, shown locked. */

'use strict';

(function () {
  const root = document.getElementById('plan-root');
  if (!root) return;

  const state = Store.load();
  if (!state || !state.answers || Object.keys(state.answers).length < 5) {
    root.innerHTML = `
      <section class="plan-empty">
        <h1>No plan here yet.</h1>
        <p>Either you haven’t taken the assessment on this device, or your browser data was cleared. (Your answers only ever live on your own device — that’s a feature.)</p>
        <p><a class="btn btn-primary" href="assessment.html">Take the assessment — it’s free</a></p>
      </section>`;
    return;
  }

  const plan = buildPlan(QUESTIONS, PROTOCOLS, state.answers);
  const domainsById = Object.fromEntries(DOMAINS.map(d => [d.id, d]));

  const scoreWord = (s) =>
    s >= 80 ? 'a strong base' :
    s >= 65 ? 'a decent base with clear gaps' :
    s >= 50 ? 'real room to work with' :
    'a lot of upside — which is the optimistic way of putting it';

  const evidenceLabel = { strong: 'Strong evidence', moderate: 'Moderate evidence', emerging: 'Emerging / debated' };
  const effortLabel = ['', 'Low effort', 'Medium effort', 'Big commitment'];

  function cardHTML(c, locked) {
    if (locked) {
      return `<article class="card card-locked">
        <div class="card-head"><span class="badge badge-${c.evidence}">${evidenceLabel[c.evidence]}</span><span class="lock" aria-hidden="true">Pro</span></div>
        <h3>${c.title}</h3>
        <p class="card-tldr">${c.tldr}</p>
        <p class="card-lockednote">The full protocol — steps, progression, cautions — is in the Pro plan.</p>
      </article>`;
    }
    return `<article class="card">
      <div class="card-head">
        <span class="badge badge-${c.evidence}">${evidenceLabel[c.evidence]}</span>
        <span class="card-meta">${effortLabel[c.effort]} · ${c.cost === 'free' ? 'Costs nothing' : c.cost === 'low' ? 'Cheap' : 'Costs money'}</span>
      </div>
      <h3>${c.title}</h3>
      <p class="card-tldr">${c.tldr}</p>
      <details>
        <summary>How, exactly</summary>
        <p class="card-why">${c.why}</p>
        <ul class="card-how">${c.how.map(s => `<li>${s}</li>`).join('')}</ul>
        ${c.cautions && c.cautions.length ? `<p class="card-caution">Worth knowing: ${c.cautions.join(' ')}</p>` : ''}
        <p class="card-attr">Source: ${c.attribution.map(a => `${a.who} — ${a.what}`).join('; ')}</p>
      </details>
    </article>`;
  }

  const priorities = plan.priorities.filter(p => p.score !== null);
  const topPriorities = priorities.slice(0, 3);

  const freeByDomain = {};
  for (const c of plan.free) (freeByDomain[c.domain] = freeByDomain[c.domain] || []).push(c);

  root.innerHTML = `
    <section class="plan-score">
      <p class="plan-kicker">Your baseline, ${new Date(state.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <div class="score-dial"><span class="score-num">${plan.overall}</span><span class="score-max">/100</span></div>
      <p class="score-word">That’s ${scoreWord(plan.overall)}.</p>
      <p class="score-note">This number is a snapshot of habits, not a verdict on you — and definitely not a diagnosis. It exists so that in eight weeks you can beat it.</p>
      <div class="share-row">
        <button class="btn" id="share-btn">Share my score</button>
        <span class="cta-small" id="share-note" aria-live="polite"></span>
      </div>
    </section>

    ${plan.safetyNotices.length ? `
    <section class="plan-safety">
      <h2>First, the serious bit</h2>
      ${plan.safetyNotices.map(n => `<p class="safety-notice">${n}</p>`).join('')}
    </section>` : ''}

    <section class="plan-domains">
      <h2>Where you stand</h2>
      <div class="domain-bars">
        ${priorities.map(p => `
          <div class="domain-row">
            <span class="domain-label">${p.label}</span>
            <div class="domain-track"><div class="domain-fill" style="width:${p.score}%"></div></div>
            <span class="domain-score">${p.score}</span>
          </div>`).join('')}
      </div>
      <p class="plan-note">Ordered by what’s costing you most — a weak score in a heavyweight domain (sleep, movement) matters more than a weak score in a light one.</p>
    </section>

    <section class="plan-week1">
      <h2>Your first week</h2>
      <p>Don’t change ten things. Change these ${plan.week1.length}, for seven days, and see how you feel:</p>
      <ol class="week1-list">
        ${plan.week1.map(c => `<li><strong>${c.title}.</strong> ${c.tldr}</li>`).join('')}
      </ol>
    </section>

    <section class="plan-cards">
      <h2>Your full picture${topPriorities.length ? ` — start with ${topPriorities.map(p => p.label.toLowerCase()).join(', then ')}` : ''}</h2>
      ${priorities.map(p => {
        const cards = freeByDomain[p.id] || [];
        if (!cards.length) return '';
        return `<div class="domain-group">
          <h3 class="domain-group-title">${p.label} <span class="domain-group-score">${p.score}/100</span></h3>
          <div class="cards">${cards.slice(0, 3).map(c => cardHTML(c, false)).join('')}</div>
        </div>`;
      }).join('')}
    </section>

    ${plan.pro.length ? `
    <section class="plan-pro">
      <h2>In the Pro plan</h2>
      <p>The free plan above is complete and genuinely enough to work with. Pro goes deeper: the full protocol library, a 12-week progression that adapts as you re-test, and the printable tracking sheets.</p>
      <div class="cards">${plan.pro.slice(0, 6).map(c => cardHTML(c, true)).join('')}</div>
      <div class="pro-cta" id="pro-cta"></div>
    </section>` : ''}

    <section class="plan-actions">
      <button class="btn" onclick="window.print()">Print this plan</button>
      <a class="btn" href="assessment.html">Retake the assessment</a>
      <button class="btn btn-quiet" id="plan-reset">Delete my data from this device</button>
    </section>

    <section class="plan-disclaimer">
      <p>Everything on this page is educational information mapped from your self-reported answers. It is not medical advice, a diagnosis, or a treatment plan, and no doctor–patient relationship exists. Talk to a healthcare professional before changing medication, diet, or exercise — especially if you have a health condition. <a href="disclaimer.html">Full disclaimer</a>.</p>
    </section>
  `;

  // Share the score only — never the answers. This is the growth loop that
  // respects the privacy promise: nothing about the user leaves their device.
  const shareBtn = document.getElementById('share-btn');
  const shareNote = document.getElementById('share-note');
  const site = (CONFIG.canonicalOrigin || location.origin + location.pathname.replace(/plan\.html$/, '')) || '';
  const shareUrl = site.replace(/plan\.html$/, '') + 'index.html';
  const shareText = `I scored ${plan.overall}/100 on my Baseline health check — the honest, no-wearable one. Take yours free (no signup, nothing leaves your device):`;
  shareBtn.addEventListener('click', async () => {
    const data = { title: 'Baseline', text: shareText, url: shareUrl.replace(/index\.html$/, '') };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (e) { /* fall through to copy */ }
    }
    try {
      await navigator.clipboard.writeText(shareText + ' ' + data.url);
      shareNote.textContent = 'Copied — paste it anywhere. (Your answers stay here; only the score goes.)';
    } catch (e) {
      shareNote.textContent = shareText + ' ' + data.url;
    }
  });

  document.getElementById('plan-reset').addEventListener('click', () => {
    if (confirm('Delete your answers and plan from this device? This can’t be undone.')) {
      Store.clear();
      window.location.href = 'index.html';
    }
  });

  // Pro CTA is rendered by pro.js (waitlist now, checkout when payments are live)
  if (window.renderProCTA) window.renderProCTA(document.getElementById('pro-cta'), 'plan');
})();
