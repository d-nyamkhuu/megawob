(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-search-01',
    brand: 'Shop',
    title: 'Product Search',
    instruction: 'Product Search',
    rail: '',
    menu: 'Home|Search|Categories|Basket|Orders',
    briefTitle: 'Search Tips',
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
      let submit = null,
        placement = null,
        label = 'Save';
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
        label = original ? 'Save' : labelOf(er.pick(labels));
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
        ['−', '□', '×'].forEach((t, i) => {
          const b = u.el('button', 'ds-window-control', meta, t);
          b.type = 'button';
          b.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
        });
        if (placement === 'title') submit = makeSubmit(top, 'ds-submit ds-submit-title');
      }
      const nav = u.el('nav', 'ds-menu', document.body);
      const icons = ['⌂', '⌕', '▤', '▣', '▤'];
      C.menu.split('|').forEach((t, i) => {
        const item = u.el('div', 'ds-nav-item' + (i === 1 ? ' active' : ''), nav);
        u.el('span', 'ds-nav-icon', item, icons[i]);
        u.el('span', '', item, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display || 'header';
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'header') {
        const note = u.el('div', 'ds-header-note', document.body);
        u.el('span', 'ds-note-icon', note, '🔎');
        u.el('span', '', note, ctx.instruction);
      } else if (mode === 'panel') {
        const note = u.el('aside', 'ds-side-note', body);
        u.el('strong', '', note, 'Search Tips');
        u.el('div', '', note, ctx.instruction);
      } else if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', document.body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'ds-foot-status', foot, 'Shop  ·  Ready');
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(top, 'ds-submit ds-submit-status');
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
