(function () {
  'use strict';
  const site = 'design-solve-puzzle-odd-even-12';
  const palette = { bg: '#dedbff', panel: '#f7f8fc', fg: '#101a30', muted: '#5c6877', line: '#cbd1dc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'riso horizontal instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#7250df', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', {
        d: 'M7 6h12v5H7z M8 14h2v2H8z M12 14h2v2h-2z M16 14h2v2h-2z M8 18h2v2H8z M12 18h6v2h-6z',
        fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
      }, icon);
      u.el('span', '', top, 'Number Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.native-window-controls'));
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      u.el('div', 'settings', footer, '⚙  Settings');
      const art = u.el('div', 'footer-art', footer);
      const trees = u.el('img', '', art);
      trees.src = 'sites/' + site + '/assets/footer-trees.webp';
      trees.alt = '';
      u.el('div', 'footer-tagline', footer, 'A BRIGHTER\nTOMORROW\nADDS UP');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const warn = ctx.kind === 'banner';
      if (warn) {
        const icon = u.svg('svg', { width: 68, height: 68, viewBox: '0 0 68 68', class: 'warning-icon' }, el);
        u.svg('path', { d: 'M34 5 64 58H4z', fill: '#e7a400' }, icon);
        const mark = u.svg(
          'text',
          { x: 34, y: 48, 'text-anchor': 'middle', fill: '#fff', 'font-size': 43, 'font-weight': 700 },
          icon,
        );
        mark.textContent = '!';
        const copy = u.el('div', 'warning-copy', el);
        u.el('b', '', copy, 'Unsaved layout changes');
        u.el(
          'span',
          '',
          copy,
          'You have unsaved layout changes. You can continue without saving and your answers will be preserved.',
        );
      } else u.el('span', '', el, 'This application stores preferences on your device.');
      const dismiss = u.el('button', '', el, warn ? 'Continue without saving' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-solve-puzzle-odd-even-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6742df'],
      LOW_ACCENTS: ['#6742df'],
      parts,
    },
  });
})();
