// Library frame design on site/base; generic controls and runtime notices come from the template.
(function () {
  'use strict';

  const library = {
    bg: '#f2ebdb', panel: '#f2ebdb', fg: '#2b1d18',
    line: '#cfc4ad', muted: '#4a3d36',
  };

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { display, root } = _c;
      root.style.setProperty('--font', "Georgia,'Palatino Linotype',serif");
      document.body.className = 'bottom instruction-' + display;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML =
        '<svg viewBox="0 0 84 50" fill="none" stroke="#e9d6b9" stroke-width="1"><path d="M2 8L10 6 10 2Q27-2 42 7Q57-2 74 2L74 6 82 8 82 47Q62 40 42 47Q22 40 2 47Z" fill="#d8c1a0"/><path d="M7 8V42Q24 37 42 44Q60 37 77 42V8M10 2V38Q25 34 42 43Q59 34 74 38V2M42 7V43" stroke="#77442e"/><path d="M14 3V35M17 3V34M20 3V34M64 3V34M67 3V34M70 3V35" stroke="#ab8b66"/><path d="M23 7Q31 6 38 10M46 10Q53 6 61 7" stroke="#8a6648" stroke-width=".65"/><path d="M23 10Q31 9 38 13M46 13Q53 9 61 10" stroke="#8a6648" stroke-width=".65"/><path d="M23 13Q31 12 38 16M46 16Q53 12 61 13" stroke="#8a6648" stroke-width=".65"/><path d="M23 16Q31 15 38 19M46 19Q53 15 61 16" stroke="#8a6648" stroke-width=".65"/><path d="M23 19Q31 18 38 22M46 22Q53 18 61 19" stroke="#8a6648" stroke-width=".65"/><path d="M23 22Q31 21 38 25M46 25Q53 21 61 22" stroke="#8a6648" stroke-width=".65"/><path d="M23 25Q31 24 38 28M46 28Q53 24 61 25" stroke="#8a6648" stroke-width=".65"/><path d="M23 28Q31 27 38 31M46 31Q53 27 61 28" stroke="#8a6648" stroke-width=".65"/><path d="M23 31Q31 30 38 34M46 34Q53 30 61 31" stroke="#8a6648" stroke-width=".65"/><path d="M23 34Q31 33 38 37M46 37Q53 33 61 34" stroke="#8a6648" stroke-width=".65"/><path d="M2 47Q23 40 42 47Q61 40 82 47M1 49H83" stroke="#e9d6b9"/></svg>';
      u.el('span', '', brand, 'Riverton Public Library');
      const nav = u.el('nav', 'design-nav', header);
      ['Catalog', 'Community', 'Events', 'Research', 'About'].forEach((n, i) => {
        const a = u.el('span', 'nav-item' + (i === 1 ? ' on' : ''), nav, n);
        a.addEventListener('click', () => env.log('decoy', { what: n }));
      });
      const sb = u.el('div', 'header-search', header);
      u.el('span', '', sb, 'Search the library…');
      const si = u.el('i', '', sb);
      si.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>';
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const { display, shell, util } = _c;
      const body = util.el('div', 'design-body ref-body', shell);
      const note = util.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      note.hidden = display !== 'header';
      base({ ..._c, header: note });
      Object.assign(_c, { body });
    },
    // The open canvas has no filler sidebar; the body already holds its instruction.
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.dataset.role = 'instruction';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.footer': (base) => (_c) => {
      // This design always has a library imprint. Reuse the template's footer controls.
      base(_c);
      const footer = document.body.querySelector('.ref-foot') ||
        _c.util.el('footer', 'ref-foot', _c.shell);
      footer.classList.add('design-footer');
      _c.shell.append(footer);
      const imprint = footer.querySelector('.ref-foot-text') ||
        _c.util.el('span', 'ref-foot-text', footer);
      imprint.classList.add('footer-label');
      imprint.textContent = 'Riverton Public Library  ·  Knowledge Brings Us Together  ·  Est. 1892';
      footer.append(_c.headerTools);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        footer.prepend(note);
      }
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.append(dock);
    },
  };

  env.site({
    name: 'design-use-social-feed-some-09',
    template: 'site/base',
    // The frame's typography and palette stay fixed across episodes.
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { library }, LOW_THEME: library,
      ACCENTS: ['#6b1322'], LOW_ACCENTS: ['#6b1322'],
      parts,
    },
  });
})();
