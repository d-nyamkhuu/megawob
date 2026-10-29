(function () {
  'use strict';
  const C = { 'site': 'design-set-date-time-10', 'brand': 'Event Planner' };
  const ICON_APP =
    '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#6f5fd0" stroke-width="2"><rect x="3" y="5" width="20" height="18" rx="2" fill="#f1edff"/><path d="M8 2v5M18 2v5M3 10h20"/><path d="M7 14h2m2 0h2m2 0h2M7 18h2m2 0h2m2 0h2" stroke-width="1"/></svg>';
  const ICON_MIN =
    '<svg width="16" height="16" viewBox="0 0 16 16" stroke="#222" stroke-width="1.6"><path d="M2 8h12"/></svg>';
  const ICON_MAX =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#222" stroke-width="1.6"><rect x="2" y="2" width="12" height="12" rx="2"/></svg>';
  const ICON_X =
    '<svg width="16" height="16" viewBox="0 0 16 16" stroke="#222" stroke-width="1.6"><path d="M2 2l12 12M14 2L2 14"/></svg>';
  const ICON_SM =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7865d5" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 2v5M16 2v5M3 10h18"/><path d="M7 13h2m2 0h2m2 0h2M7 17h2m2 0h2m2 0h2" stroke-width="2.1"/></svg>';
  const ICON_DOC =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#616b89" stroke-width="1.8" stroke-linejoin="round"><path d="M7 7h8l5 5v10H7z"/><path d="M3 2h10l5 5v12H3z" fill="#f9f8fe"/><path d="M13 2v5h5"/></svg>';
  const ICON_BIN =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6f6a80" stroke-width="1.7"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></svg>';
  const ICON_FORK =
    '<svg width="44" height="50" viewBox="0 0 44 50" fill="none" stroke="#9095ad" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v13q0 5 6 5t6-5V5M14 5v40" stroke-width="4"/><path d="M34 5q-7 3-7 19h7v21" stroke-width="5"/></svg>';
  const MONTH_DAYS = [
    [0, 0, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 0, 0, 0],
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('header', 'ds-titlebar', win);
      const app = u.el('span', 'ds-app', tb);
      app.innerHTML = ICON_APP;
      u.el('span', 'ds-apptitle', tb, 'Event Planner');
      const wc = u.el('span', 'ds-wc', tb);
      [ICON_MIN, ICON_MAX, ICON_X].forEach((i) => {
        u.el('span', '', wc).innerHTML = i;
      });
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const placements = ['footer', 'footer', 'header', 'link'];
      const placement = ctx.finish ? null : endRng.pick(placements);
      const labels = Array.isArray(ctx.content && ctx.content.END_LABELS) ? ctx.content.END_LABELS : [];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitLabel = labels.length
        ? endRng.bool(0.5)
          ? labels.find((x) => labelText(x).toLowerCase() === 'submit') || labels[0]
          : endRng.pick(labels)
        : 'Submit';
      const endLabel = labelText(submitLabel);
      let collideLabel = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = labels.map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collideLabel = collideRng.pick([...new Set(pool)]);
      }
      let submit = null;
      const cols = u.el('div', 'ds-cols', win);
      const left = u.el('aside', 'ds-left', cols);
      const tools = u.el('section', 'ds-panel', left);
      u.el('h3', '', tools, 'Quick Tools');
      [
        [ICON_SM, 'New Event'],
        [ICON_DOC, 'Duplicate'],
        [ICON_BIN, 'Delete'],
      ].forEach((t) => {
        const r = u.el('div', 'ds-tool', tools);
        u.el('span', 'ds-ico', r).innerHTML = t[0];
        u.el('span', '', r, t[1]);
      });
      const cal = u.el('section', 'ds-panel ds-cal', left);
      u.el('h3', '', cal, 'Calendar');
      const ch = u.el('div', 'ds-calhead', cal);
      u.el('span', '', ch, '‹');
      u.el('b', '', ch, 'April 2025');
      u.el('span', '', ch, '›');
      const g = u.el('div', 'ds-calgrid', cal);
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((d) => u.el('i', '', g, d));
      MONTH_DAYS.forEach((w) =>
        w.forEach((d) => {
          const c = u.el('span', d === 14 ? 'sel' : '', g, d ? String(d) : '');
        }),
      );
      const center = u.el('main', 'ds-center', cols);
      const n = u.el('div', 'ds-note ds-note-' + ctx.display, center);
      if (ctx.display !== 'hidden') {
        const instruction = u.el('div', 'ds-instruction', n, ctx.instruction);
        instruction.style.setProperty('--instruction-font', String(Math.min(48, 2300 / ctx.instruction.length)));
      }
      if (placement === 'header') {
        const b = u.el('button', 'ds-submit ds-header-submit', tb, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        submit = b;
      }
      if (collideLabel) {
        const b = u.el('button', 'ds-xtra ds-header-xtra', tb, collideLabel);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      const stage = u.el('div', 'ds-stage', center);
      const foot = u.el('footer', 'ds-footer', center);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      if (!ctx.finish && placement !== 'header') {
        if (placement === 'link') {
          submit = u.el('a', 'ds-endlink', foot, endLabel + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', endLabel);
          submit.title = endLabel;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'ds-submit', foot, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        }
        submit.dataset.role = 'submit';
      }
      u.el('div', 'ds-reservation-values', win);
      const right = u.el('aside', 'ds-right', cols);
      const ven = u.el('section', 'ds-panel', right);
      u.el('h3', '', ven, 'Venue');
      const vr = u.el('div', 'ds-venue', ven);
      u.el('span', 'ds-thumb', vr).innerHTML = ICON_FORK;
      const vt = u.el('div', '', vr);
      u.el('b', '', vt, 'Riverside Bistro');
      u.el('div', '', vt, '123 Maple Ave');
      u.el('div', '', vt, 'Riverton, CA');
      u.el('button', 'ds-pill', ven, 'Change').type = 'button';
      const pf = u.el('section', 'ds-panel', right);
      u.el('h3', '', pf, 'Preferences');
      [
        ['Indoor seating', 1],
        ['Outdoor seating', 0],
        ['Quiet area', 1],
        ['Wheelchair accessible', 0],
      ].forEach((p) => {
        const r = u.el('div', 'ds-check', pf);
        u.el('span', 'ds-box' + (p[1] ? ' on' : ''), r, p[1] ? '✓' : '');
        u.el('span', '', r, p[0]);
      });
      const ct = u.el('section', 'ds-panel ds-contact', right);
      u.el('h3', '', ct, 'Contact');
      [
        ['Name', 'Alex Chen'],
        ['Phone', '(555) 018-7723'],
        ['Email', 'alex.chen@example.com'],
      ].forEach((f) => {
        u.el('label', '', ct, f[0]);
        u.el('div', 'ds-field', ct, f[1]);
      });
      const instruction = n.querySelector('.ds-instruction');
      if (instruction) {
        const font = parseFloat(getComputedStyle(instruction).fontSize);
        const available = n.clientWidth;
        const measured = instruction.scrollWidth;
        if (measured > available) instruction.style.fontSize = ((font * available) / measured) * 0.97 + 'px';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
