(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-algebra-08' };
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1024) || (display === 'toast' && window.innerHeight < 640))
        display = 'header';
      document.body.className = 'bauhaus-notebook instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        center = u.el('div', 'center', app);
      if (display !== 'hidden') u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        tabs = u.el('aside', 'aside', document.body);
      const entries = ['Math', 'Notes', 'Help', 'Settings'];
      entries.forEach((label, i) => {
        const tab = u.el('div', 'notebook-tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', tab, label);
        const icon = u.svg('svg', { class: 'tab-icon', viewBox: '0 0 60 60', 'aria-hidden': 'true' }, tab);
        if (i === 0) {
          u.svg(
            'rect',
            { x: 7, y: 4, width: 46, height: 52, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 },
            icon,
          );
          for (let y = 14; y < 49; y += 12)
            for (let x = 16; x < 48; x += 12)
              u.svg('rect', { x, y, width: 7, height: 7, rx: 1, fill: 'currentColor' }, icon);
        } else if (i === 1) {
          u.svg(
            'rect',
            { x: 7, y: 4, width: 46, height: 52, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 },
            icon,
          );
          for (let y = 15; y < 48; y += 9)
            u.svg('path', { d: `M17 ${y}h27`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, icon);
        } else if (i === 2) {
          u.svg('circle', { cx: 30, cy: 30, r: 25, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, icon);
          const q = u.svg(
            'text',
            {
              x: 30,
              y: 43,
              'text-anchor': 'middle',
              'font-size': 39,
              'font-family': 'Arial',
              'font-weight': 700,
              fill: 'currentColor',
            },
            icon,
          );
          q.textContent = '?';
        } else {
          const gear = u.svg(
            'text',
            { x: 30, y: 48, 'text-anchor': 'middle', 'font-size': 52, 'font-family': 'Arial', fill: 'currentColor' },
            icon,
          );
          gear.textContent = '⚙';
        }
      });
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
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
            ]
          ).map(labelOf),
          er = ctx.rng.fork('chrome/end'),
          primary = er.bool(0.5),
          label = primary ? 'Submit' : labelOf(er.pick(labels.filter((x) => x.toLowerCase() !== 'submit'))),
          placement = primary ? 'center' : er.pick(['page-top', 'page-link']);
        submit = u.el('button', 'submit end-' + placement, footer, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const opts = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (opts.length) {
            const decoy = u.el('button', 'notebook-xtra', app, labelOf(cr.pick(opts)));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
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
