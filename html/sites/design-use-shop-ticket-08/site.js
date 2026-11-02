(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-08',
    'obstruction': null,
    'tokens': {
      'bg': '#b9bbbb',
      'panel': '#e7e7e9',
      'fg': '#111',
      'accent': '#008f9f',
      'font': "'Liberation Mono','Courier New',monospace",
      'line': '#a8a9af',
      'muted': '#4a4a4a',
    },
    'tabs': ['Tickets', 'Itinerary', 'Travel Info', 'Preferences', 'Notes'],
  };
  const TAB_ICONS = [
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8" stroke-linejoin="round"><path d="M2 18L18 2l5 1 2 5 5 2-1 5-16 16-4-5-5-2z"/><path d="M7 18L19 6l7 7-13 13z"/><path d="M11 18l7-7 4 3-7 7z"/><path d="M15 16l3-3"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><path d="M6 2h21v28H6zM3 4v26M10 5h3v3h-3zM10 11h3v3h-3zM10 17h3v3h-3zM10 23h3v3h-3z"/><path d="M16 6h8M16 12h8M16 18h8M16 24h8"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.5"><circle cx="16" cy="16" r="14"/><path fill="#111" d="M5 9l6-6 5 2-3 5 3 4-4 4 1 8-5-3-2-5-3-3zM21 4l6 5-4 2-1 4 4 2-3 8-3 3-2-8-4-3 3-5 4-1z"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8" stroke-linejoin="round"><path d="M3 26l15-15a9 9 0 0 1 9-10l-4 5 3 4 5-2a9 9 0 0 1-11 9L7 30z"/><circle cx="6" cy="26" r="1"/></svg>',
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><path d="M6 2h20l3 4v24H6zM3 4v26M23 2v5h6M10 6h3v3h-3zM10 12h3v3h-3zM10 18h3v3h-3zM10 24h3v3h-3z"/><path d="M16 7h7M16 13h9M16 19h9M16 25h9"/></svg>',
  ];
  const APP_ICON =
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"><path d="M4 5l19-3 5 21-7 6-16-4z"/><path d="M9 3l16 4-3 22-15-3z"/><path d="M12 8v12l4 2 4-3V9l-4-2zM8 23l8 3M24 22l4-2"/><path d="M14 10v8M18 11v5" stroke-width="1"/></svg>';
  const PRINT_ICON =
    '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><path d="M10 2h15v9H10zM5 10h23l3 6v11H3V15zM8 20h18v10H8z"/><path d="M9 15h15M11 24h12M11 27h12"/><circle cx="27" cy="17" r="1" fill="#111"/></svg>';
  const noteText = (_c, el) => {
    el.dataset.role = 'instruction';
    el.style.fontSize = `clamp(13px,${Math.min(2.6, 130 / _c.ctx.instruction.length)}vw,43px)`;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have their own space in the notebook, even on small screens.
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
      document.documentElement.style.setProperty('--font', D.tokens.font);
      document.body.classList.add('os2', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'os2-logo', header, 'OS/2');
      u.el('div', 'design-brand', header, 'OS/2 Workplace  Shell');
      u.el('div', 'design-clock', header, 'Mon Apr 25, 1994  10:18 AM');
      u.el('div', 'hdr-ico print', header).innerHTML = PRINT_ICON;
      u.el('span', 'help-button', u.el('div', 'hdr-ico help', header), '?');
      const body = u.el('div', 'design-body', shell);
      const win = u.el('div', 'os2-win', body);
      const tb = u.el('div', 'os2-title', win);
      u.el('span', 'tb-ico', tb).innerHTML = APP_ICON;
      u.el('span', 'tb-text', tb, 'Travel Planner - Tickets');
      const tc = u.el('span', 'tb-ctl', tb);
      for (const g of ['_', '▢', '×']) u.el('i', '', tc, g);
      const tabs = u.el('div', 'os2-tabs', win);
      D.tabs.forEach((t, i) => {
        const e = u.el('div', 'os2-tab' + (i === 0 ? ' on' : ''), tabs);
        const ic = u.el('span', 'tab-ico', e);
        ic.innerHTML = TAB_ICONS[i];
        u.el('span', 'tab-name', e, t);
      });
      const page = u.el('section', 'os2-page', win);
      const noteHost = u.el('div', 'note-slot', page);
      const sub = u.el('div', 'page-sub', page);
      u.el('span', 'page-caption', sub, 'Available Tickets');
      Object.assign(_c, { shell, page, noteHost, toolbar: sub, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        // Keep the original paragraph's sizing inside the padded note.
        const text = _c.util.el('p', 'food-task');
        text.textContent = note.textContent;
        note.textContent = '';
        note.appendChild(text);
        noteText(_c, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const panel = _c.noteHost.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'note-panel');
        noteText(_c, panel.querySelector('.ref-panel-text'));
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const page = _c.page;
      const th = u.el('div', 'os2-thead', page);
      for (const h of ['Operator', 'Route', 'Duration', 'Price (USD)', 'Select']) u.el('span', '', th, h);
      const stage = u.el('main', 'stage', page);
      const footer = u.el('footer', 'design-footer', page);
      for (const [label, cls] of [
        ['Details...', 'dt-btn'],
        ['Clear Selection', 'clear-btn'],
        ['Buy ticket', 'buy-btn'],
      ]) {
        const b = u.el('button', cls, footer, label);
        b.type = 'button';
      }
      Object.assign(_c, { stage, footer });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'note-toast');
        _c.noteHost.appendChild(note);
        noteText(_c, note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
      const u = _c.util;
      const shell = _c.shell;
      const bar = u.el('div', 'os2-taskbar', shell);
      const start = u.el('div', 'tbtn start', bar);
      u.el('span', 'os2-logo', start, 'OS/2');
      u.el('span', '', start, 'Start');
      for (const [i, t] of ['Travel Planner', 'Templates', 'Shredder'].entries()) {
        const b = u.el('div', 'tbtn win' + (i === 0 ? ' on' : ''), bar);
        const ic = u.el('span', 'taskbar-icon', b);
        ic.innerHTML =
          i === 0
            ? APP_ICON
            : i === 1
              ? TAB_ICONS[1]
              : '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="2"><path d="M7 8h18l-2 22H9zM5 7h22M11 3h10l4 4H7zM12 11v15M16 11v15M20 11v15"/></svg>';
        u.el('span', '', b, t);
      }
      const tray = u.el('div', 'os2-tray', bar);
      u.el('div', 'tray-monitor', tray).innerHTML =
        '<svg viewBox="0 0 32 32" fill="#fff" stroke="#111" stroke-width="1.8"><rect x="4" y="3" width="23" height="22" rx="2"/><path d="M7 6h17v15H7zM9 28h14M15 25v3"/></svg>';
      u.el('div', 'tray-key', tray).innerHTML =
        '<svg viewBox="0 0 48 28" fill="#ddd" stroke="#111" stroke-width="1.6"><path d="M5 10h8l4 4-4 5H5l-4-5zM17 14h28"/></svg>';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => function (ctx) {
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
  const palette = { bg: D.tokens.bg, panel: D.tokens.panel, fg: D.tokens.fg,
    muted: D.tokens.muted, line: D.tokens.line };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-ticket-08': palette },
      LOW_THEME: palette,
      ACCENTS: [D.tokens.accent],
      LOW_ACCENTS: [D.tokens.accent],
      parts,
    },
  });
})();
