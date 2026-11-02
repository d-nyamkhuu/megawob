(function () {
  'use strict';
  const palette = { bg: '#d9e7f5', panel: '#f8fbff', fg: '#072c60', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses its right-hand card at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'bottom instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, '▣  Social Task Manager');
      u.el('div', 'window-controls', chrome, '−  □  ×');
      u.el('nav', 'design-nav', chrome, 'Home    View    Tools    Help');
      const note = u.el('section', 'task-note');
      u.el('h2', '', note, 'Your Task');
      note.hidden = _c.display !== 'header';
      const lower = u.el('section', 'office-lower');
      const right = u.el('div', 'office-reminder-side', lower);
      const reminder = u.el('div', 'office-reminder', right);
      reminder.hidden = !['panel', 'toast'].includes(_c.display);
      const actionbar = u.el('div', 'office-final-actions', right);
      Object.assign(_c, { shell, note, lower, right, reminder, actionbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.note.querySelector('.ref-instruction');
      if (note) note.dataset.display = _c.display;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actionbar;
      base(_c);
      _c.header = header;
      if (_c.submit) {
        if (_c.display === 'header') {
          _c.submit.classList.add('banner-end');
          _c.note.appendChild(_c.submit);
        } else {
          const toolbar = _c.util.el('div', 'chrome-end-toolbar');
          _c.util.el('span', '', toolbar, 'Practice task');
          toolbar.appendChild(_c.submit);
          _c.toolbar = toolbar;
        }
      }
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.append(_c.note, _c.lower);
      if (_c.toolbar) body.appendChild(_c.toolbar);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.reminder;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.reminder.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        const status = foot.querySelector('.ref-foot-text');
        if (status) status.textContent = 'Ready';
        _c.actionbar.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actionbar.appendChild(dock);
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
    name: 'design-use-social-feed-menu-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2858cf'],
      LOW_ACCENTS: ['#2858cf'],
      parts,
    },
  });
})();
