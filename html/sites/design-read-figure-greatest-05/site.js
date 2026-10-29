(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-greatest-05',
    task: 'read-figure',
    scenario: 'greatest',
    style: 'gem',
    title: 'Number Select',
    menu: 'File     Edit     Options     Help',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' framed instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 36, height: 38, viewBox: '0 0 36 38', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 32, height: 34, fill: '#d1d1d1', stroke: '#111', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M8 18h20', fill: 'none', stroke: '#111', 'stroke-width': 4 }, icon);
      u.el('span', 'window-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-control ' + kind, wc);
        b.type = 'button';
        const svg = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, b);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M5 20h20' : kind === 'max' ? 'M6 5h18v20H6z' : 'M5 5l20 20M25 5L5 25',
            fill: 'none',
            stroke: '#111',
            'stroke-width': 3,
          },
          svg,
        );
      }
      const menu = u.el('nav', 'menu', app);
      C.menu
        .split(/\s{2,}/)
        .filter(Boolean)
        .forEach((label) => u.el('span', 'menu-item', menu, label));
      const center = u.el('div', 'center', app),
        brief = ctx.display === 'hidden' ? null : u.el('div', 'brief', center, ctx.instruction),
        stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app),
        statusIcon = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 34 34', class: 'status-icon' }, footer);
      u.svg('rect', { x: 3, y: 3, width: 28, height: 28, fill: '#ddd', stroke: '#111', 'stroke-width': 2 }, statusIcon);
      u.svg(
        'path',
        { d: 'M9 9h16v16H9zM12 12h10v10H12z', fill: 'none', stroke: '#111', 'stroke-width': 1.5 },
        statusIcon,
      );
      u.el('span', 'status-text', footer, 'Ready');
      u.el('span', 'status-time', footer, '10:24 AM');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const placement = er.pick(['surface', 'surface', 'toolbar', 'lower-right']);
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
        const host = placement === 'toolbar' ? menu : placement === 'lower-right' ? center : footer;
        submit = u.el(
          'button',
          'submit' + (placement === 'toolbar' ? ' end-toolbar' : placement === 'lower-right' ? ' end-lower-right' : ''),
          host,
          label,
        );
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = cr.pick(pool),
              parent = placement === 'toolbar' ? footer : menu,
              decoy = u.el('button', 'xtra-end', parent, text);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
