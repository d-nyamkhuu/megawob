(function () {
  'use strict';
  const palette = { bg: '#b8b8b8', panel: '#c5c5c5', fg: '#111', muted: '#444', line: '#777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'monospace');
      for (const mode of ['header', 'panel', 'toast', 'hidden']) {
        document.body.classList.remove('instruction-' + mode);
      }
      document.body.classList.add('amiga', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const menu = u.el('header', 'workbench-menu', shell);
      u.el('span', 'amiga-mark', menu, '◢');
      u.el('b', 'workbench-name', menu, 'Amiga Workbench');
      u.el('span', 'menu-words', menu, 'File　 Edit　 View　 Shop　 Help');
      u.el('span', 'workbench-clock', menu, 'Mon 14 Apr 1997　10:24');
      u.el('span', 'screen-gadget', menu, '▣');
      const title = u.el('div', 'window-title', shell);
      u.el('span', 'window-icon', title, '▣');
      u.el('b', 'window-name', title, 'Shop');
      const actions = u.el('div', 'window-actions', title);
      for (const sym of ['−', '□', '×']) u.el('span', 'window-gadget', title, sym);
      const main = u.el('main', 'workbench-main');
      Object.assign(_c, { shell, actions, main, header: main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note', 'food-task');
        note.dataset.role = 'instruction';
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const row = u.el('div', 'workbench-row', _c.shell);
      const rail = u.el('nav', 'workbench-rail', row);
      [
        ['⌂', 'Home'], ['⌕', 'Search'], ['▣', 'Clothing'],
        ['◢', 'Shoes'], ['▣', 'Bag'], ['▤', 'Orders'],
      ].forEach(([i, n], k) => {
        const e = u.el('div', 'rail-item' + (k === 2 ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', e, i);
        u.el('span', '', e, n);
      });
      row.appendChild(_c.main);
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.dataset.role = 'instruction';
        panel.querySelector('.ref-panel-text').classList.add('food-task');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.main.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.shell.classList.add('has-foot');
        _c.shell.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Shop · Ready';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const copy = {
        cookie: ['Cookie notice', 'Optional cookies are used for this shop.', 'Dismiss'],
        toast: ['Notice', 'The shop is ready.', 'Dismiss'],
        chat: ['Help', 'Need help with your order?', 'Close'],
        promo: ['Shop bulletin', 'See the latest offers.', 'Close'],
        banner: ['Announcement', 'Shop information for today.', 'Dismiss'],
      };
      const [h, t, b] = copy[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, h);
      u.el('div', 'overlay-copy', el, t);
      const actions = u.el('div', 'overlay-actions', el);
      const d = u.el('button', 'primary', actions, b);
      d.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: d };
    },
  };
  env.site({
    name: 'design-use-shop-variantpick-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-variantpick-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f39200'],
      LOW_ACCENTS: ['#f39200'],
      parts,
    },
  });
})();
