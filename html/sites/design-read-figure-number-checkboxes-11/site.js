(function () {
  'use strict';
  const palette = { bg: '#008080', panel: '#dededb', fg: '#080808', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      for (const display of ['header', 'panel', 'toast', 'hidden']) {
        document.body.classList.toggle('instruction-' + display, _c.display === display);
      }
      document.body.classList.add('win31', 'dialog');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desktop = u.el('div', 'desktop-icons', document.body);
      [
        ['▣', 'Program Manager'],
        ['▰', 'My Files'],
        ['▤', 'Notepad'],
        ['▱', 'Print Manager'],
        ['♲', 'Recycle Bin'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'desktop-icon', desktop);
        u.el('span', 'desktop-glyph', item, icon);
        u.el('span', '', item, label);
      });
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, fill: '#e2e2dc', stroke: '#111', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#101c8b', 'stroke-width': 1.5 }, icon);
      u.el('span', 'title-text', top, 'Pattern Painter');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'win-control', wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const menu = u.el('nav', 'menu', app);
      u.el('span', 'menu-label', menu, 'File    Edit    Options    Help');
      const toolbar = u.el('span', 'menu-tools', menu);
      const center = u.el('div', 'center', app);
      const bottom = u.el('footer', 'bottom', app);
      const taskbar = u.el('div', 'taskbar', document.body);
      u.el('button', 'start-button', taskbar, '▦ Start');
      u.el('span', 'taskbar-app', taskbar, '▣  Pattern Painter');
      u.el('span', 'taskbar-clock', taskbar, '◖))　10:24 AM');
      Object.assign(_c, { app, center, bottom, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
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
      _c.bottom.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'Ready' : '';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      if (ctx.kind === 'promo') {
        const title = u.el('div', 'tour-title', el);
        u.el('span', '', title, 'Welcome to Pattern Painter');
        const close = u.el('button', 'tour-close', title, '×');
        close.addEventListener('click', ctx.dismiss);
        const body = u.el('div', 'tour-body', el);
        u.el('span', 'tour-info', body, 'i');
        u.el('span', 'tour-copy', body, 'This short tour will show you how to complete a task.');
        const actions = u.el('div', 'tour-actions', body),
          next = u.el('button', 'tour-next', actions, 'Next >');
        next.addEventListener('click', ctx.dismiss);
        const dismiss = u.el('button', 'tour-skip', actions, 'Skip tour');
        dismiss.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const msgs = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, msgs[ctx.kind] || 'Welcome to Pattern Painter');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-number-checkboxes-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-read-figure-number-checkboxes-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
