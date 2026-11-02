(function () {
  'use strict';
  const palette = {
    bg: '#285184', panel: '#ccccd2', fg: '#0a1038', muted: '#5f6a78', line: '#c8cdd5',
  };
  const D = {
    obstruction: [
      'World Explorer Updates',
      'Be the first to know. Get news, tips and updates for World Explorer.',
      'Close',
    ],
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated side card for panel and toast at every size.
      _c.display = _c.ctx.display || 'header';
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
      const shell = u.el('div', 'site-shell', document.body);
      const brand = u.el('header', 'design-header', shell);
      u.el('div', 'cd-globe', brand);
      u.el('div', 'design-brand', brand, 'World Explorer');
      u.el('div', 'design-nav', brand, 'CD-ROM COMPANION');
      const art = u.el('div', 'cd-art', shell);
      u.el('div', 'cd-sky', art);
      const tag = u.el('div', 'cd-tag', art);
      u.el('span', '', tag, 'Explore');
      u.el('span', '', tag, 'Learn');
      u.el('span', '', tag, 'Discover');
      const right = u.el('div', 'cd-right', shell);
      u.el('h2', 'cd-h', right, 'Activity');
      const actions = u.el('div', 'chrome-actions', right);
      const act = u.el('div', 'cd-activity', right);
      u.el('p', '', act, 'Ready.');
      u.el('p', '', act, 'Open folders to locate the file, then click it.');
      const header = u.el('section', 'task-note', shell);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('h2', '', header, 'Your Task');
      Object.assign(_c, { shell, right, actions, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      const panel = _c.right.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-note', 'episode-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Your Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-note', 'episode-toast');
        const title = _c.util.el('h3', '', null, 'Task notification');
        note.prepend(title);
        _c.right.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.right.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.hidden = !_c.ctx.finish;
      if (_c.ctx.finish) {
        text.classList.add('finish-mark');
        text.textContent = 'World Explorer • Ready';
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
    name: 'design-use-desktop-tools-tree-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#f5da48'], LOW_ACCENTS: ['#f5da48'], parts,
    },
  });
})();
