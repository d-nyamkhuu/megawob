(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-04',
    'brand': 'Riverton University',
    'title': 'Email Preferences',
    'instruction': 'left',
    'rail': '',
    'menu': 'Office of Communications',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const svg = (p, w) =>
        '<svg width="' +
        (w || 18) +
        '" height="' +
        (w || 18) +
        '" viewBox="0 0 18 18" fill="none" stroke="#111" stroke-width="1.5">' +
        p +
        '</svg>';
      const win = u.el('div', 'ev-win', document.body);
      const tb = u.el('div', 'ev-title', win);
      const ic = u.el('span', 'ev-ico', tb);
      ic.innerHTML = svg('<rect x="2" y="4" width="14" height="10"/><path d="M2 4l7 6 7-6"/>', 22);
      u.el('span', 'ev-name', tb, 'Newsletter Preferences');
      const wc = u.el('span', 'ev-wc', tb);
      wc.innerHTML =
        svg('<path d="M3 9h12"/>', 20) +
        svg('<rect x="3" y="3" width="12" height="12"/>', 20) +
        svg('<path d="M3 3l12 12M15 3L3 15"/>', 20);
      const mn = u.el('div', 'ev-menu', win);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => {
        const s = u.el('span', '', mn);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const surf = u.el('div', 'ev-surface', main);
      const hd = u.el('header', 'ev-head', surf);
      u.el('h1', '', hd, 'Email Settings');
      u.el('p', '', hd, 'Manage how often you receive emails from us.');
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'header') {
        const ib = u.el('section', 'ev-instr', surf);
        u.el('div', 'ds-instruction', ib, ctx.instruction);
      } else if (display === 'panel') {
        const ib = u.el('section', 'ev-instr ev-instr-panel', surf);
        u.el('div', 'ev-panel-title', ib, 'Instructions');
        u.el('div', 'ds-instruction', ib, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', surf);
      if (display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', surf);
      const sb = u.el('div', 'ev-status', win);
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const common = er.bool(0.5);
      const endLabel = common ? 'Submit' : labelOf(er.pick(labels));
      const placement = ctx.finish ? null : common ? 'footer' : er.pick(['footer', 'title', 'status', 'link']);
      const endControl = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endControl(foot, 'ds-submit', endLabel);
        else if (placement === 'link') submit = endControl(foot, 'ev-end-link', endLabel, 'a');
        else if (placement === 'title') submit = endControl(tb, 'ev-end-title', endLabel);
        else submit = endControl(sb, 'ev-end-status', endLabel);
      }
      const reset = u.el('button', 'ds-reset', foot, 'Cancel');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        const controls = stage.querySelectorAll('input[type=radio]');
        controls.forEach((el) => (el.checked = false));
      });
      const g = u.el('span', 'ev-gear', sb);
      g.innerHTML = svg(
        '<path stroke-linejoin="round" d="M7 2h4l.5 2 1.5.9 2-.5 2 3.2-1.5 1.5v1.8l1.5 1.5-2 3.2-2-.5-1.5.9-.5 2H7l-.5-2-1.5-.9-2 .5-2-3.2L2.5 10V8.2L1 6.7l2-3.2 2 .5 1.5-.9z"/><circle cx="9" cy="9" r="2.5"/>',
        20,
      );
      u.el('span', '', sb, 'Ready');
      u.el('span', 'ev-date', sb, 'Apr 24, 2025   10:17 AM');
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const options = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const d = u.el('button', 'ev-pq', foot, labelOf(cr.pick(options)));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
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
