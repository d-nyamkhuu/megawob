(function () {
  'use strict';
  const palette = { bg: '#e6e7ff', panel: '#f7faff', fg: '#202636', muted: '#5f6a78', line: '#c8cdd5' };
  const D = { obstruction: null };
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
      const shell = u.el('div', 'site-shell tm-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'tm-appicon', title, '>_');
      u.el('div', 'design-brand', title, 'Terminal Task');
      const toolbar = u.el('div', 'tm-header-tools', title);
      const wc = u.el('div', 'tm-wc', title);
      ['min', 'max', 'close'].forEach((t) => u.el('span', 'tm-wb tm-' + t, wc));
      const left = u.el('div', 'tm-left');
      Object.assign(_c, { shell, toolbar, left, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        note.prepend(_c.util.el('span', 'tm-fileicon'));
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body tm-body', _c.shell);
      body.appendChild(_c.left);
      const side = u.el('aside', 'tm-side', body);
      u.el('h2', '', side, 'Task Details');
      Object.assign(_c, { body, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').textContent = 'Goal';
        panel.querySelector('.ref-panel-text').classList.add('tm-box', 'tm-goal');
      }
      const u = _c.util, side = _c.side;
      u.el('h3', '', side, 'Current Directory');
      u.el('div', 'tm-box tm-mono tm-directory', side, '/home/user');
      u.el('h3', '', side, 'Helpful Commands');
      const hc = u.el('div', 'tm-box tm-mono tm-cmds', side);
      [['ls', '# list files'], ['rm', '# remove a file'], ['pwd', '# print working directory'], ['cd', '# change directory']].forEach((r) => {
        const row = u.el('div', '', hc);
        u.el('b', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      u.el('h2', 'tm-app', side, 'Appearance');
      [['Theme', 'Dark'], ['Font Size', '14 px']].forEach((r) => {
        const row = u.el('div', 'tm-row', side);
        u.el('span', '', row, r[0]);
        u.el('span', 'tm-sel', row, r[1]);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note');
        note.prepend(_c.util.el('span', 'tm-fileicon'));
        _c.left.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.side.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const dismissOverlay = () => {
        ctx.dismiss();
        const command = document.querySelector('input[aria-label="command line"]');
        if (command && command.value) command.focus({ preventScroll: true });
      };
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
        accept.addEventListener('click', () => dismissOverlay());
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
      dismiss.addEventListener('click', () => dismissOverlay());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-desktop-tools-terminal-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#8572f4'], LOW_ACCENTS: ['#8572f4'], parts,
    },
  });
})();
