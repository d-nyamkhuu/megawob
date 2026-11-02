(function () {
  'use strict';
  const palette = { bg: '#e8e5df', panel: '#f1eee6', fg: '#111111', muted: '#333333', line: '#222222' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The puzzle window has room for each of its original note styles.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      document.body.classList.add('home', 'instruction-' + _c.display);
      const u = _c.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const iconMarkup = [
        '<path d="M3 12L15 2l12 10-3 3-9-8-9 8z" fill="#bd382c"/><path d="M6 13v16h19V13l-10-8z" fill="#eee"/><path d="M11 19h7v10h-7z" fill="#3894b5"/><path d="M20 3h4v7h-4z" fill="#eee"/><path d="M8 15h3v4H8zM21 15h2v4h-2z" fill="#81c4db"/>',
        '<rect x="5" y="4" width="21" height="26" rx="1" fill="#fffef0"/><path d="M10 3h11v5H10z" fill="#d4d5ad"/><path d="M9 12h13M9 16h13M9 20h13M9 24h11" stroke="#225d6c"/>',
        '<path d="M2 20l7-4 7 4v10H2z" fill="#ec8bbb"/><path d="M18 18l7-4 6 5v11H18z" fill="#f38d25"/><path d="M8 23l8-5 9 5v9H8z" fill="#235fc7"/><path d="M6 12V8l4-3 4 3v7l-4 4zM23 13V8l4-3 4 3v8l-4 3z" fill="#efc29b"/><path d="M12 18v-5l4-3 5 3v6l-5 4z" fill="#edbc92"/><path d="M5 10l2-5 6-1 3 7M22 10l1-6 6-1 3 8M11 16l1-6 7-1 4 7" fill="none"/>',
        '<path d="M2 8h28v20H2z" fill="#fffef5"/><path d="M3 9l13 12L29 9M3 27l9-11m17 11-9-11" fill="none"/>',
        '<circle cx="16" cy="16" r="15" fill="#175fcb"/><path d="M8 3l9 1-2 5-5 2-2 6-5-1-1-6zM22 8l7 5-3 7-4 1-1 8-5-2 1-9 5-4z" fill="#279429"/><path d="M8 3l-3 9 1 11 7 7M22 3l4 11-1 11M2 15h28" opacity=".35" fill="none"/>',
        '<path d="M16 1l4 10 11 1-8 8 3 11-10-6-10 6 3-11-8-8 11-1z" fill="#ffe334"/>',
      ];
      const mk = (p, names, offset) => {
        const n = u.el('nav', 'nav', p);
        names.forEach((t, i) => {
          const a = u.el('a', '', n);
          a.href = '#';
          a.addEventListener('click', (e) => e.preventDefault());
          const s = u.svg(
            'svg',
            {
              viewBox: '0 0 34 34',
              'shape-rendering': 'crispEdges',
              fill: 'none',
              stroke: '#171717',
              'stroke-width': 1.6,
              'stroke-linejoin': 'miter',
            },
            a,
          );
          s.innerHTML = iconMarkup[offset + i];
          u.el('span', '', a, t);
        });
      };
      const tree = (p) => {
        const s = u.svg('svg', { viewBox: '0 0 50 64', class: 'tree', 'shape-rendering': 'crispEdges' }, p);
        u.svg('path', { d: 'M23 44h6v18h-6z', fill: '#795e36', stroke: '#111' }, s);
        u.svg(
          'path',
          {
            d: 'M25 1l-2 5-3-1 2 5-7 1 5 3-5 3-5-1 4 4-5 3 9-1-5 5-7-1 4 4-6 3 11 1-7 4-5-1 4 4-6 3 8 2-3 3 15-2 4 2 3-2 15 2-3-4 8-1-5-3 2-3-7 1-4-4 11-1-6-3 3-4-7 1-5-5 10 1-5-3 3-4-6 1-5-3 6-3-8-1 1-4-3 1z',
            fill: '#174126',
            stroke: '#101c12',
            'stroke-width': 2,
          },
          s,
        );
        u.svg(
          'path',
          {
            d: 'M23 7l3 1m-7 7 6-1m-8 5 8 1m-11 6 10-2m-13 8 14-3m-15 9 14-3m-16 8 15-4m-10 7 11-3m3-27 5 2m-5 5 8 2m-9 4 10 3m-10 4 12 4m-12 2 9 3m-13-33 1 34',
            fill: 'none',
            stroke: '#4b7846',
            'stroke-width': 2,
          },
          s,
        );
      };
      mk(top, ['Home', 'Guestbook', 'Community'], 0);
      const mast = u.el('div', 'mast', top);
      tree(mast);
      const mt = u.el('div', '', mast);
      u.el('b', '', mt, 'Maple Grove Online');
      u.el('span', '', mt, 'A Small Town on the Web');
      tree(mast);
      mk(top, ['Mail', 'Links', 'My Page'], 3);
      const center = u.el('div', 'center', app);
      const wt = u.el('div', 'wtitle', center);
      u.el('i', '', wt);
      u.el('span', '', wt, 'Color Puzzle');
      u.el('small', '', wt, 'Have Fun! ');
      u.el('span', 'smile', wt, '☺');
      Object.assign(_c, { app, center, toolbar: wt, header: center });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-read-figure-shades-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0a3fa8'], LOW_ACCENTS: ['#0a3fa8'], parts,
    },
  });
})();
