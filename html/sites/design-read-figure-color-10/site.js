(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-10',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'mint',
    'title': 'WorkBoard',
    'menu': 'Notebook / Visual Tasks',
    'note': '',
    'layout': 'utility',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'nx instruction-' + ctx.display;
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const originalEnd = endRng.bool(0.5);
      const placement = originalEnd ? 'footer' : endRng.pick(['header', 'icon']);
      const endText = originalEnd ? 'Submit' : endRng.pick(endLabels);
      const decoyBtn = (parent, label, collide = false) => {
        const b = u.el('button', 'nxdecoy', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      {
        const bar = u.el('header', 'nxbar', document.body);
        const lg = u.svg('svg', { width: 38, height: 44, viewBox: '0 0 38 44', class: 'nxlogo' }, bar);
        u.svg('path', { d: 'M4 13L26 2L36 25L14 42L2 28Z', fill: '#09090a', stroke: '#333' }, lg);
        u.svg(
          'path',
          {
            d: 'M4 13L14 30L36 25M14 30V42M4 13L26 2L36 25M26 2L22 18',
            fill: 'none',
            stroke: '#999',
            'stroke-width': 0.9,
          },
          lg,
        );
        const nt = u.svg(
          'text',
          {
            x: 8,
            y: 25,
            fill: '#bbb',
            'font-size': 12,
            'font-family': 'Times New Roman',
            transform: 'rotate(-24 18 20)',
          },
          lg,
        );
        nt.textContent = 'NeXT';
        u.svg('path', { d: 'M15 16l8 10M20 13l-4 15', stroke: '#81658c', 'stroke-width': 0.7 }, lg);
        u.el('b', '', bar, 'Workspace');
        ['File', 'Edit', 'Tasks', 'Windows', 'Help'].forEach((t) => u.el('span', '', bar, t));
        u.el('em', '', bar, 'Mon Apr 12  9:24 AM');
        const speaker = u.svg('svg', { width: 29, height: 29, viewBox: '0 0 29 29', class: 'nxspk' }, bar);
        u.svg('path', { d: 'M3 11H8L15 5V24L8 18H3Z', fill: '#111' }, speaker);
        u.svg(
          'path',
          { d: 'M19 8Q26 14 19 21M22 4Q33 14 22 25', fill: 'none', stroke: '#111', 'stroke-width': 1.5 },
          speaker,
        );
        const win = u.el('main', 'nxwin', document.body);
        const tb = u.el('div', 'nxtitle', win);
        u.el('i', 'nxmini nxmini-left', tb, '▧');
        u.el('span', '', tb, 'Color Match');
        u.el('i', 'nxmini nxmini-right', tb, '↗');
        const brief = u.el('div', 'brief', win, ctx.display === 'hidden' ? '' : ctx.instruction);
        const stage = u.el('section', 'stage', win);
        const footer = u.el('footer', 'bottom', win);
        decoyBtn(footer, '?').className = 'nxq';
        decoyBtn(footer, 'Help').className = 'nxhelp';
        u.el('span', 'nxsp', footer);
        const clr = decoyBtn(footer, 'Clear');
        clr.className = 'nxclear';
        let submit = null;
        if (!ctx.finish) {
          submit = u.el(
            'button',
            'submit' + (placement === 'footer' ? '' : ' nxend-' + placement),
            placement === 'footer' ? footer : tb,
            placement === 'icon' ? '✓' : endText,
          );
          submit.type = 'button';
          submit.title = endText;
          submit.setAttribute('aria-label', endText);
          submit.addEventListener('click', ctx.submit);
        }
        if (collideRng.bool(0.3)) {
          const choices = endLabels.filter((label) => label.trim().toLowerCase() !== endText.trim().toLowerCase());
          if (choices.length) decoyBtn(tb, collideRng.pick(choices), true);
        }
        return { stage, submit };
      }
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
