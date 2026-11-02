(function () {
  'use strict';
  const palette = { bg: '#eeeeeb', panel: '#ffffff', fg: '#171b23', muted: '#626675', line: '#d1cec5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame keeps its note pane even at the smallest viewport.
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
      document.documentElement.style.setProperty('--font', 'monospace');
      document.body.className = 'side-right instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'nb-logo', header);
      logo.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#f78008" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
      u.el('div', 'design-brand', header, 'Notebook');
      const nav = u.el('nav', 'design-nav', header);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Window', 'Help']) u.el('span', '', nav, t);
      const wc = u.el('div', 'nb-wc', header);
      wc.innerHTML = '<svg viewBox="0 0 20 20" width="20" height="20" stroke="#ddd" stroke-width="1.6" fill="none"><path d="M3 10h14"/></svg><svg viewBox="0 0 20 20" width="20" height="20" stroke="#ddd" stroke-width="1.6" fill="none"><rect x="3.5" y="3.5" width="13" height="13"/></svg><svg viewBox="0 0 20 20" width="20" height="20" stroke="#ddd" stroke-width="1.6" fill="none"><path d="M3.5 3.5l13 13M16.5 3.5l-13 13"/></svg>';
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const sb = u.el('aside', 'nb-side', _c.shell);
      const icons = {
        c: '<rect x="3.5" y="5" width="15" height="13" rx="2"/><path d="M3.5 9h15M8 3v4M14 3v4"/>',
        n: '<path d="M5 2.5h7l3.5 3.5v11.5H5z"/>',
        t: '<rect x="3.5" y="3.5" width="14" height="14" rx="2"/><path d="M7 10.5l2.5 2.5L14 8"/>',
        s: '<circle cx="9" cy="9" r="6"/><path d="M13.5 13.5L18 18"/>',
      };
      [['c', 'Calendar', 1], ['n', 'Notes'], ['t', 'Tasks'], ['s', 'Search']].forEach(([k, t, on]) => {
        const it = u.el('div', 'nb-item' + (on ? ' on' : ''), sb);
        const ic = u.el('span', '', it);
        ic.innerHTML = '<svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="#666" stroke-width="1.4">' + icons[k] + '</svg>';
        u.el('span', '', it, t);
      });
      u.el('hr', '', sb);
      u.el('div', 'nb-cal-h', sb, 'My Calendars');
      [['Personal', 1], ['Work', 0]].forEach(([t, on]) => {
        const it = u.el('div', 'nb-check' + (on ? ' on' : ''), sb);
        u.el('i', '', it);
        u.el('span', '', it, t);
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        const title = panel.querySelector('.ref-panel-title');
        title.innerHTML = '<svg viewBox="0 0 20 20" width="22" height="22"><path d="M11 2l7 7-2 1-3-1-3 3 .5 4-1.5 1-3.5-3.5L1 18l-.5-.5 4.5-5.5L1.500 8.500 3 7l4 .5 3-3-1-3z" fill="#f56a0d"/></svg><span>Task</span>';
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
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = 'Ready';
      text.classList.add('footer-label');
      _c.foot = foot;
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
    name: 'design-use-desktop-tools-calendar-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#f78008'],
      LOW_ACCENTS: ['#f78008'],
      parts,
    },
  });
})();
