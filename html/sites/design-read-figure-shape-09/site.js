(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#666666', line: '#bbbbbb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original ledger has room for all note modes in its dedicated sidebar.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ledger-page instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const left = u.el('div', 'left', app);
      const h1 = u.el('h1', '', left);
      const link = (parent, text) => {
        const a = u.el('a', '', parent, text);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { label: text }); });
        return a;
      };
      link(h1, 'Shape Ledger');
      const aside = u.el('aside', 'aside', app);
      const note = u.el('section', 'task-note', aside);
      if (_c.display !== 'hidden') link(u.el('h2', '', note), 'Task');
      else note.hidden = true;
      Object.assign(_c, { app, left, aside, header: note, link });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const u = _c.util;
      _c.link(u.el('h3', '', _c.aside), 'Controls');
      u.el('p', 'hint', _c.aside, 'You can click a shape in the ledger.');
      const row = u.el('div', 'btnrow', _c.aside);
      u.el('span', 'clear-slot', row);
      const header = _c.header;
      _c.header = row;
      base(_c);
      _c.header = header;
      _c.row = row;
    },
    'frame.body': () => (_c) => { _c.body = _c.app; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const u = _c.util;
      _c.link(u.el('h3', 'links-h', _c.aside), 'Links');
      const ul = u.el('ul', '', _c.aside);
      ['Help', 'Instructions', 'Reset Task'].forEach((t) => _c.link(u.el('li', '', ul), t));
      const pv = u.el('div', 'preview', _c.aside);
      _c.link(u.el('div', 'pv-head', pv), 'Preview');
      u.el('div', 'pv-body', pv, 'No item selected.');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.left); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.aside.appendChild(foot);
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
    name: 'design-read-figure-shape-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000ee'],
      LOW_ACCENTS: ['#0000ee'],
      parts,
    },
  });
})();
