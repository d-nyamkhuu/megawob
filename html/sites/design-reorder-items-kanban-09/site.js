(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#0f2a52', muted: '#858e9c', line: '#173b68' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes fit in the activity pane's original note area.
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
      document.body.classList.add('design');
      const bar = u.el('div', 'topbar', document.body);
      u.el('div', 'brand', bar, 'Learning Hub');
      const nav = u.el('nav', 'topnav', bar);
      for (const name of ['Home', 'Activities', 'Help']) {
        const a = u.el('button', 'navlink' + (name === 'Activities' ? ' active' : ''), nav, name);
        a.type = 'button';
        a.onclick = () => env.log('nav', { name });
      }
      const shell = u.el('div', 'shell', document.body);
      const page = u.el('div', 'page', shell);
      const header = u.el('header', 'task-note', page);
      header.hidden = _c.display === 'hidden';
      if (_c.display === 'panel') header.classList.add('instruction-panel');
      if (_c.display === 'toast') header.classList.add('instruction-toast');
      const toolbar = u.el('div', 'header-tools', page);
      Object.assign(_c, { page, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.page.classList.toggle('has-header-end', !!_c.headerTools.children.length);
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
      _c.stage = _c.util.el('main', 'stage', _c.page);
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
      foot.classList.add('footer');
      _c.page.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
      const reset = _c.util.el('button', 'reset', foot, 'Reset');
      reset.type = 'button';
      reset.onclick = () => _c.stage.dispatchEvent(new Event('activity-reset'));
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
    name: 'design-reorder-items-kanban-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#17335f'],
      LOW_ACCENTS: ['#17335f'],
      parts
    }
  });
})();
