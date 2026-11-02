(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-food-08',
    brand: 'Harbor Grille',
    nav: 'Good Food. Simple Times.',
    obstruction: null,
  };
  const palette = { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const requested = _c.ctx.display || 'header';
      _c.display = (_c.W < 1260 || _c.H < 700) && ['panel', 'toast'].includes(requested) ? 'header' : requested;
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const shell = u.el('div', 'site-shell', document.body);
      shell.dataset.note = _c.display;
      shell.dataset.end = _c.placement || 'none';
      const brand = u.el('header', 'design-header', shell);
      const fork = u.el('div', 'sun-symbol', brand);
      fork.innerHTML = '<svg viewBox="0 0 30 80" fill="none" stroke="#d8eafa" stroke-width="4" stroke-linecap="round"><path d="M5 3v24q0 12 10 12t10-12V3M12 3v25M19 3v25M15 39v38"/></svg>';
      u.el('div', 'design-brand', brand, D.brand);
      u.el('div', 'window-controls', brand, '−  ×');
      const nav = u.el('nav', 'design-nav', brand, D.nav);
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const header = u.el('section', 'task-note');
      header.hidden = _c.display === 'hidden';
      const toolbar = u.el('div', 'notebook-toolbar', shell);
      Object.assign(_c, { shell, header, toolbar });
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
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      const rings = _c.util.el('div', 'binder-rings', body);
      for (let i = 0; i < 12; i++) _c.util.el('i', 'binder-ring', rings);
      body.appendChild(_c.header);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
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
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      const clear = _c.util.el('button', 'clear-basket', footer, '↶  Clear basket');
      clear.type = 'button';
      _c.util.el('div', 'order-slot', footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
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
      THEMES: { 'design-use-shop-food-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#88a9cd'],
      LOW_ACCENTS: ['#88a9cd'],
      parts,
    },
  });
})();
