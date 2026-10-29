(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-09',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'gloss',
    'title': 'My Workspace',
    'menu': '',
    'note': '',
    'layout': 'wide',
    'subtitle': 'Organize  ·  Focus  ·  Get Things Done',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        rail = u.el('nav', 'menu', app);
      [
        ['⌂', 'Home'],
        ['▤', 'Tasks'],
        ['▦', 'Calendar'],
        ['▰', 'Files'],
        ['♣', 'People'],
        ['⚙', 'Settings'],
      ].forEach((it, i) => {
        const row = u.el('div', 'rail-item' + (!i ? ' active' : ''), rail);
        const box = u.el('span', 'rail-icon', row);
        if (i === 5) {
          box.textContent = it[0];
        } else {
          const icon = u.svg('svg', { width: 29, height: 29, viewBox: '0 0 32 32', fill: 'currentColor' }, box);
          if (i === 0) u.svg('path', { d: 'M2 14 16 2l14 12v16H19V20h-6v10H2z' }, icon);
          else if (i === 1) {
            u.svg('rect', { x: 4, y: 3, width: 24, height: 26, rx: 2 }, icon);
            [9, 15, 21].forEach((y) => {
              u.svg('path', { d: 'M12 ' + y + 'h12', stroke: '#fff', 'stroke-width': 2 }, icon);
              u.svg('rect', { x: 7, y: y - 2, width: 2, height: 2, fill: '#fff' }, icon);
            });
          } else if (i === 2) {
            u.svg('rect', { x: 3, y: 5, width: 26, height: 25, rx: 2 }, icon);
            u.svg('path', { d: 'M3 11h26M10 2v7M22 2v7', stroke: '#fff', 'stroke-width': 2.5 }, icon);
            [8, 14, 20].forEach((x) =>
              u.svg('path', { d: 'M' + x + ' 15v2m0 4v2', stroke: '#fff', 'stroke-width': 2 }, icon),
            );
          } else if (i === 3) u.svg('path', { d: 'M2 8h11l3 4h14v16H2zM2 8V4h11l3 4' }, icon);
          else {
            u.svg('circle', { cx: 11, cy: 10, r: 5 }, icon);
            u.svg('circle', { cx: 23, cy: 11, r: 4 }, icon);
            u.svg('path', { d: 'M2 29c0-7 4-11 9-11s9 4 9 11zM18 20c6-2 12 2 12 9H22' }, icon);
          }
        }
        u.el('span', '', row, it[1]);
      });
      const top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      const brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, C.title);
      if (C.subtitle) u.el('small', '', brand, C.subtitle);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      const search = u.el('div', 'search', top);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search');
      const center = u.el('div', 'center', app);
      u.el('div', 'section-title', center, 'Number Order');
      const brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', center); // New frame choices use isolated streams, leaving the original episode unchanged.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const tools = u.el('div', 'section-tools', center.querySelector('.section-title'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'header' ? tools : footer,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'chrome-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
