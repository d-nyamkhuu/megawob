(function () {
  'use strict';
  const palette = { bg: '#241c34', panel: '#2d2440', fg: '#f1eaf5', muted: '#a79bb8', line: '#3f3555' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'precision');
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('div', 'titlebar', shell);
      const menu = u.el('span', 'tb-menu', bar);
      menu.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M15 2H3L1 4v1M2 8h13M1 11v1l2 2h12" fill="none" stroke="#e8e0ee" stroke-width="1.2"/></svg>';
      u.el('span', 'tb-title', bar, 'Card Sort');
      const ctl = u.el('span', 'tb-ctl', bar);
      ctl.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 8h12" stroke="#e8e0ee"/></svg><svg viewBox="0 0 16 16" width="16" height="16"><rect x="2.5" y="2.5" width="11" height="11" fill="none" stroke="#e8e0ee"/></svg><svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 2l12 12M14 2L2 14" stroke="#e8e0ee"/></svg>';
      const page = u.el('div', 'page', shell);
      const header = u.el('header', 'task-note', page);
      header.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, bar, ctl, page, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const side = _c.util.el('div', 'note-side', _c.header);
      _c.util.el('span', 'note-count', side, 'cards');
      _c.util.el('span', 'note-hint', side, 'Drag the cards into the correct columns below.');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
      _c.bar.insertBefore(_c.headerTools, _c.ctl);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) _c.header.prepend(panel);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.prepend(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.page);
      const reset = u.el('button', 'reset', footer);
      reset.type = 'button';
      reset.innerHTML =
        '<svg viewBox="0 0 20 20" width="22" height="22"><path d="M4 10a6 6 0 1 0 2-4.5M4 3v3.5h3.5" fill="none" stroke="#f1eaf5" stroke-width="1.5"/></svg><span>Reset</span>';
      reset.onclick = () => env.log('reset-click', {});
      footer.appendChild(document.body.querySelector('.ref-foot'));
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
        promo: 'News',
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
    name: 'design-reorder-items-kanban-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f26a6a'],
      LOW_ACCENTS: ['#f26a6a'],
      parts,
    },
  });
})();
