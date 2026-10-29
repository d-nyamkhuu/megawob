(function () {
  'use strict';
  const C = { 'site': 'design-type-text-single-04', 'brand': 'Note Keeper' };
  function fmt(u, parent, text) {
    const parts = String(text).split(/("[^"]*")/);
    parts.forEach((p) => {
      if (!p) return;
      if (/^"[^"]*"$/.test(p)) u.el('b', '', parent, p);
      else parent.appendChild(document.createTextNode(p));
    });
  }
  const END_FALLBACK = [
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
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endBank = ctx.content && ctx.content.END_LABELS;
      const endLabels = (Array.isArray(endBank) && endBank.length ? endBank : END_FALLBACK).map(labelOf);
      const placement = endRng.pick(['form', 'form', 'form', 'footer', 'toolbar']);
      const common = endLabels.find((x) => x.toLowerCase() === 'submit') || endLabels[0] || 'Submit';
      const label = endRng.bool(0.5) ? common : labelOf(endRng.pick(endLabels));
      const top = u.el('header', 'ds-top', document.body);
      const lights = u.el('div', 'ds-lights', top);
      ['#fc5f57', '#fdbc2e', '#28c840'].forEach((c) => {
        const i = u.el('i', '', lights);
        i.style.background = c;
      });
      u.el('span', 'ds-brand', top, C.brand);
      const search = u.el('div', 'ds-search', top);
      search.insertAdjacentHTML(
        'beforeend',
        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6b6f78" stroke-width="1.6"><circle cx="7.5" cy="7.5" r="5.2"/><path d="M11.5 11.5 16 16"/></svg>',
      );
      u.el('span', '', search, 'Search');
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('div', 'ds-left', body);
      const right = u.el('div', 'ds-right', body);
      u.el('h1', 'ds-h1', left, 'Quick Task');
      let mode = ctx.display;
      if (
        (mode === 'panel' && document.documentElement.clientWidth < 1260) ||
        (mode === 'toast' && document.documentElement.clientHeight < 700)
      )
        mode = 'header';
      if (mode === 'header') {
        const ins = u.el('div', 'ds-instruction', left);
        fmt(u, ins, ctx.instruction);
      } else if (mode === 'toast') {
        const t = u.el('aside', 'ds-toast ds-instruction', right);
        fmt(u, t, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', left);
      u.el('div', 'ds-hint', left, 'Type the exact text shown above.');
      u.el('h2', 'ds-h2', right, 'Notes');
      u.el(
        'div',
        'ds-notecard',
        right,
        mode === 'panel' ? ctx.instruction : 'Use the box on the left to complete the task.',
      );
      let submit = null;
      const end = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'toolbar') submit = end(top, 'ds-end-toolbar');
      if (!ctx.finish && placement === 'form') submit = end(left, 'ds-submit');
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', '', foot, 'Ready');
      if (!ctx.finish && placement === 'footer') submit = end(foot, 'ds-end-footer');
      u.el('span', 'ds-date', foot, 'Mon Apr 27, 2015  10:24 AM');
      if (!ctx.finish) {
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const d = u.el('button', 'ds-xtra', top, labelOf(collideRng.pick(options)));
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
