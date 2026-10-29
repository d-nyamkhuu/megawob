(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-loading-01',
    'brand': 'ShopEase',
    'title': "Today's task",
    'instruction': 'right',
    'rail':
      'All Categories|Electronics|Home & Kitchen|Clothing & Accessories|Beauty & Personal Care|Sports & Outdoors|Toys & Games|Books & Media|Health & Wellness|Automotive|Office & Stationery|Pets',
    'menu': 'Home|Shop|Deals|Orders|Account',
    'briefTitle': "Today's task",
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
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      let submit = null,
        placement = null,
        label = 'Submit';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent);
        b.textContent = label;
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5);
        label = original ? 'Submit' : labelOf(er.pick(labels));
        placement = original ? 'shelf' : er.pick(['shelf', 'title', 'status']);
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-pq', meta, String(collideRng.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        ['−', '□', '×'].forEach((t) => {
          const b = u.el('button', '', meta, t);
          b.type = 'button';
        });
        if (placement === 'title') submit = makeSubmit(top, 'ds-submit ds-submit-title');
      }
      const status = u.el('div', 'ds-chase-status', document.body);
      u.el('span', '', status, '●  Ready');
      u.el('span', '', status, 'Keep the pointer inside the circle for the required time.');
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
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        if (mode !== 'hidden')
          u.el('div', mode === 'toast' ? 'ds-instruction ds-instruction-toast' : 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (mode !== 'hidden') {
        const b = briefing(main, 'ds-brief');
        b.style.order = '2';
      } else {
        const b = u.el('aside', 'ds-brief ds-brief-hidden', main);
        b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(meta, 'ds-submit ds-submit-status');
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
