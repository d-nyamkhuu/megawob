(function () {
  'use strict';
  const palette = { bg: '#318137', panel: '#e8e8e8', fg: '#090909', muted: '#222222', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The desktop has its own note locations, including on compact screens.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const b = document.body;
      b.classList.add('gem-desktop');
      const menu = u.el('header', 'gem-menu', b);
      ['Desk', 'File', 'View', 'Options'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'gem-date', menu, 'Mon  Apr 14  1986   10:24');
      const icons = u.el('aside', 'gem-icons', b);
      [
        ['▣', 'FLOPPY DISK'],
        ['▱', 'DOCUMENTS'],
        ['▱', 'GAMES'],
      ].forEach((x) => {
        const i = u.el('div', 'gem-icon', icons);
        u.el('b', '', i, x[0]);
        u.el('small', '', i, x[1]);
      });
      const trash = u.el('div', 'gem-trash', b);
      u.el('b', '', trash, '▤');
      u.el('small', '', trash, 'TRASH');
      const win = u.el('section', 'gem-window', b);
      const title = u.el('div', 'gem-titlebar', win);
      u.el('span', 'gem-gadget', title, '−');
      u.el('strong', '', title, 'Shape Clicker');
      u.el('span', 'gem-gadget', title, '×');
      u.el('div', 'gem-announcement-space', win);
      const toolbar = u.el('div', 'gem-toolbar', win);
      Object.assign(_c, { win, toolbar, header: win });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'gem-stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.win.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('gem-foot');
      _c.win.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('gem-foot-note');
      text.textContent = 'Shape Clicker';
      foot.insertBefore(_c.toolbar, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'gem-announcement', document.body);
      el.dataset.role = 'overlay';
      u.el('div', 'gem-info-icon', el, 'i');
      const copy = u.el('div', 'gem-announcement-copy', el);
      u.el('h2', '', copy, 'System Maintenance Today');
      u.el('p', '', copy, 'The system will be updated later this morning.');
      u.el('p', '', copy, 'You can continue using this application.');
      const dismiss = u.el('button', 'gem-collapse', el, 'Collapse');
      dismiss.setAttribute('aria-label', 'Collapse announcement');
      dismiss.addEventListener('click', () => {
        ctx.dismiss('close');
      });
      return { el, dismiss, ttlSteps: 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-moving-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-act-in-time-moving-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c8c8c8'],
      LOW_ACCENTS: ['#c8c8c8'],
      parts,
    },
  });
})();
