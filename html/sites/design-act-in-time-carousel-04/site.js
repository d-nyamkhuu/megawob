(function () {
  'use strict';
  const C = { site: 'design-act-in-time-carousel-04' };
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
      u.el('div', 'ds-brand', top, 'The Daily Chronicle');
      const nav = u.el('nav', 'ds-nav', top);
      ['NEWS', 'OPINION', 'LIFE', 'BUSINESS', 'TECH', 'SPORTS'].forEach((x) => u.el('span', '', nav, x));
      const tools = u.el('div', 'ds-headtools', top);
      u.el('span', 'ds-search', tools, '⌕');
      u.el('span', 'ds-weather-icon', tools, '☼');
      const wx = u.el('span', 'ds-weather', tools);
      u.el('b', '', wx, '72°');
      u.el('small', '', wx, 'Sunny');
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
            const d = u.el('button', 'ds-pq', tools, String(collideRng.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'title') submit = makeSubmit(tools, 'ds-submit ds-submit-title');
      }
      const stories = u.el('section', 'ds-stories', document.body);
      const sh = u.el('div', 'ds-stories-head', stories);
      u.el('h1', '', sh, 'Top Stories');
      const counts = u.el('div', 'ds-counts', sh);
      [
        ['12', 'New Today'],
        ['34', 'Most Read'],
        ['8', "Editor's Picks"],
      ].forEach(([n, t]) => {
        const c = u.el('div', 'ds-count', counts);
        u.el('b', '', c, n);
        u.el('span', '', c, t);
      });
      const grid = u.el('div', 'ds-story-grid', stories);
      const cardData = [
        ['politics', 'POLITICS', 'Senate advances climate bill in narrow vote'],
        ['health', 'HEALTH', 'New vaccine shows strong protection in early results'],
        ['nature', 'ENVIRONMENT', 'National park sees record number of visitors this summer'],
        ['tech', 'TECH', 'How remote work is reshaping small towns'],
      ];
      cardData.forEach(([kind, tag, title]) => {
        const c = u.el('article', 'ds-story', grid);
        u.el('div', 'ds-thumb ds-thumb-' + kind, c);
        u.el('div', 'ds-category', c, tag);
        u.el('h2', '', c, title);
      });
      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display || 'header';
      if (mode === 'header') u.el('div', 'ds-instruction ds-header-instruction', content, ctx.instruction);
      const body = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', body);
      if (mode === 'panel') {
        const p = u.el('aside', 'ds-panel-note', content);
        u.el('b', '', p, 'YOUR TASK');
        u.el('span', '', p, ctx.instruction);
      }
      if (mode === 'toast') {
        const p = u.el('aside', 'ds-toast', content);
        u.el('span', '', p, ctx.instruction);
        const x = u.el('button', '', p, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => {
          p.hidden = true;
          env.log('note-close');
        });
      }
      const controls = u.el('div', 'ds-footer', document.body);
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(controls, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(top, 'ds-submit ds-submit-status');
      const dock = u.el('nav', 'ds-dock', document.body);
      [
        ['⌂', 'Home', true],
        ['☰', 'Explore', false],
        ['♧', 'Saved', false],
        ['♙', 'Profile', false],
      ].forEach(([icon, text, on]) => {
        const item = u.el('div', 'ds-dock-item' + (on ? ' active' : ''), dock);
        u.el('span', 'ds-dock-icon', item, icon);
        u.el('span', '', item, text);
      });
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
