(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-06',
    'brand': 'Household Ledger',
    'title': 'Project Task',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-nav', top);
      ['Entries', 'Reports', 'Settings'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      u.el('span', 'ds-date', top, 'Aug 11, 2023');
      u.el('span', 'ds-avatar', top, 'JD');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display || 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief' || cls === 'ds-panel') u.el('h2', '', b, C.briefTitle || 'Task');
        const text = u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-header-note') {
          const style = getComputedStyle(b);
          const room = b.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          text.style.transform = 'scaleX(' + Math.min(1, room / text.scrollWidth) + ')';
        }
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const pv = u.el('aside', 'ds-preview', body);
      u.el('h3', '', pv, 'Preview');
      const pb = u.el('div', 'ds-pv', pv);
      pb.innerHTML =
        '<svg viewBox="0 0 52 66" preserveAspectRatio="none"><path d="M6 2h28l14 14v46q0 2-2 2H6q-2 0-2-2V4q0-2 2-2z" fill="none" stroke="#080b08" stroke-width="4" stroke-linejoin="round"/><path d="M34 2v14h14" fill="none" stroke="#080b08" stroke-width="4"/><path d="M14 30h24M14 40h24M14 50h24" stroke="#080b08" stroke-width="4" stroke-linecap="round"/></svg>';
      const dl = u.el('dl', '', pb);
      ['Date', 'Description', 'Category', 'Amount'].forEach((k) => {
        u.el('dt', '', dl, k);
        u.el('dd', '', dl, '—');
      });
      if (mode === 'panel') {
        const b = briefing(body, 'ds-panel');
      }
      if (mode === 'toast') {
        const note = briefing(body, 'ds-toast');
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const placement = er.pick(['form', 'form', 'panel-button', 'ledger-link']);
        const original = placement === 'form';
        const label = original ? 'Submit' : labelOf(er.pick(labels));
        body.dataset.endPlacement = placement;
        submit = u.el('button', 'ds-submit ds-submit-' + placement, foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-pq', body, labelOf(cr.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
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
