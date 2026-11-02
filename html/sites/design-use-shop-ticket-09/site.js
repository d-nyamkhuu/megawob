(function () {
  'use strict';
  const palette = { bg: '#d4d8de', panel: '#e4e7ec', fg: '#0c1420', muted: '#586270', line: '#9aa3af' };
  const D = { obstruction: null };
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
      document.documentElement.style.setProperty('--font', "Arial,'Liberation Sans',sans-serif");
      document.body.classList.add('qt-board', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'qt-title', header);
      const icon = u.el('span', 'qt-icon', tb);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" fill="#236493" stroke="#99c9e4"/><path d="M5 19V8l3-3 3 3v11M15 19V7l3-3 3 3v12M4 12h8M14 11h8" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 20l3-5M17 20l3-5" stroke="#a8dfed" stroke-width="2"/></svg>';
      u.el('span', 'design-brand', tb, 'Travel Finder – Train Tickets');
      const wc = u.el('span', 'window-controls', tb);
      for (const g of ['_', '□', '✕']) u.el('i', '', wc, g);
      const nav = u.el('nav', 'design-nav', header);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const s = u.el('span', '', nav);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      }
      const body = u.el('div', 'design-body', shell);
      const noteHost = u.el('div', 'note-host', body);
      Object.assign(_c, { shell, body, header: noteHost, menu: nav });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'food-task', 'display-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const tool = u.el('div', 'qt-tool', _c.body);
      for (const [l, v, k] of [
        ['From:', '', 'dd'],
        ['To:', '', 'dd'],
        ['Date:', 'All dates', 'cal'],
        ['Passengers:', '1', 'sp'],
      ]) {
        u.el('span', 'tl', tool, l);
        const f = u.el('span', 'tf ' + k, tool);
        u.el('span', 'field-value', f, v);
        f.dataset.field = l.slice(0, -1).toLowerCase();
        if (k === 'sp') {
          const arrows = u.el('i', 'spin-arrows', f);
          u.el('b', '', arrows, '▴');
          u.el('b', '', arrows, '▾');
        } else {
          const arrow = u.el('i', '', f, k === 'dd' ? '▾' : '');
          if (k === 'cal')
            arrow.innerHTML =
              '<svg viewBox="0 0 24 24" fill="none" stroke="#174b83" stroke-width="1.6"><rect x="3" y="4" width="18" height="17" fill="white"/><path d="M3 9h18M7 2v5M17 2v5M7 12h2m3 0h2m3 0h2M7 16h2m3 0h2m3 0h2"/></svg>';
        }
      }
      const sb = u.el('button', 'qt-search', tool, 'Search');
      sb.type = 'button';
      sb.addEventListener('click', () => env.log('decoy', { what: 'Search' }));
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note', 'display-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'display-toast');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      const status = footer.querySelector('.ref-foot-text');
      status.classList.add('footer-label');
      status.textContent = 'Options found.';
      const tools = footer.querySelector('.ref-tools');
      for (const [label, cls] of [['View Details', 'view-details'], ['Buy Ticket', 'buy-ticket']]) {
        const b = u.el('button', cls, null, label);
        b.type = 'button';
        if (cls === 'view-details') b.addEventListener('click', () => env.log('decoy', { what: label }));
        footer.insertBefore(b, tools);
      }
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
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
    name: 'design-use-shop-ticket-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#2c5aa8'], LOW_ACCENTS: ['#2c5aa8'], parts,
    },
  });
})();
