(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#050505', muted: '#555', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'mac-split instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const menubar = u.el('header', 'mac-menubar', document.body);
      const apple = u.svg('svg', { viewBox: '0 0 30 34', width: 30, height: 34, 'aria-hidden': 'true' }, menubar);
      u.svg('path', {
        d: 'M16 9C11 5 4 10 4 18c0 8 5 14 8 14 2 0 3-2 5-2s3 2 5 2c3 0 5-4 6-8-7-2-7-11-1-13-3-4-7-4-11-2zM16 7c0-5 4-7 8-7 0 4-3 8-8 7z',
        fill: '#000',
      }, apple);
      for (const label of ['File', 'Edit', 'Task', 'Options', 'Window', 'Help'])
        u.el('span', 'mac-menu-item', menubar, label);
      const help = u.el('button', 'mac-help', menubar, '?');
      help.type = 'button';
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      u.el('span', 'mac-clock', menubar, '10:24 AM');
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Practice');
      const grow = u.svg('svg', { viewBox: '0 0 28 28', class: 'grow-icon', 'aria-hidden': 'true' }, top);
      u.svg('rect', { x: 1, y: 1, width: 26, height: 26, fill: '#fff', stroke: '#000', 'stroke-width': 2 }, grow);
      u.svg('path', { d: 'M6 10h9v11H6zM10 6h11v10M14 7l7-1-1 7M11 17L21 6', fill: 'none', stroke: '#000', 'stroke-width': 1.8 }, grow);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const overview = u.el('div', 'overview', _c.center);
      const doc = u.svg('svg', { viewBox: '0 0 64 90', class: 'document-icon', 'aria-hidden': 'true' }, overview);
      u.svg('path', { d: 'M2 2h43l17 18v68H2zM45 2v18h17', fill: '#fff', stroke: '#000', 'stroke-width': 3 }, doc);
      u.svg('path', { d: 'M12 27h17M12 36h39M12 42h39M12 48h39M12 54h39M12 60h39M12 66h39', fill: 'none', stroke: '#000', 'stroke-width': 2.5 }, doc);
      const source = u.el('div', 'overview-copy', overview);
      u.el('b', '', source, 'Numbers to click:');
      u.el('div', 'overview-range', source, 'All numbers are present below.');
      const aside = u.el('aside', 'aside', document.body);
      if (_c.display !== 'panel') {
        u.el('b', '', aside, 'Task Details');
        u.el('p', 'aside-copy', aside, 'Each number can be clicked once.');
      }
      Object.assign(_c, { body: _c.center, overview, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      // The original note sits in the board's empty top margin. Fit longer
      // instructions into that same space before the widget places its tiles.
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const boardInset = Math.max(116, Math.min(145, _c.H * 0.154));
        const bottom = _c.stage.getBoundingClientRect().top + boardInset - 4;
        const style = getComputedStyle(note);
        const twoLines = parseFloat(style.lineHeight) * 2 +
          parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        let size = parseFloat(style.fontSize);
        if (note.scrollHeight > twoLines + 1) {
          while (note.getBoundingClientRect().bottom > bottom && size > 14) {
            note.style.fontSize = --size + 'px';
          }
        }
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.overview.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
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
    name: 'design-read-figure-ascending-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#111'], LOW_ACCENTS: ['#111'], parts,
    },
  });
})();
