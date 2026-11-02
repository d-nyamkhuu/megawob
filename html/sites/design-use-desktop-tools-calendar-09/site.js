(function () {
  'use strict';
  const palette = { bg: '#9c9eb9', panel: '#a9abc4', fg: '#14142a', muted: '#34365a', line: '#6b6d8e' };
  // Match the original note's automatic type sizing in the fixed inspector card.
  function fitNote(note) {
    if (!note) return;
    const text = note.querySelector('.ref-panel-text, .ref-note-text') || note;
    const style = getComputedStyle(note);
    const available = note.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const range = document.createRange();
    range.selectNodeContents(text);
    let size = parseFloat(style.fontSize);
    while (available > 0 && range.getBoundingClientRect().height > available && size > 12) {
      note.style.fontSize = --size + 'px';
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This inspector accommodates all note modes at every viewport.
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
      document.documentElement.style.setProperty('--font', '"Arial Narrow","Helvetica Neue",Arial,sans-serif');
      document.documentElement.style.setProperty('--button-fg', '#fff');
      document.body.className = 'irix instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, 'IRIX');
      const nav = u.el('nav', 'design-nav', chrome);
      for (const t of ['File', 'Edit', 'View', 'Tools', 'Options', 'Help']) u.el('span', '', nav, t);
      u.el('div', 'irix-clock', chrome, 'Tue Apr 15  10:24 AM');
      const sgi = u.el('div', 'irix-sgi', chrome);
      sgi.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30"><g fill="none" stroke="#19192f" stroke-width="2.4" stroke-linejoin="round"><path d="M15 2L4 8l11 6zM18 2l10 6-10 6zM3 11v12l11-6zM29 11v12l-11-6zM4 26l11 5V19zM28 26l-10 5V19z"/><path d="M5 8l8 2M20 10l7-2M6 14v6M26 14v6M8 26l5 2M20 28l5-2"/></g></svg><i>Silicon Graphics</i>';
      const slot = u.el('div', 'instruction-slot');
      const toolbar = u.el('div', 'calendar-tools', shell);
      Object.assign(_c, { shell, toolbar, header: slot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.header);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      fitNote(_c.header.querySelector('.task-note'));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.header.appendChild(note);
        fitNote(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ['IRIX Workspace', 'Dismiss this notice to return to your workspace.', 'Close'];
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
    name: 'design-use-desktop-tools-calendar-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#7d74d4'], LOW_ACCENTS: ['#7d74d4'], parts,
    },
  });
})();
