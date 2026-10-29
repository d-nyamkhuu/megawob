(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-04',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'aqua',
    'layout': 'workbench',
    'title': 'Shape Finder',
    'menu': ['File', 'Edit', 'View', 'Window', 'Help'],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util;
      const bar = u.el('div', 'menubar', document.body);
      const apple = u.svg(
        'svg',
        { class: 'apple', width: 25, height: 29, viewBox: '0 0 26 30', 'aria-hidden': 'true' },
        bar,
      );
      u.svg(
        'path',
        {
          d: 'M17 5c2-1 3-3 3-5-3 0-5 2-5 5zM22 16c-3-2-4-6 0-9-3-3-6-2-8-1-2 1-4-2-7 0-7 4-5 16 0 21 2 2 4-1 6-1s5 3 7 0c2-2 3-4 4-7-1 0-2-1-2-3z',
          fill: '#34434f',
        },
        apple,
      );
      u.el('b', '', bar, C.title);
      for (const m of C.menu) u.el('span', 'mi', bar, m);
      u.el('span', 'sp', bar);
      const sound = u.svg(
        'svg',
        { class: 'sound', width: 27, height: 25, viewBox: '0 0 28 26', 'aria-hidden': 'true' },
        bar,
      );
      u.svg('path', { d: 'M2 9h5l7-6v20l-7-6H2z', fill: '#293744' }, sound);
      u.svg('path', { d: 'M17 7q7 6 0 12M21 3q11 10 0 20', fill: 'none', stroke: '#293744', 'stroke-width': 2 }, sound);
      u.el('span', 'clock', bar, 'Mon 10:24 AM');
      const mag = u.el('span', 'mag', bar);
      const glass = u.svg('svg', { width: 25, height: 25, viewBox: '0 0 25 25', 'aria-hidden': 'true' }, mag);
      u.svg(
        'path',
        { d: 'M16 15l6 6M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0', fill: 'none', stroke: 'white', 'stroke-width': 2.8 },
        glass,
      );
      const app = u.el('main', 'app', document.body),
        win = u.el('div', 'win', app),
        tb = u.el('header', 'top', win);
      const lights = u.el('div', 'lights', tb);
      for (const c of ['r', 'y', 'g']) u.el('i', c, lights);
      u.el('span', 'ttl', tb, C.title);
      const center = u.el('div', 'center', win),
        brief = u.el(
          'div',
          'brief',
          center,
          ctx.display === 'hidden' || ctx.display === 'panel' ? '' : ctx.instruction,
        );
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', app);
      u.el('div', 'tb2', aside);
      const p1 = u.el('div', 'phead', aside, 'Task Details');
      const w1 = u.el('div', 'well', aside);
      const rows = [
        ['Task', 'Identify a shape'],
        ['Instruction', ctx.instruction],
        ['Input method', 'Mouse click'],
        ['Status', 'Not submitted'],
      ];
      for (const r of rows) {
        if (r[0] === 'Instruction' && ctx.display === 'hidden') continue;
        const row = u.el(
          'div',
          'row ' +
            (r[0] === 'Instruction' ? 'instruction-row ' : '') +
            (r[0] === 'Instruction' && ctx.display === 'panel' ? 'instruction-card' : ''),
          w1,
        );
        u.el('span', 'k', row, r[0]);
        u.el('span', 'v', row, r[1]);
      }
      u.el('div', 'phead p2', aside, 'Shape Info');
      const w2 = u.el('div', 'well info', aside);
      u.el('div', '', w2, 'No selection');
      u.el('div', 'dim', w2, 'Click a shape to see its details.');
      let submit = null;
      const footer = u.el('footer', 'bottom', aside);
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map(labelOf);
      const classic = !endR.bool(0.5),
        label = classic ? 'Submit' : endR.pick(labels);
      const placement = ctx.finish ? null : classic ? 'footer' : endR.pick(['footer', 'header', 'link']);
      const collides = !ctx.finish && collideR.bool(0.3);
      document.body.classList.add('end-' + (placement || 'finish'));
      let collision = null;
      if (collides) {
        const options = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (options.length) collision = collideR.pick(options);
      }
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (placement === 'header') {
        const h = u.el('div', 'header-end-tools', tb);
        if (collision) decoy(h, collision);
        submit = makeEnd(h, 'header-submit', label);
      } else if (placement === 'link') {
        const links = u.el('div', 'link-tools', aside);
        if (collision) decoy(links, collision);
        submit = makeEnd(links, 'end-link', label + ' ›', 'a');
      } else if (!ctx.finish) {
        if (collision) {
          const h = u.el('div', 'header-end-tools', tb);
          decoy(h, collision);
        }
        submit = makeEnd(footer, 'submit', label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
