(function () {
  'use strict';
  const palette = { bg: '#2a5fb4', panel: '#ffffff', fg: '#111111', muted: '#444a52', line: '#8a8f98' };
  const SIDE = [
    ['Travel Center', ['Flights', 'Trains', 'Coaches', 'Ferries', 'Hotels', 'Car Hire']],
    ['Plan Your Trip', ['Maps', 'Timetables', 'City Guides', 'Travel News']],
    ['Services', ['Travel Insurance', 'Currency Info', 'Visa Information', 'Baggage Rules']],
    ['Useful Links', ['Weather', 'Holiday Ideas', 'Special Offers', 'Contact Us']],
  ];
  const TOP = ['Home', 'Destinations', 'Travel Tips', 'Help'];
  const GLOBE =
    '<svg viewBox="0 0 40 40" width="100%" height="100%"><defs><radialGradient id="ocean" cx="35%" cy="30%"><stop stop-color="#fff"/><stop offset=".45" stop-color="#4ddfff"/><stop offset="1" stop-color="#0876d1"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#ocean)" stroke="#001d57" stroke-width="1.2"/><g fill="none" stroke="#00316b" stroke-width="1.2"><ellipse cx="20" cy="20" rx="8" ry="18"/><ellipse cx="20" cy="20" rx="14" ry="18"/><path d="M2 20h36M5 11h30M5 29h30M20 2v36"/></g></svg>';
  const link = (u, parent, text, cls = '') => {
    const a = u.el('a', cls, parent, text);
    a.href = '#';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      env.log('decoy', { what: text });
    });
    return a;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original portal uses the same task location below its side-card breakpoint.
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
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'tp-globe', chrome).innerHTML = GLOBE;
      u.el('div', 'design-brand', chrome, 'TravelHub');
      u.el('div', 'design-tag', chrome, 'Travel Directory & Ticket Shop');
      const tn = u.el('nav', 'design-nav', chrome);
      TOP.forEach((t, i) => {
        if (i) u.el('span', 'sep', tn, '|');
        link(u, tn, t);
      });
      const body = u.el('div', 'design-body', shell);
      const side = u.el('aside', 'tp-side', body);
      for (const [h, ls] of SIDE) {
        u.el('div', 'tp-sh', side, h);
        const ul = u.el('div', 'tp-links', side);
        for (const l of ls) link(u, ul, l, l === 'Coaches' ? 'on' : '');
      }
      const col = u.el('div', 'tp-col', body);
      const status = u.el('div', 'tp-status', shell);
      const pal = u.el('aside', 'tp-palette', document.body);
      const tb = u.el('div', 'tp-ptitle', pal);
      u.el('span', 'tp-pico', tb, '');
      u.el('span', '', tb, 'Trip Planner');
      u.el('span', 'tp-pbtn', tb, '–');
      u.el('span', 'tp-pbtn', tb, '×');
      u.el('div', 'tp-psel', pal, 'Selected Ticket');
      const pf = u.el('div', 'tp-pfields', pal);
      for (const f of ['Operator', 'Departure', 'Arrival', 'Duration', 'Price']) {
        const r = u.el('div', '', pf);
        u.el('span', '', r, f + ':');
        u.el('span', '', r, '—').dataset.ticketField = f;
      }
      const pc = u.el('div', 'tp-pfoot', pal);
      const cl = u.el('button', '', pc, 'Clear');
      cl.type = 'button';
      cl.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
      Object.assign(_c, { shell, chrome, body, col, status, pc, header: col });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note', 'food-task');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = h;
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) _c.status.appendChild(b);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const frm = u.el('section', 'tp-form', _c.col);
      u.el('div', 'tp-fh', frm, 'Coach Tickets');
      const fb = u.el('div', 'tp-fb', frm);
      const f1 = u.el('div', 'tp-fc', fb);
      for (const [l, k] of [['From:', 'from'], ['To:', 'to'], ['Date:', 'date']]) {
        const r = u.el('div', 'tp-fr', f1);
        u.el('span', '', r, l);
        u.el('span', 'tp-in ' + k, r, '—').dataset.field = k;
        if (k === 'date') u.el('span', 'tp-calendar', r, '▦');
      }
      const f2 = u.el('div', 'tp-fc tp-f2', fb);
      const pr = u.el('div', 'tp-fr', f2);
      u.el('span', '', pr, 'Passengers:');
      u.el('span', 'tp-in sm', pr, '1');
      u.el('div', 'tp-chk', f2, 'Show all operators');
      u.el('span', 'tp-sbtn', f2, 'Search');
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.col;
      base(_c);
      _c.body = body;
      const panel = _c.col.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Travel Task';
        panel.querySelector('.ref-panel-text').classList.add('food-task');
        panel.querySelector('.ref-panel-text').dataset.display = _c.display;
        _c.col.prepend(panel);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.col);
      const footer = u.el('footer', 'design-footer', _c.col);
      const vd = u.el('button', 'view-details', footer, 'View Details');
      vd.type = 'button';
      vd.addEventListener('click', () => env.log('decoy', { what: 'View Details' }));
      u.el('button', 'purchase-control', footer, 'Buy Ticket').type = 'button';
      _c.footer = footer;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('food-task');
        text.dataset.display = _c.display;
        _c.col.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footer.appendChild(foot);
      for (const b of foot.querySelectorAll('.ref-xtra')) _c.status.appendChild(b);
      const endlink = foot.querySelector('.ref-endlink');
      if (endlink) {
        _c.pc.classList.add('has-end');
        _c.pc.appendChild(endlink);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.pc.classList.add('has-end');
        _c.pc.appendChild(dock);
      }
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
    name: 'design-use-shop-ticket-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-ticket-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a58b8'],
      LOW_ACCENTS: ['#0a58b8'],
      parts,
    },
  });
})();
