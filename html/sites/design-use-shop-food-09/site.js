(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-food-09',
    brand: 'GoodBite',
    tagline: 'Fresh Food, Great Choices',
    obstruction: null,
  };
  const palette = { bg: '#f8fbff', panel: '#ffffff', fg: '#0b2a73', muted: '#4a5568', line: '#bfd6ea' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const toolbar = u.el('header', 'design-header', shell);
      const logo = u.el('div', 'gb-logo', toolbar);
      logo.innerHTML =
        '<svg viewBox="0 0 40 40" width="38" height="38"><path d="M6 36C4 18 14 5 36 3C37 22 27 34 8 35Z" fill="#56a833" stroke="#3d8a1f" stroke-width="1.5"/><path d="M6 36C14 24 22 14 33 7" stroke="#e8f5d8" stroke-width="1.6" fill="none"/></svg>';
      u.el('div', 'design-brand', toolbar, D.brand);
      u.el('div', 'gb-tag', toolbar, D.tagline);
      const nav = u.el('nav', 'design-nav', toolbar);
      for (const label of ['Menu', 'Specials', 'About', 'Help']) {
        const b = u.el('button', 'header-tab', nav, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const sb = u.el('div', 'gb-search', toolbar);
      const si = u.el('input', '', sb);
      si.type = 'text';
      si.placeholder = 'Search menu...';
      const sg = u.el('span', 'gb-sg', sb);
      sg.innerHTML =
        '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#223" stroke-width="2"/><path d="M12 12L18 18" stroke="#223" stroke-width="2.4"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden' || _c.display === 'toast';
      Object.assign(_c, { shell, toolbar, search: sb, body, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.search.hidden = true;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) note.classList.add('food-task');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note');
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.textContent = 'Ready';
      status.hidden = true;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-food-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3d86c6'],
      LOW_ACCENTS: ['#3d86c6'],
      parts,
    },
  });
})();
