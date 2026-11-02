(function () {
  'use strict';
  const palette = { bg: '#faf7ef', panel: '#faf7ef', fg: '#292132', muted: '#54251a', line: '#54251a' };
  function masthead(u) {
    const top = u.el('header', 'top', document.body);
      const emblem = u.svg('svg', { class: 'library-emblem', viewBox: '0 0 170 92', 'aria-hidden': 'true' }, top);
      const ink = '#54251a';
      u.svg('path', { d: 'M3 88H168M12 85H160', fill: 'none', stroke: ink, 'stroke-width': 1.5 }, emblem);
      const books = [
        [18, 63, 10, 23, -12],
        [29, 29, 12, 56, 7],
        [44, 15, 13, 70, 3],
        [61, 30, 13, 55, 6],
        [76, 8, 25, 77, 0],
        [105, 26, 15, 59, -8],
        [124, 38, 13, 47, -12],
        [140, 43, 15, 42, -13],
      ];
      books.forEach(([x, y, w, h, a], i) => {
        const g = u.svg(
          'g',
          { transform: `rotate(${a} ${x + w / 2} 85)`, stroke: ink, 'stroke-width': 1.2, fill: 'none' },
          emblem,
        );
        u.svg('path', { d: `M${x + 1} 84V${y + 3}l${Math.max(3, w * 0.28)} -1V84Z`, fill: ink, stroke: 'none' }, g);
        for (let band = y + 7; band < 82; band += 7)
          u.svg('path', { d: `M${x + 1} ${band}h${Math.max(3, w * 0.28)}`, 'stroke-width': 0.8, stroke: '#faf7ef' }, g);
        u.svg(
          'path',
          {
            d: `M${x} 85V${y + 2}Q${x + w / 2} ${y - 2} ${x + w} ${y + 2}V85ZM${x + 3} 84V${y + 4}M${x + w - 3} ${y + 4}V84M${x} ${y + 8}H${x + w}M${x} ${y + 13}H${x + w}M${x} 77H${x + w}M${x} 81H${x + w}`,
          },
          g,
        );
        for (let yy = y + 18; yy < 74; yy += 4)
          u.svg(
            'path',
            {
              d: `M${x + 4} ${yy}h${Math.max(3, w - 8)}m-${Math.max(3, w - 8)} 1h${Math.max(2, w - 10)}`,
              'stroke-width': 0.7,
            },
            g,
          );
        if (i === 4) u.svg('path', { d: 'M101 10l18 5v70h-18M104 18h11M104 22h11M104 27h11M104 74h11' }, g);
      });
      const brand = u.el('div', 'brand', top);
      u.el('div', 'mast', brand, 'Maplewood University Library');
      u.el('div', 'sub', brand, 'CATALOG · RESEARCH · KNOWLEDGE  SINCE 1896');
      const motto = u.el('div', 'motto', top, 'Books Build Brighter Minds');
      const leaf = u.svg('svg', { viewBox: '0 0 36 44', class: 'maple-leaf', 'aria-hidden': 'true' }, motto);
      u.svg(
        'path',
        {
          d: 'M18 42Q16 29 18 17M18 20C11 15 12 6 17 2C22 8 23 14 18 20ZM17 29C9 28 5 21 5 15C13 17 17 22 17 29ZM19 28C18 19 25 14 31 13C31 21 25 26 19 28ZM17 35C8 36 3 31 2 26C10 25 14 28 17 35ZM19 35C23 28 29 28 34 29C30 35 25 38 19 35ZM17 7L18 20M8 20l9 9M28 17l-9 11M6 29l11 6M30 31l-11 4',
          fill: 'none',
          stroke: '#54251a',
          'stroke-width': 1.5,
        },
        leaf,
      );
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This catalog has a permanent margin for all note displays.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'maple instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      masthead(u);
      const nav = u.el('nav', 'menu', document.body);
      ['Search Catalog', 'Journal Titles', 'Research Guides', 'Special Collections', 'Ask a Librarian'].forEach((t) =>
        u.el('span', '', nav, t),
      );
      const app = u.el('main', 'app', document.body);
      const heading = u.el('h1', 'doc-title', app, 'Figure Identification');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      Object.assign(_c, { app, heading, center, aside, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.heading;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.app;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.util.el('h3', 'library-notice-title', note, 'Library notice');
        _c.aside.appendChild(note);
      }
      // General library copy contains no task goal or answer hints.
      const u = _c.util;
      u.el('h3', '', _c.aside, 'Actions');
      const ul = u.el('ul', '', _c.aside);
      u.el('li', '', ul, 'Browse the library catalog.');
      if (!_c.ctx.finish) u.el('li', '', ul, 'Explore research collections.');
      u.el('h3', '', _c.aside, 'Need Help?');
      u.el('p', '', _c.aside, 'Speak with a librarian for assistance with research resources and library services.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.app.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-read-figure-identify-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-identify-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7a1020'],
      LOW_ACCENTS: ['#7a1020'],
      parts,
    },
  });
})();
