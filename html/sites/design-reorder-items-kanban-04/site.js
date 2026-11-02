(function () {
  'use strict';
  const palette = { bg: '#eff2f6', panel: '#fff', fg: '#1f2d3d', muted: '#5d6b7a', line: '#cfd6de' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'breeze');
      const shell = u.el('div', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      const icon = u.el('span', 'app-icon', tb);
      icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="white"><path d="M10 5h2v6l5-6h3l-6 7 6 7h-3l-5-6v6h-2z"/><circle cx="6" cy="7" r="1.5"/><circle cx="5" cy="12" r="1.6"/><circle cx="6" cy="17" r="1.5"/><path d="M7 9h2v6H7z"/></g></svg>';
      u.el('span', 'app-title', tb, 'Card Sorter');
      const wc = u.el('span', 'win-ctl', tb);
      u.el('i', 'wc-min', wc); u.el('i', 'wc-max', wc); u.el('i', 'wc-close', wc, '✕');
      const menu = u.el('div', 'menubar', shell);
      for (const m of ['File', 'Edit', 'View', 'Help']) {
        const b = u.el('button', 'menu-item', menu, m);
        b.type = 'button';
        b.onclick = () => env.log('menu', { name: m });
      }
      const page = u.el('div', 'page');
      page.classList.toggle('has-panel', _c.display === 'panel');
      Object.assign(_c, { shell, page, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.page;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'win-body', _c.shell);
      const idx = u.el('nav', 'side-index', body);
      for (let i = 1; i <= 20; i++) u.el('div', 'idx' + (i === 1 ? ' active' : ''), idx, String(i));
      body.appendChild(_c.page);
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.page.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.page.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('sheet-status');
      status.textContent = 'Card Sorter';
      status.hidden = !_c.ctx.finish && _c.placement !== 'header' && _c.placement !== 'icon';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el('p', '', box, ctx.kind === 'cookie' ? 'Allow optional cookies for this page?' : 'You can close this note to return to the activity.');
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
  };
  env.site({
    name: 'design-reorder-items-kanban-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3d8ee6'],
      LOW_ACCENTS: ['#3d8ee6'],
      parts
    }
  });
})();
