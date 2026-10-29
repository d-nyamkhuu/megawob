(function () {
  'use strict';
  const C = { site: 'design-act-in-time-loading-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = ctx.util,
        top = u.el('header', 'gtk-title', document.body);
      u.el('span', 'gtk-cart', top, '🛒');
      u.el('strong', 'gtk-name', top, 'ShopEasy');
      const controls = u.el('div', 'gtk-window', top);
      ['−', '□', '×'].forEach((x, i) => {
        const b = u.el('button', 'gtk-winbtn' + (i === 2 ? ' close' : ''), controls, x);
        b.type = 'button';
      });
      let submit = null,
        label = 'Continue',
        placement = 'footer';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let decoy = '';
      if (!ctx.finish) {
        const fallback = [
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
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const name = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const r = ctx.rng.fork('chrome/end');
        const common = r.bool(0.5);
        label = common ? 'Continue' : name(r.pick(labels));
        placement = common ? 'footer' : r.pick(['footer', 'title', 'status']);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(name).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) decoy = name(cr.pick(pool));
        }
        if (placement === 'title') submit = makeSubmit(top, 'gtk-submit gtk-title-submit');
      }
      const shell = u.el('div', 'gtk-shell', document.body);
      const side = u.el('aside', 'gtk-inspector', shell);
      const details = u.el('section', 'gtk-details', side);
      u.el('h2', '', details, 'Search Details');
      const pairs = [
        ['Query', 'pet supplies'],
        ['Category', 'All Categories'],
        ['Price Range', 'Any'],
        ['Brand', 'Any'],
        ['Seller', 'Any'],
      ];
      pairs.forEach(([k, v]) => {
        const row = u.el('div', 'gtk-detail-row', details);
        u.el('span', '', row, k + ':');
        u.el('span', '', row, v);
      });
      u.el('div', 'gtk-rule', side);
      const filters = u.el('section', 'gtk-filters', side);
      u.el('h2', '', filters, 'Filters');
      [
        ['Category', 'All Categories'],
        ['Brand', 'Any'],
        ['Condition', 'Any'],
      ].forEach(([k, v]) => {
        const f = u.el('label', 'gtk-field', filters, k);
        const box = u.el('button', 'gtk-select', f, v + '　⌄');
        box.type = 'button';
      });
      const price = u.el('label', 'gtk-field', filters, 'Price Range');
      const range = u.el('div', 'gtk-range', price);
      u.el('input', '', range).type = 'text';
      u.el('span', '', range, '–');
      u.el('input', '', range).type = 'text';
      [['Free shipping only'], ['In stock only']].forEach(([x]) => {
        const l = u.el('label', 'gtk-check', filters);
        const cb = u.el('input', '', l);
        cb.type = 'checkbox';
        u.el('span', '', l, x);
      });
      const work = u.el('div', 'gtk-work', shell);
      const mode = ctx.display || 'header';
      if (mode === 'header') {
        const n = u.el('div', 'gtk-instruction-head', work);
        u.el('span', '', n, ctx.instruction);
      }
      if (mode === 'panel') {
        const n = u.el('div', 'gtk-instruction-panel', side);
        u.el('strong', '', n, 'Task');
        u.el('div', '', n, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', work);
      if (mode === 'toast') {
        const n = u.el('aside', 'gtk-toast', work);
        u.el('span', '', n, ctx.instruction);
      }
      const foot = u.el('footer', 'gtk-footer', work);
      if (decoy) {
        const d = u.el('button', 'gtk-xtra', foot, decoy);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: decoy, collide: true }));
      }
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(foot, 'gtk-submit');
      const status = u.el('div', 'gtk-status', document.body);
      u.el('span', 'gtk-ready', status, '●');
      u.el('span', '', status, 'Ready');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(status, 'gtk-submit gtk-status-submit');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'gtk-overlay gtk-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new products.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
