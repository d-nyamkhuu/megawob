(function () {
  'use strict';
  const C = { site: 'design-act-in-time-popup-02', menu: 'Workspace|File|Edit|View|Tools|Help' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        r = ctx.rng;
      const top = u.el('header', 'ds-top', document.body);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t, i) => u.el('span', i === 0 ? 'ds-workspace' : '', nav, t));
      u.el('span', 'ds-time', top, 'Mon Apr 12  9:24 AM');
      u.el('div', 'ds-badge', top, 'NeXT');
      const body = u.el('div', 'ds-body', document.body);
      const stage = u.el('main', 'ds-stage', body);
      if (ctx.display === 'header') {
        const note = u.el('aside', 'ds-header-note', body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      } else if (ctx.display === 'panel') {
        const note = u.el('aside', 'ds-brief', body);
        u.el('b', '', note, 'Instructions');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      } else if (ctx.display === 'toast') {
        const note = u.el('aside', 'ds-toast', body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('div', 'ds-trash', body, '▤\nTrash');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const decoys = (ctx.content && ctx.content.DECOY_LABELS) || [
        'Help',
        'Feedback',
        'Preview',
        'Save draft',
        'Reset view',
        'Share',
        'Export',
        'History',
      ];
      const word = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = r.fork('chrome/end'),
        collideR = r.fork('chrome/collide');
      let submit = null;
      if (!ctx.finish) {
        const base = endR.bool(0.5);
        const label = base ? 'Submit' : word(endR.pick(labels.filter((x) => word(x).toLowerCase() !== 'submit')));
        const place = base ? 'bottom' : endR.pick(['header', 'link']);
        const parent = place === 'header' ? top : body;
        const cls =
          'ds-submit' + (place === 'header' ? ' ds-submit-header' : place === 'link' ? ' ds-submit-link' : '');
        submit = u.el(place === 'link' ? 'a' : 'button', cls, parent, place === 'link' ? label + ' ›' : label);
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      let di = 0;
      if (collideR.bool(0.3)) {
        const pool = labels
          .map(word)
          .filter((x) => !submit || x.toLowerCase() !== submit.textContent.replace(/ ›$/, '').toLowerCase());
        if (pool.length) {
          const b = u.el('button', 'ds-xtra', top, word(collideR.pick(pool)));
          b.type = 'button';
          b.style.right = 20 + di * 108 + 'px';
          di++;
          b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
        }
      }
      const fillerR = r.fork('chrome/decoys');
      for (const x of fillerR.sample(decoys, Math.min(fillerR.int(0, 2), decoys.length))) {
        const b = u.el('button', 'ds-xtra', top, word(x));
        b.type = 'button';
        b.style.right = 20 + di * 108 + 'px';
        di++;
        b.addEventListener('click', () => env.log('decoy', { label: b.textContent }));
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
