(function () {
  'use strict';
  const palette = { bg: '#9fbbe0', panel: '#ffffff', fg: '#0c2147', muted: '#5a6d8c', line: '#a9bad3' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'vista instruction-' + _c.display;
      const app = u.el('main', 'vwin', document.body);
      const title = u.el('header', 'vtitle', app);
      u.el('span', 'vicon', title);
      u.el('span', '', title, 'Color Match — Practice');
      const wc = u.el('div', 'vctl', title);
      u.el('i', 'vmin', wc);
      u.el('i', 'vmax', wc);
      u.el('i', 'vclose', wc, '✕');
      const menu = u.el('nav', 'vmenu', app);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const center = u.el('div', 'center');
      Object.assign(_c, { app, menu, center, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('brief');
        note.classList.toggle('vlong', note.textContent.length > 55);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('vtools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'vbody', _c.app);
      const idx = u.el('div', 'vindex', body);
      for (let i = 1; i <= 10; i++) u.el('span', i === 4 ? 'on' : '', idx, String(i));
      body.appendChild(_c.center);
      const side = u.el('aside', 'vside', body);
      const preview = u.el('div', 'vpreview', side);
      u.el('b', '', preview, '▶');
      u.el('span', '', preview, 'Preview');
      u.el('p', 'vnote', side, 'See a preview of the task\n(does not submit your answer).');
      const bottom = u.el('div', 'bottom', side);
      const status = u.el('div', 'vstatus', _c.app, 'Item 3 of 10');
      Object.assign(_c, { body, side, bottom, status });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) _c.side.insertBefore(panel, _c.bottom);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        const heading = _c.util.el('b', 'ref-note-title', null, 'Practice reminder');
        note.prepend(heading);
        _c.side.insertBefore(note, _c.bottom);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) (_c.placement === 'link' ? _c.status : _c.bottom).appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
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
    name: 'design-read-figure-color-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'templates/site/css/read-figure-color-278b54.css', 'vista.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-color-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f6fd0'],
      LOW_ACCENTS: ['#2f6fd0'],
      parts,
    },
  });
})();
