(function () {
  'use strict';
  const C = { site: 'design-act-in-time-debounce-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'ds-window', document.body);
      const top = u.el('header', 'ds-top', win);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-app-icon', brand, '✈');
      u.el('span', '', brand, 'Travel');
      const meta = u.el('div', 'ds-window-meta', top);
      let submit = null,
        label = 'Continue',
        placement = 'shelf';
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
        label = original ? 'Continue' : labelOf(er.pick(labels));
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
        if (placement === 'title') submit = makeSubmit(meta, 'ds-submit ds-submit-title');
      }
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', 'ds-window-control', meta, t);
        b.type = 'button';
      });
      const mode = ctx.display || 'header';
      let headNote = null;
      if (mode === 'header' && ctx.instruction) {
        headNote = u.el('div', 'ds-header-note', win);
        u.el('span', 'ds-note-mark', headNote, 'Task');
        u.el('div', 'ds-instruction', headNote, ctx.instruction);
      }
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const summary = u.el('aside', 'ds-summary', main);
      const sh = u.el('div', 'ds-summary-head', summary);
      u.el('span', 'ds-summary-icon', sh, '▮');
      u.el('strong', '', sh, 'Trip Summary');
      const rows = [
        ['✈', 'Flights', '0 selected'],
        ['▢', 'Dates', 'Apr 16 – Apr 23, 2024'],
        ['♙', 'Travelers', '1 adult'],
        ['♧', 'Class', 'Economy'],
        ['⌖', 'City', '—'],
      ];
      for (const [ic, k, v] of rows) {
        const row = u.el('div', 'ds-summary-row', summary);
        u.el('span', 'ds-summary-ico', row, ic);
        u.el('span', 'ds-summary-label', row, k);
        u.el('span', 'ds-summary-value', row, v);
      }
      if (mode === 'panel' && ctx.instruction) {
        const note = u.el('div', 'ds-panel-note', summary);
        u.el('span', 'ds-note-mark', note, 'Task');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const status = u.el('div', 'ds-status', win);
      u.el('span', 'ds-ready', status, '●  Ready');
      u.el('span', 'ds-status-copy', status, '');
      if (mode === 'toast' && ctx.instruction) {
        const toast = u.el('div', 'ds-toast', win);
        u.el('div', 'ds-instruction ds-instruction-toast', toast, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', win);
      const nav = u.el('nav', 'ds-nav', foot);
      [
        ['✈', 'Flights'],
        ['♧', 'Hotels'],
        ['▱', 'Cars'],
        ['▣', 'Trips'],
        ['⚙', 'Settings'],
      ].forEach(([ic, n], i) => {
        const item = u.el('div', 'ds-nav-item' + (i === 0 ? ' active' : ''), nav);
        u.el('span', '', item, ic);
        u.el('span', '', item, n);
      });
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(status, 'ds-submit ds-submit-status');
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
