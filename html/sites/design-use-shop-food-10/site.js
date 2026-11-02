(function () {
  'use strict';
  const palette = { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('side-left', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const titlebar = u.el('header', 'design-header', shell);
      const icon = u.el('div', 'sun-symbol', titlebar);
      icon.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="2" y="2" width="16" height="16"/><path d="M2 6h16M5 4h1m2 0h1m2 0h1M5 9h10v6H5z"/></svg>';
      u.el('div', 'design-brand', titlebar, 'GoodBite Kitchen');
      const toolbar = u.el('div', 'chrome-tools', titlebar);
      const controls = u.el('div', 'window-controls', titlebar);
      for (const [cls, path] of [
        ['min', 'M4 10h16'], ['max', 'M5 4h14v14H5z'], ['close', 'M5 4l14 14M19 4L5 18'],
      ]) {
        const c = u.el('span', cls, controls);
        c.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="' + path + '"/></svg>';
      }
      const tools = u.el('div', 'tool-col', shell);
      for (const l of ['Food', 'Favourites', 'Settings']) {
        const t = u.el('div', 'tool-item' + (l === 'Food' ? ' on' : ''), tools);
        const gi = u.el('div', 'tool-g', t);
        gi.innerHTML = l === 'Food'
          ? '<svg viewBox="0 0 32 40" fill="currentColor"><path d="M5 2h2v10h2V2h2v10h2V2h2v13l-4 4v19H7V19l-4-4V2zm20 0h3v36h-5V23h-3V12c0-6 2-10 5-10z"/></svg>'
          : l === 'Favourites'
            ? '<svg viewBox="0 0 32 40" fill="currentColor"><path d="M16 32C-8 16 2 0 16 11 30 0 40 16 16 32z"/></svg>'
            : '<svg viewBox="0 0 32 40" fill="currentColor"><path d="M13 4h6l1 5 4 2 4-2 3 5-4 3v5l4 3-3 5-4-2-4 2-1 5h-6l-1-5-4-2-4 2-3-5 4-3v-5l-4-3 3-5 4 2 4-2z"/><circle cx="16" cy="20" r="5" fill="#304451"/></svg>';
        u.el('div', 'tool-l', t, l);
      }
      const nav = u.el('nav', 'design-nav', titlebar, 'File    Edit    View    Options    Help');
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const note = u.el('section', 'task-note');
      if (_c.display === 'header') u.el('h2', '', note, 'Your task:');
      Object.assign(_c, { shell, titlebar, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.append(_c.header);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Your task:';
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('food-task');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.append(note);
        note.querySelector('.ref-note-text').classList.add('food-task');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.toolbar.append(foot);
      if (_c.placement === 'footer' || _c.placement === 'link') _c.submit.classList.add('end-control');
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      const clear = _c.util.el('button', 'clear-basket', footer, '↶  Clear basket');
      clear.type = 'button';
      _c.util.el('div', 'order-slot', footer);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        dock.classList.add('end-control');
        _c.toolbar.append(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = null;
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
    name: 'design-use-shop-food-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#88a9cd'], LOW_ACCENTS: ['#88a9cd'], parts,
    },
  });
})();
