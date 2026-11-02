(function () {
  'use strict';
  const palette = { bg: '#122b3d', panel: '#163245', fg: '#d3e9fc', muted: '#a5c0d3', line: '#3d5c70' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This desktop reserves a note row in all visible instruction modes.
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
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      document.body.className = 'rail instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', title, 'RouteFinder 2014 – Bus Tickets');
      brand.insertAdjacentHTML('afterbegin', '<svg class="brand-bus" viewBox="0 0 24 28" aria-hidden="true"><rect x="2" y="1" width="20" height="23" rx="4" fill="#39789f" stroke="#215472"/><rect x="5" y="4" width="14" height="10" rx="1" fill="#d4eafa"/><rect x="5" y="18" width="5" height="2" fill="#d4eafa"/><rect x="16" y="18" width="3" height="2" fill="#d4eafa"/><path d="M5 24v2m14-2v2" stroke="#215472" stroke-width="3"/></svg>');
      const controls = u.el('div', 'window-controls', title);
      for (const [cls, label] of [['minimize', '−'], ['maximize', '□'], ['close', '×']]) u.el('span', cls, controls, label);
      const noteSlot = u.el('section', 'task-slot');
      noteSlot.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, title, noteSlot, header: noteSlot });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'design-nav', _c.title);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const item = u.el('span', '', menu);
        u.el('u', '', item, label[0]);
        item.append(label.slice(1));
      }
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      body.appendChild(_c.noteSlot);
      const rail = u.el('nav', 'command-rail', body);
      for (const name of ['Search', 'Tickets', 'Passengers', 'Payment', 'Confirmation']) {
        const IC = {
          'Search': '<circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13.5 13.5L19 19" stroke="currentColor" stroke-width="2.2"/>',
          'Tickets': '<path d="M3 14L14 3l2 2c-1 1-1 3 0 4s3 1 4 0l2 2L11 22l-2-2c1-1 1-3 0-4s-3-1-4 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
          'Passengers': '<circle cx="8" cy="7" r="3.2" fill="currentColor"/><path d="M2 18c0-4 3-6 6-6s6 2 6 6z" fill="currentColor"/><circle cx="15" cy="8" r="2.5" fill="currentColor"/><path d="M15 12c3 0 5 2 5 5h-4z" fill="currentColor"/>',
          'Payment': '<rect x="2" y="4" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="8" width="18" height="3" fill="currentColor"/>',
          'Confirmation': '<circle cx="11" cy="11" r="9" fill="currentColor"/><path d="M6.5 11.5l3 3 6-6.5" fill="none" stroke="#163245" stroke-width="2.2"/>',
        }[name];
        const b = u.el('button', 'command-item', rail);
        b.innerHTML = '<svg viewBox="0 0 22 22" width="26" height="26" style="vertical-align:middle;margin-right:16px">' + IC + '</svg>' + name;
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: name }));
      }
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const note = _c.noteSlot.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'panel-note');
        note.querySelector('.ref-panel-title').textContent = 'Task note';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'toast-note');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const label = foot.querySelector('.ref-foot-text');
      label.classList.add('footer-label');
      label.textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-use-shop-ticket-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-ticket-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7eb7df'],
      LOW_ACCENTS: ['#7eb7df'],
      parts,
    },
  });
})();
