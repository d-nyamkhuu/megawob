(function () {
  'use strict';
  const palette = {
    bg: '#0a50d8', panel: '#f1efe6', fg: '#0a1470',
    muted: '#3a4a80', line: '#a9c0e0',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have a reserved band in the original calendar frame.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'top instruction-' + _c.display;
      _c.root.style.setProperty('--font', 'Tahoma,Verdana,Arial,sans-serif');
      _c.root.style.setProperty('--button-fg', '#000');
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
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', title, 'Calendar');
      u.el('nav', 'design-nav', title);
      const toolbar = u.el('div', 'chrome-tools', title);
      const wb = u.el('div', 'xp-btns', title);
      u.el('i', 'xp-min', wb);
      u.el('i', 'xp-max', wb);
      u.el('i', 'xp-close', wb);
      const noteHost = u.el('div', 'calendar-note-host', shell);
      Object.assign(_c, { shell, toolbar, noteHost, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteHost.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = _c.util.el('p', '', null);
        while (note.firstChild) text.appendChild(note.firstChild);
        note.appendChild(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const panel = _c.noteHost.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        const heading = panel.querySelector('.ref-panel-title');
        heading.classList.add('note-heading');
        heading.textContent = 'Task details';
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
        _c.noteHost.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      const label = foot.querySelector('.ref-foot-text');
      label.classList.add('footer-label');
      label.textContent = 'Ready';
      _c.shell.appendChild(foot);
      // Extra toolbar actions belong in the title bar, outside the event form.
      for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(button);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
        texts = {
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
    name: 'design-use-desktop-tools-calendar-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#2a62d8'], LOW_ACCENTS: ['#2a62d8'], parts,
    },
  });
})();
