(function () {
  'use strict';
  const palette = { bg: '#e4e2dc', panel: '#e8e6e1', fg: '#111', muted: '#111', line: '#9a9a96' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'beos');
      const shell = u.el('div', 'shell', document.body);
      const tbar = u.el('div', 'titlebar', shell);
      const leaf = u.el('span', 'leaf', tbar);
      leaf.innerHTML =
        '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M18 2l3 3 3 1-1 5c1 4-2 8-6 11-4 4-9 4-12 1-3-3-2-8 1-11l7-6 3-1z" fill="#d1a84d" stroke="#242818" stroke-width="1.5"/><path d="M6 17c2-4 6-7 10-9l3-3" fill="none" stroke="#ffe895" stroke-width="2"/><path d="M8 24c5 0 12-5 14-11" fill="none" stroke="#8a762b" stroke-width="2"/></svg>';
      u.el('span', 'ttl', tbar, 'Card Sorter');
      const wb = u.el('span', 'wbtns', tbar);
      for (const g of ['minimize', 'maximize', 'close']) u.el('span', 'wbtn ' + g, wb);
      const mbar = u.el('div', 'menubar', shell);
      for (const m of ['File', 'View', 'Options', 'Help']) u.el('span', 'mi', mbar, m);
      u.el('span', 'mspacer', mbar);
      u.el('span', 'beos-mark', mbar, 'BeOS');
      u.el('span', 'clock', mbar, '9:14 AM');
      const page = u.el('div', 'page', shell);
      const noteHost = u.el('div', 'note-host', page);
      Object.assign(_c, { shell, mbar, page, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.mbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (!foot) return;
      foot.querySelector('.ref-foot-text').remove();
      if (_c.placement === 'footer' || _c.placement === 'link') {
        _c.shell.appendChild(foot);
      } else {
        _c.mbar.appendChild(foot.querySelector('.ref-tools'));
        foot.remove();
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (!dock) return;
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.shell);
      u.el('div', 'ap-title', footer, 'View');
      const sv = u.el('button', 'saveview', footer, 'Save view');
      sv.type = 'button';
      sv.onclick = () => env.log('save-view', {});
      u.el('div', 'ap-rule', footer);
      footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-reorder-items-kanban-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#777'],
      LOW_ACCENTS: ['#777'],
      parts,
    },
  });
})();
