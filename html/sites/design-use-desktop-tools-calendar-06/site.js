(function () {
  'use strict';
  const palette = {
    bg: '#fbfcfd', panel: '#f1f3f6', fg: '#1b1f24', muted: '#5f6a78', line: '#cfd3d8',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.documentElement.style.setProperty('--font', 'Helvetica,Arial,sans-serif');
      document.body.className = 'band instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      const br = u.el('div', 'design-brand', title);
      br.innerHTML =
        '<svg viewBox="0 0 34 34" width="34" height="34"><rect x="2" y="4" width="30" height="28" rx="3" fill="#dfe3e8"/><rect x="2" y="4" width="30" height="7" rx="3" fill="#aab2bb"/><path d="M9 2v6M25 2v6" stroke="#dfe3e8" stroke-width="3"/><g fill="#5d646c"><rect x="7" y="14" width="4" height="3"/><rect x="13" y="14" width="4" height="3"/><rect x="19" y="14" width="4" height="3"/><rect x="25" y="14" width="3" height="3"/><rect x="7" y="19" width="4" height="3"/><rect x="13" y="19" width="4" height="3"/><rect x="19" y="19" width="4" height="3"/><rect x="25" y="19" width="3" height="3"/><rect x="7" y="24" width="4" height="3"/><rect x="13" y="24" width="4" height="3"/><rect x="19" y="24" width="4" height="3"/></g></svg>';
      u.el('span', '', br, 'My Calendar');
      const nav = u.el('nav', 'design-nav', title);
      for (const t of ['Day', 'Week', 'Month', 'Calendar ▾']) u.el('span', '', nav, t);
      const toolbar = u.el('nav', 'design-util', title);
      for (const t of ['Settings', 'Help', 'Sign out']) u.el('span', '', toolbar, t);
      const noteSlot = u.el('div', 'note-slot');
      Object.assign(_c, { shell, toolbar, noteSlot, header: noteSlot });
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
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const band = u.el('div', 'band', body);
      const mc = u.el('div', 'band-cal', band);
      u.el('div', 'mc-date', mc, 'Tue, Apr 23, 2013');
      const mh = u.el('div', 'mc-head', mc);
      u.el('span', '', mh, '‹');
      u.el('b', '', mh, 'April 2013');
      u.el('span', '', mh, '›');
      const mg = u.el('div', 'mc-grid', mc);
      for (const d of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) u.el('b', '', mg, d);
      u.el('i', '', mg, '');
      for (let d = 1; d <= 30; d++) u.el('i', d === 23 ? 'sel' : '', mg, String(d));
      const te = u.el('div', 'band-ev', band);
      u.el('h3', '', te, "Today's Events");
      u.el('p', '', te, 'No events scheduled.');
      body.appendChild(_c.noteSlot);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const note = _c.noteSlot.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.noteSlot.appendChild(note);
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
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ['Calendar updates', 'Get calendar tips and updates for your workspace.', 'Close'];
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
    name: 'design-use-desktop-tools-calendar-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1f6fc6'], LOW_ACCENTS: ['#1f6fc6'], parts,
    },
  });
})();
