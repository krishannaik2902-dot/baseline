/* Assessment flow: consent gate -> one question per screen -> plan.
 * Progress autosaves to localStorage; refresh resumes where you were. */

'use strict';

(function () {
  const root = document.getElementById('assess-root');
  if (!root) return;

  const DRAFT_KEY = 'baseline.draft.v1';
  const TERMS_VERSION = '2026-07-07.1';
  const DOMAIN_LABELS = {
    body: 'About you', sleep: 'Sleep', movement: 'Movement', nutrition: 'Food',
    mind: 'Stress & mind', connection: 'People & purpose', substances: 'Substances', habits: 'Daily structure',
  };
  let answers = {};
  let idx = 0;
  let consented = false;

  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (draft && draft.answers) { answers = draft.answers; idx = draft.idx || 0; consented = !!draft.consented; }
  } catch (e) { /* start fresh */ }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, idx, consented })); } catch (e) {}
  }

  function visibleQuestions() {
    return QUESTIONS.filter(q => {
      if (!q.showIf) return true;
      const a = answers[q.showIf.q];
      return q.showIf.in.includes(a);
    });
  }

  /* ------------------------------------------------------------ consent */
  function renderConsent() {
    root.innerHTML = `
      <section class="consent">
        <p class="consent-kicker">Before we start</p>
        <h1>Two things, plainly.</h1>
        <ol class="consent-points">
          <li><strong>This is not medical advice.</strong> It’s an educational tool that maps your answers to well-known habits and protocols. It can’t diagnose anything, and it doesn’t know your medical history. Anything you change, you change at your own judgement — and ideally with your doctor’s.</li>
          <li><strong>Your answers stay on this device.</strong> No account, no cookies, no server. We literally cannot see them. Clear your browser data and they’re gone. (We do count completions — anonymously, with nothing that identifies you; the full list and an off switch are in the <a href="privacy.html" target="_blank">privacy policy</a>.)</li>
        </ol>
        <label class="consent-check">
          <input type="checkbox" id="consent-box">
          <span>I’m 18 or over, I agree to the <a href="terms.html" target="_blank">Terms of Service</a>, and I understand this is educational information, not medical advice, and that no doctor–patient relationship is created. <a href="disclaimer.html" target="_blank">Full disclaimer</a>.</span>
        </label>
        <button class="btn btn-primary" id="consent-go" disabled>I agree — start, about 4 minutes</button>
      </section>`;
    const box = document.getElementById('consent-box');
    const go = document.getElementById('consent-go');
    box.addEventListener('change', () => { go.disabled = !box.checked; });
    go.addEventListener('click', () => {
      consented = true;
      // clickwrap assent record: affirmative act, timestamp, terms version
      try { localStorage.setItem('baseline.consent.v1', JSON.stringify({ at: new Date().toISOString(), terms: TERMS_VERSION })); } catch (e) {}
      if (window.Stats) Stats.event('assessment-started');
      saveDraft(); render();
    });
  }

  /* --------------------------------------------------------- under-18 stop */
  function renderMinorStop() {
    root.innerHTML = `
      <section class="consent">
        <h1>Come back when you’re 18.</h1>
        <p>Genuinely — good on you for caring about this stuff early. But this site is written for adults, and the honest advice for you is short: sleep a lot, move every day, eat real food, go easy on screens at night, and talk to your GP (with a parent) about anything that worries you.</p>
        <p><a class="btn" href="index.html">Back to the start</a></p>
      </section>`;
  }

  /* ----------------------------------------------------------- question */
  function renderQuestion() {
    const qs = visibleQuestions();
    if (idx >= qs.length) return finish();
    const q = qs[idx];
    const n = idx + 1, total = qs.length;
    const saved = answers[q.id];

    let body = '';
    if (q.type === 'choice' || q.type === 'multi') {
      body = `<div class="q-options" role="listbox">` + q.options.map((o, i) => {
        const sel = q.type === 'multi'
          ? Array.isArray(saved) && saved.includes(o.value)
          : saved === o.value;
        return `<button class="q-opt${sel ? ' is-selected' : ''}" data-value="${o.value}">
          <span class="q-opt-key">${i + 1}</span><span>${o.label}</span></button>`;
      }).join('') + `</div>`;
    } else if (q.type === 'number') {
      const val = saved !== undefined ? saved : '';
      body = `
        <div class="q-number">
          <button class="q-step" data-step="-1" aria-label="decrease">−</button>
          <input type="number" id="q-num" inputmode="numeric" min="${q.min}" max="${q.max}" value="${val}" placeholder="0">
          <button class="q-step" data-step="1" aria-label="increase">+</button>
          <span class="q-unit">${q.unit || ''}</span>
        </div>
        <button class="btn btn-primary q-next" id="q-next">Next</button>`;
    }

    root.innerHTML = `
      <section class="q">
        <div class="q-progress"><div class="q-progress-bar" style="width:${Math.round((idx / total) * 100)}%"></div></div>
        <p class="q-count"><span class="q-domain">${DOMAIN_LABELS[q.domain] || ''}</span><span class="q-sep">·</span><span>${n} of ${total}</span></p>
        <h1 class="q-text">${q.text}</h1>
        ${q.help ? `<p class="q-help">${q.help}</p>` : ''}
        ${body}
        <div class="q-nav">
          ${idx > 0 ? '<button class="q-back" id="q-back">← Back</button>' : '<span></span>'}
          ${q.type === 'multi' ? '<button class="btn btn-primary" id="q-multi-next">Next</button>' : ''}
        </div>
      </section>`;

    if (q.type === 'choice') {
      root.querySelectorAll('.q-opt').forEach(btn => btn.addEventListener('click', () => {
        answers[q.id] = btn.dataset.value;
        if (q.id === 'age_band' && btn.dataset.value === 'u18') { saveDraft(); return renderMinorStop(); }
        idx++; saveDraft(); render();
      }));
    }
    if (q.type === 'multi') {
      root.querySelectorAll('.q-opt').forEach(btn => btn.addEventListener('click', () => {
        const cur = new Set(Array.isArray(answers[q.id]) ? answers[q.id] : []);
        cur.has(btn.dataset.value) ? cur.delete(btn.dataset.value) : cur.add(btn.dataset.value);
        answers[q.id] = [...cur];
        btn.classList.toggle('is-selected');
        saveDraft();
      }));
      document.getElementById('q-multi-next').addEventListener('click', () => { idx++; saveDraft(); render(); });
    }
    if (q.type === 'number') {
      const input = document.getElementById('q-num');
      root.querySelectorAll('.q-step').forEach(b => b.addEventListener('click', () => {
        const cur = Number(input.value || 0) + Number(b.dataset.step);
        input.value = Math.min(q.max, Math.max(q.min, cur));
      }));
      const next = () => {
        if (input.value === '') { input.focus(); return; }
        answers[q.id] = Math.min(q.max, Math.max(q.min, Number(input.value)));
        idx++; saveDraft(); render();
      };
      document.getElementById('q-next').addEventListener('click', next);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') next(); });
      input.focus();
    }
    const back = document.getElementById('q-back');
    if (back) back.addEventListener('click', () => { idx = Math.max(0, idx - 1); saveDraft(); render(); });

    // keyboard: 1-9 pick options
    document.onkeydown = (e) => {
      if (q.type !== 'choice' && q.type !== 'multi') return;
      const k = parseInt(e.key, 10);
      if (k >= 1 && k <= q.options.length) {
        root.querySelectorAll('.q-opt')[k - 1].click();
      }
    };
  }

  /* -------------------------------------------------------------- finish */
  function finish() {
    document.onkeydown = null;
    // answers are the source of truth; plan.html recomputes from them so
    // engine improvements apply to existing users automatically
    Store.save({ answers, completedAt: new Date().toISOString() });
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    if (window.Stats) Stats.event('assessment-completed');
    window.location.href = 'plan.html';
  }

  function render() {
    window.scrollTo(0, 0);
    if (!consented) return renderConsent();
    if (answers.age_band === 'u18') return renderMinorStop();
    renderQuestion();
  }

  render();
})();
