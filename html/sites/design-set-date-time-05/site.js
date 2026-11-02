(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-05',
    brand: 'Harbor & Oak',
    sub: 'Restaurant Reservations',
    tabs: ['Reservations', 'Tables', 'Menu', 'Guests', 'Settings'],
    cols: ['Date', 'Time', 'Guest Name', 'Party Size', 'Table', 'Status'],
    rows: [
      ['6:00 PM', 'Taylor Kim', '2', 'T3', 'Seated'],
      ['6:30 PM', 'Jordan Lee', '4', 'T5', 'Seated'],
      ['7:00 PM', 'Morgan Patel', '2', 'T2', 'Arrived'],
      ['7:30 PM', 'Casey Brown', '5', 'T8', 'Confirmed'],
      ['8:00 PM', 'Riley Chen', '3', 'T6', 'Confirmed'],
      ['8:30 PM', 'Alex Martinez', '2', 'T4', 'Pending'],
      ['9:00 PM', 'Jamie Wilson', '4', 'T7', 'Pending'],
    ],
  };
  const FORK =
    '<svg width="40" height="44" viewBox="0 0 40 44" fill="none" stroke="#53627e" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v12a4 4 0 0 0 8 0V4M13 4v36M28 40V4c-5 3-7 9-7 16h7"/></svg>';
  const SEARCH =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56627a" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  const CAL =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
  const PEOPLE =
    '<svg width="30" height="26" viewBox="0 0 32 26" fill="none" stroke="#56627a" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="8" r="4.5"/><path d="M7 23c0-5 4-8 9-8s9 3 9 8H7zM7 15c-3 1-5 4-5 7h3M25 15c3 1 5 4 5 7h-3M6 12a3.5 3.5 0 0 1 0-7M26 12a3.5 3.5 0 0 0 0-7"/></svg>';
  const palette = { bg: '#e9eef6', panel: '#f1f4fa', fg: '#1f2a44', muted: '#5d6985', line: '#d3dae8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original narrow-screen note fallback and its inline card.
      if ((_c.ctx.display === 'panel' || _c.ctx.display === 'toast') && _c.W < 1260) _c.display = 'header';
      _c.headerInline = _c.display === 'header' && _c.W < 1260;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const top = u.el('header', 'ds-top', shell);
      const brand = u.el('div', 'ds-brandbox', top);
      u.el('span', 'ds-logo', brand).innerHTML = FORK;
      const bt = u.el('div', 'ds-brandtext', brand);
      u.el('div', 'ds-brand', bt, C.brand);
      u.el('div', 'ds-brandsub', bt, C.sub);
      const nav = u.el('nav', 'ds-menu', top);
      C.tabs.forEach((t, i) => u.el('span', 'ds-tab' + (i ? '' : ' on'), nav, t));
      const search = u.el('div', 'ds-search', top);
      u.el('span', '', search).innerHTML = SEARCH;
      u.el('span', 'ds-ph', search, 'Search reservations...');
      const panel = u.el('section', 'ds-panel');
      u.el('h2', '', panel, 'New Reservation');
      let header = top;
      if (_c.display === 'header') {
        header = u.el('aside', _c.headerInline ? 'ds-notebox' : 'ds-header-note', _c.headerInline ? panel : shell);
        u.el('span', 'ds-noteic', header).innerHTML = CAL;
      }
      Object.assign(_c, { shell, top, panel, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-header-actions');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.shell);
      const led = u.el('section', 'ds-ledger', main);
      const tbl = u.el('div', 'ds-table', led);
      const head = u.el('div', 'ds-tr ds-th', tbl);
      C.cols.forEach((c) => {
        const s = u.el('span', '', head, c);
        u.el('i', 'ds-sort', s, '');
      });
      C.rows.forEach((r) => {
        const tr = u.el('div', 'ds-tr', tbl);
        ['Apr 26, 2025', r[0], r[1], r[2], r[3]].forEach((v) => u.el('span', '', tr, v));
        const st = u.el('span', '', tr);
        u.el('em', 'ds-badge ds-b-' + r[4].toLowerCase(), st, r[4]);
      });
      const right = u.el('div', 'ds-right', main);
      right.appendChild(_c.panel);
      Object.assign(_c, { body: main, led, right });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panel;
      base(_c);
      _c.body = body;
      const note = _c.panel.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-notebox');
        const icon = _c.util.el('span', 'ds-noteic');
        icon.innerHTML = CAL;
        note.prepend(icon);
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.panel);
      const foot = u.el('div', 'ds-footer', _c.panel);
      const clear = u.el('button', 'ds-cancel', foot, 'Clear');
      clear.type = 'button';
      const rail = u.el('aside', 'ds-rail', _c.right);
      const rh = u.el('h2', '', rail);
      u.el('span', '', rh).innerHTML = PEOPLE;
      u.el('span', 'ds-rail-title', rh, 'Reservation Preview');
      u.el('div', 'ds-reservation-values', rail);
      Object.assign(_c, { foot, rh });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast-note');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        const icon = _c.util.el('span', 'ds-noteic');
        icon.innerHTML = CAL;
        note.prepend(icon);
        _c.led.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.rh.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-time-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f6fe0'],
      LOW_ACCENTS: ['#2f6fe0'],
      parts,
    },
  });
})();
