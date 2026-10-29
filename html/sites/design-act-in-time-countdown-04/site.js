(function () {
  'use strict';
  const C = { site: 'design-act-in-time-countdown-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-lock', top, '▣');
      u.el('span', 'ds-brand', top, 'Store Pickup Reservation');
      const meta = u.el('div', 'ds-window-meta', top);
      let submit = null,
        label = 'Apply',
        placement = 'footer';
      const make = (p, cls) => {
        const b = u.el('button', cls, p, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fall = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labels =
          ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : fall;
        const er = ctx.rng.fork('chrome/end');
        const orig = er.bool(0.5);
        label = orig ? 'Apply' : er.pick(labels).label || er.pick(labels);
        placement = orig ? 'footer' : er.pick(['footer', 'title', 'status']);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label))
            .filter((x) => x && x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-pq', meta, cr.pick(pool));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'title') submit = make(meta, 'ds-submit ds-submit-title');
      }
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', 'ds-winbtn', meta, t);
        b.type = 'button';
      });
      const mode = ctx.display || 'header';
      const note = (parent, cls) => {
        if (mode !== 'hidden') u.el('div', cls, parent, ctx.instruction);
      };
      if (mode === 'header') {
        const n = u.el('div', 'ds-header-note', document.body);
        note(n, 'ds-instruction');
      }
      const layout = u.el('div', 'ds-layout', document.body);
      const work = u.el('div', 'ds-work', layout);
      const stage = u.el('main', 'ds-stage', work);
      if (mode === 'toast') note(work, 'ds-instruction ds-toast');
      const foot = u.el('footer', 'ds-footer', work);
      if (!ctx.finish && placement === 'footer') submit = make(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = make(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit.classList.add('ds-submit-status');
      if (mode === 'panel') {
        const sideNote = u.el('div', 'ds-panel-note', layout);
        note(sideNote, 'ds-instruction');
      }
      const side = u.el('aside', 'ds-side', layout);
      if (mode !== 'panel') {
        u.el('h2', '', side, 'Pickup information');
      }
      const blocks = [
        ['⌖', 'Riverton Store', '125 Market St, Riverton'],
        ['▤', 'Store hours', 'Mon – Sat, 9:00 – 18:00\nSun, 10:00 – 16:00'],
        ['▱', 'Bring your order number', 'We’ll hold your item at the pickup desk.'],
      ];
      blocks.forEach(([icon, title, txt]) => {
        const row = u.el('div', 'ds-info', side);
        u.el('span', 'ds-icon', row, icon);
        const copy = u.el('div', '', row);
        u.el('b', '', copy, title);
        u.el('span', '', copy, txt);
      });
      u.el('h2', 'ds-tips-title', side, 'Helpful tips');
      [
        ['◷', 'Your item is reserved for a short time while you choose a slot.'],
        ['▦', 'Pickup is available on the selected day during the store’s open hours.'],
        ['▢', 'Choose how many bags you’ll need for your items.'],
      ].forEach(([ic, txt]) => {
        const row = u.el('div', 'ds-tip', side);
        u.el('span', 'ds-icon', row, ic);
        u.el('span', '', row, txt);
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
