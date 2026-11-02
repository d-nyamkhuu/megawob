(function () {
  'use strict';
  const palette = { bg: '#aeb5c3', panel: '#b7bdca', fg: '#171b27', muted: '#414761', line: '#656c7c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desktop = u.el('div', 'irix-desktop', document.body);
      const menu = u.el('header', 'irix-menu', desktop);
      u.el('b', 'irix-wordmark', menu, 'IRIX');
      ['Session', 'Applications', 'Workspace', 'Help'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'irix-clock', menu, 'Mon Apr 21 10:14 AM  ◖))');
      const work = u.el('div', 'irix-work', desktop);
      const win = u.el('section', 'irix-window', work);
      const title = u.el('div', 'irix-window-title', win);
      u.el('span', 'irix-cube', title, '◈');
      u.el('b', '', title, 'System Access');
      const tools = u.el('div', 'irix-title-tools', title);
      u.el('span', 'irix-window-control', title, '⌑');
      const cols = u.el('div', 'irix-columns', win);
      const notes = u.el('aside', 'irix-notes', cols);
      notes.dataset.display = _c.display;
      if (_c.display === 'panel') notes.classList.add('irix-panel-note');
      Object.assign(_c, { desktop, cols, notes, tools, header: notes });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.cols; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
      const actions = _c.util.el('div', 'irix-actions', _c.notes);
      if (_c.display !== 'hidden' && _c.display !== 'toast') {
        _c.util.el('h3', '', actions, 'Actions:');
        _c.util.el('ol', '', actions).innerHTML =
          '<li>Enter the requested username.</li><li>Enter the password.</li><li>Click the in-app login button.</li>';
      } else actions.hidden = true;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.cols);
      _c.cols.insertBefore(_c.stage, _c.notes);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.notes.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const shelf = u.el('footer', 'irix-shelf', _c.desktop);
      ['Explorer', 'Files', 'Terminal', 'System', 'Print', 'Settings', 'Help'].forEach((name, i) => {
        const a = u.el('div', 'irix-app', shelf);
        u.el('span', 'irix-app-icon irix-i' + i, a, ['◉', '▱', '▣', '✚', '▤', '⚙', '?'][i]);
        u.el('span', '', a, name);
      });
      u.el('div', 'irix-shelf-sep', shelf);
      for (let i = 1; i <= 4; i++) {
        const a = u.el('div', 'irix-workspace' + (i === 1 ? ' active' : ''), shelf);
        u.el('span', '', a, '▣');
        u.el('small', '', a, 'Workspace ' + i);
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        if (_c.placement === 'link') _c.notes.appendChild(foot);
        else {
          shelf.appendChild(foot);
          if (foot.querySelector('.ref-tools').children.length) shelf.classList.add('irix-shelf-end');
        }
      }
      _c.shelf = shelf;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shelf.appendChild(dock);
        _c.shelf.classList.add('irix-shelf-end');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el(
        'section',
        `irix-overlay irix-overlay-${ctx.kind}${ctx.initial ? ' irix-initial' : ''}`,
        document.body,
      );
      el.dataset.role = 'overlay';
      const txt = {
        cookie: 'Cookies help keep your workstation preferences.',
        toast: 'Changes saved.',
        chat: 'Workstation assistance is available.',
        promo: 'Explore the latest workstation tools.',
        banner: 'System maintenance notice.',
      };
      u.el('div', 'irix-ov-title', el, ctx.initial ? 'Tip of the Day' : 'System Notice');
      if (ctx.initial) {
        const row = u.el('div', 'irix-tip-content', el);
        u.el('span', 'irix-bulb', row, '💡');
        const copy = u.el('div', '', row);
        u.el('b', '', copy, 'Did you know?');
        u.el('div', '', copy, 'You can switch between workspaces using Ctrl + F1 … F8.');
        const tick = u.el('div', 'irix-tip-check', el);
        u.el('span', '', tick, '☑');
        u.el('span', '', tick, 'Show tips at startup');
      } else u.el('div', '', el, txt[ctx.kind] || txt.toast);
      const b = u.el('button', '', el, 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-popup-08',
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'promo' },
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7771b6'],
      LOW_ACCENTS: ['#7771b6'],
      parts,
    },
  });
})();
