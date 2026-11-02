(function () {
  'use strict';
  const palette = {
    bg: '#3c281b', panel: '#f2eee3', fg: '#15110d',
    muted: '#5f6a78', line: '#bbb8ae',
  };
  const styleControls = (root, header) => {
    root.querySelectorAll('.ref-submit, .ref-float').forEach((el) => {
      el.classList.add('end-control');
      if (header) el.classList.add('header-end');
    });
    root.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('end-xtra'));
    root.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('end-link'));
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This shop has dedicated homes for all four instruction modes.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'twin instruction-' + _c.display;
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
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'MarketFind 2.1');
      const controls = u.el('div', 'window-controls', header);
      for (const glyph of ['−', '□', '×']) u.el('span', 'window-control', controls, glyph);
      const body = u.el('div', 'design-body', shell);
      const detail = u.el('aside', 'side-detail', body);
      u.el('h2', '', detail, 'Item Details');
      u.el('p', 'detail-empty', detail, 'Select a search result\nto view details.');
      Object.assign(_c, { shell, header, body, detail });
    },
    'frame.nav': () => (_c) => {
      _c.util.el('nav', 'design-nav', _c.header, 'File    Edit    View    Tools    Help');
    },
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.body });
      const note = _c.body.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
      }
      const spacer = _c.body.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('chrome-tools');
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.detail });
      const note = _c.detail.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'panel-instruction');
        note.dataset.role = 'instruction';
        _c.detail.insertBefore(note, _c.detail.firstChild);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
        _c.toast = note;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
      foot.querySelector('.ref-tools').classList.add('chrome-tools', 'footer-tools');
      if (_c.toast) foot.insertBefore(_c.toast, foot.firstChild);
      if (_c.ctx.finish) foot.classList.add('finish-mode');
      styleControls(foot, false);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock, false);
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
    name: 'design-use-shop-search-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#9d7628'], LOW_ACCENTS: ['#9d7628'], parts,
    },
  });
})();
