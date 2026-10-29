(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-tictactoe-05', task: 'solve-puzzle', scenario: 'tictactoe' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'cdrom instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        disc = u.el('div', 'cd-disc', top),
        brand = u.el('div', 'brand', top);
      u.el('div', 'brand-title', brand, 'Mind Games');
      u.el('div', 'brand-subtitle', brand, 'A CD-ROM COMPANION');
      const nav = u.el('nav', 'menu', top);
      ['Games', 'Puzzles', 'Reference', 'Options', 'Help'].forEach((x, i) =>
        u.el('div', i === 0 ? 'active' : '', nav, x),
      );
      const center = u.el('div', 'center', app),
        tabs = u.el('nav', 'tabs', center);
      ['Tic-Tac-Toe', 'Instructions', 'High Scores'].forEach((x, i) => u.el('div', i === 0 ? 'active' : '', tabs, x));
      if (ctx.display !== 'hidden') u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      u.el('div', 'think-further', footer, 'Think Further');
      u.el('div', 'gold-rule', footer);
      const fresh = u.el('button', 'control new-game', footer, 'New Game');
      fresh.type = 'button';
      const clear = u.el('button', 'control clear-board', footer, 'Clear Board');
      clear.type = 'button';
      const reset = () => document.querySelector('.reference-reset')?.click();
      fresh.addEventListener('click', reset);
      clear.addEventListener('click', reset);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ];
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        let label = labelOf(labels.find((x) => labelOf(x).toLowerCase() === 'submit') || labels[0]),
          place = 'footer';
        if (!er.bool(0.5)) {
          label = labelOf(er.pick(labels));
          place = er.pick(['tabs', 'link']);
        }
        const makeEnd = (parent, cls, tag) => {
          const b = u.el(tag || 'button', cls, parent, tag === 'a' ? label + ' ›' : label);
          if (tag === 'a') b.href = '#';
          else b.type = 'button';
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (place === 'footer') submit = makeEnd(footer, 'submit');
        else if (place === 'link') submit = makeEnd(footer, 'submit end-link', 'a');
        else submit = makeEnd(tabs, 'submit end-tab');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'end-xtra', place === 'tabs' ? tabs : footer, labelOf(cr.pick(pool)));
            d.type = 'button';
            const text = d.textContent;
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
