(function () {
  'use strict';
  const C = { site: 'design-read-figure-greatest-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const w = (ctx.size && ctx.size.width) || window.innerWidth,
        h = (ctx.size && ctx.size.height) || window.innerHeight;
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && (w < 1120 || h < 680)) display = 'header';
      document.body.className = 'yosemite-center-stage instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        lights = u.el('div', 'traffic-lights', top);
      [
        ['red', '#ff5f57'],
        ['yellow', '#febc2e'],
        ['green', '#28c840'],
      ].forEach(([n, c]) => {
        const d = u.el('i', n, lights);
        d.style.background = c;
      });
      u.el('strong', 'app-name', top, 'Number Practice');
      const menubar = u.el('nav', 'mac-menus', top);
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((x) => u.el('span', 'menu-item', menubar, x));
      const titlebar = u.el('div', 'titlebar', app);
      u.el('span', 'window-title', titlebar, 'Number Practice');
      const search = u.el('div', 'search', titlebar);
      u.svg('svg', { width: 17, height: 17, viewBox: '0 0 20 20', class: 'search-icon' }, search).innerHTML =
        '<circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m12 12 5 5" stroke="currentColor" stroke-width="1.8"/>';
      u.el('span', '', search, 'Search');
      const work = u.el('div', 'work-area', app),
        center = u.el('section', 'center', work),
        brief = u.el('div', 'brief', center, display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', center);
      const left = u.el('div', 'perimeter-tools left-tools', work),
        right = u.el('div', 'perimeter-tools right-tools', work);
      function tool(parent, label, path) {
        const item = u.el('div', 'tool', parent);
        const svg = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 32 32', class: 'tool-icon' }, item);
        u.svg(
          'path',
          {
            d: path,
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2.1,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          svg,
        );
        u.el('span', '', item, label);
      }
      tool(
        left,
        'Settings',
        'M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.9 2.9m12.6 12.6 2.9 2.9m0-18.4-2.9 2.9M9.7 22.3l-2.9 2.9M16 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12z',
      );
      tool(
        left,
        'Help',
        'M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24zm-3-16a3.2 3.2 0 1 1 5.3 2.4c-1.6 1.4-2.3 2-2.3 4m0 3v.2',
      );
      tool(right, 'Notes', 'M8 4h15v24H8zM12 10h8M12 15h8M12 20h6M5 8v20h15');
      tool(right, 'Keyboard Shortcuts', 'M3 8h26v16H3zM7 12h2m3 0h2m3 0h2m3 0h2M7 16h2m3 0h2m3 0h2m3 0h2M9 20h14');
      let submit = null;
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          common = er.bool(0.5);
        placement = common ? 'footer' : er.pick(['toolbar', 'footer', 'link']);
        if (!common) {
          const pool = ctx.content && ctx.content.END_LABELS;
          const picked = pool && pool.length ? er.pick(pool) : 'Done';
          label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
        }
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = end(footer, 'submit', label);
        else if (placement === 'link') submit = end(footer, 'end-link', label + ' ›');
        else submit = end(titlebar, 'submit submit-toolbar', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = ctx.content && ctx.content.END_LABELS;
          const labels = (
            pool && pool.length ? pool : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const choices = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) {
            const text = cr.pick(choices),
              parent = placement === 'footer' ? titlebar : footer;
            const d = u.el('button', 'chrome-xtra', parent, text);
            d.type = 'button';
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
