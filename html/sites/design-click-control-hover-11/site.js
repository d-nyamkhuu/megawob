(function () {
  'use strict';
  const cfg = {
    theme: 'mac',
    layout: 'macwide',
    title: 'Pointer Task',
    side: 'Notifications',
    notes: [
      'Notifications appear in the window on the right.',
      'Each notification can be dismissed individually using its close box.',
      'Use Dismiss all to clear the notification list.',
    ],
    cards: [
      ['Software Update Available', '10:20 AM', 'A new version is ready to install.', 'doc'],
      ['New Mail', '10:18 AM', 'You have 3 unread messages.', 'mail'],
      ['Disk Almost Full', '10:16 AM', 'Only 200 MB remaining.', 'warn'],
      ['Reminder', '10:14 AM', 'Team meeting at 11:00 AM.', 'note'],
      ['Printer Offline', '10:12 AM', 'Check your connection.', 'print'],
    ],
  };
  const ICONS = {
    doc: '<svg viewBox="0 0 40 40"><path d="M9 3h15l7 7v27H9Z" fill="#e9f0fc" stroke="#111" stroke-width="2"/><path d="M24 3v7h7" fill="#ddd" stroke="#111" stroke-width="2"/><path d="M13 16h14M13 21h14M13 26h14M13 31h14" stroke="#111" stroke-width="1.6"/></svg>',
    mail: '<svg viewBox="0 0 40 40"><rect x="3" y="9" width="34" height="23" fill="#fff" stroke="#111" stroke-width="2"/><path d="M3 9l17 14L37 9M3 32l12-12M37 32 25 20" fill="none" stroke="#111" stroke-width="2"/></svg>',
    warn: '<svg viewBox="0 0 40 40"><path d="M17 6Q20 0 23 6L38 32Q40 36 35 36H5Q0 36 3 31Z" fill="#efd15c" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 14v11" stroke="#111" stroke-width="4"/><circle cx="20" cy="30" r="2.4" fill="#111"/></svg>',
    note: '<svg viewBox="0 0 40 40"><path d="M5 4h27v34H5Z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M9 11h19M9 16h17M9 21h15M9 26h12M9 31h12" stroke="#111" stroke-width="1.6"/><path d="M36 3 23 26l-1 6 5-4L39 5Z" fill="#fff" stroke="#111" stroke-width="2"/></svg>',
    print:
      '<svg viewBox="0 0 40 40"><path d="M11 4h18v10H11Z" fill="#fff" stroke="#111" stroke-width="2"/><rect x="3" y="14" width="34" height="16" rx="2" fill="#9399ba" stroke="#111" stroke-width="2"/><path d="M5 18h30M6 22h3" stroke="#414967"/><rect x="9" y="25" width="22" height="11" fill="#fff" stroke="#111" stroke-width="2"/><path d="M13 29h14M13 32h14" stroke="#111"/></svg>',
  };
  const palette = { bg: '#858b9c', panel: '#e4e5e8', fg: '#111111', muted: '#222222', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', cfg.theme, cfg.layout);
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'menubar', shell);
      const apple = u.el('span', 'apple', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28"><defs><linearGradient id="appleRainbow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#58aa39" offset="0%"/><stop stop-color="#58aa39" offset="25%"/><stop stop-color="#f3d22d" offset="25%"/><stop stop-color="#f3d22d" offset="42%"/><stop stop-color="#ed8b24" offset="42%"/><stop stop-color="#ed8b24" offset="57%"/><stop stop-color="#c63542" offset="57%"/><stop stop-color="#c63542" offset="72%"/><stop stop-color="#934790" offset="72%"/><stop stop-color="#934790" offset="86%"/><stop stop-color="#397ab5" offset="86%"/></linearGradient></defs><path d="M12 8C7 4 1 9 3 16c2 8 5 10 8 8 1-.5 2-.5 3 0 3 2 6-2 7-6-5-2-5-6-1-8-2-4-5-4-8-2Z" fill="url(#appleRainbow)" stroke="#444"/><path d="M12 7c-1-4 2-6 5-6 0 3-2 5-5 6" fill="#62a23d" stroke="#555"/></svg>';
      ['File', 'Edit', 'View', 'Special', 'Help'].forEach((l) => u.el('span', 'mi', bar, l));
      u.el('span', 'clock', bar, '10:24 AM');
      const tray = u.el('span', 'tray', bar);
      tray.innerHTML =
        '<svg viewBox="0 0 30 34"><path d="M6 3h19M6 30h19M9 4c0 8 12 9 12 13S9 23 9 29M22 4c0 8-12 9-12 13s12 6 12 12" fill="#dcdfef" stroke="#17192d" stroke-width="2"/><path d="m19 8-7 9 7 9H11l7-9-5-9Z" fill="#7168a1"/><path d="m8 6 15-3M6 31l19-3" stroke="#181a24" stroke-width="2"/></svg>';
      const work = u.el('div', 'work', shell);
      const win = u.el('section', 'win main-win', work);
      const tb = u.el('div', 'tbar', win);
      ['', '', ''].forEach(() => u.el('i', 'box', tb));
      u.el('span', 'stripes', tb);
      u.el('span', 'ttl', tb, cfg.title);
      u.el('span', 'stripes', tb);
      // The legacy widget rewrites goal-specific notes under .wbody. Keep this
      // frame's help independent so hidden instruction mode stays hidden.
      const body = u.el('div', 'window-body', win);
      const side = u.el('aside', 'win side-win', work);
      const tb2 = u.el('div', 'tbar', side);
      u.el('i', 'box', tb2);
      u.el('span', 'ttl l', tb2, 'Notifications (0)');
      u.el('span', 'stripes', tb2);
      u.el('i', 'box close-box', tb2);
      const sb = u.el('div', 'sbody', side);
      Object.assign(_c, { shell, work, win, tb, sb, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.header);
      const notes = u.el('div', 'notes', _c.header);
      u.el('div', '', notes, 'Notes:');
      const ul = u.el('ul', '', notes);
      cfg.notes.forEach((t) => u.el('li', '', ul, t));
      _c.notes = notes;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.header.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.sb.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = '';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.notes.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        host = document.querySelector('.sbody');
      const el = u.el('section', 'notification-overlay', host);
      el.setAttribute('aria-label', 'Notifications');
      const list = u.el('div', 'cards', el);
      let dismiss;
      const title = document.querySelector('.side-win .ttl');
      if (title) title.textContent = 'Notifications (5)';
      const refresh = () => {
        const count = list.children.length;
        const title = document.querySelector('.side-win .ttl');
        if (title) title.textContent = 'Notifications (' + count + ')';
      };
      cfg.cards.forEach((c) => {
        const card = u.el('div', 'card', list);
        const ic = u.el('span', 'cicon', card);
        ic.innerHTML = ICONS[c[3]];
        const tx = u.el('div', 'ctext', card);
        const h = u.el('div', 'chead', tx);
        u.el('b', '', h, c[0]);
        u.el('span', '', h, c[1]);
        u.el('div', 'cmsg', tx, c[2]);
        const x = u.el('button', 'cx', card, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Dismiss ' + c[0]);
        x.addEventListener('click', () => {
          card.remove();
          refresh();
          if (!list.children.length) ctx.dismiss();
        });
      });
      dismiss = u.el('button', 'dismissall', el, 'Dismiss all');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => {
        list.textContent = '';
        refresh();
        ctx.dismiss();
      });
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-hover-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'mac.css'],
    initialOverlay: { kind: 'banner', p: 1 },
    design: {
      THEMES: { mac: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a50f0'],
      LOW_ACCENTS: ['#2a50f0'],
      parts,
    },
  });
})();
