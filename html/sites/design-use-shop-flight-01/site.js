(function () {
  'use strict';
  const palette = {
    bg: '#a7a7a7', panel: '#c7c7c7', fg: '#080808', muted: '#5f6a78', line: '#c8cdd5',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every instruction mode originally occupied the window's own note area.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'rail instruction-' + _c.display;
      document.documentElement.style.setProperty('--font', 'monospace');
      document.documentElement.style.setProperty('--button-fg', '#000');
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
      const header = u.el('header', 'design-header', shell);
      const disk = u.el('span', 'disk', header);
      const brand = u.el('div', 'design-brand', header, 'Amiga Workbench');
      const nav = u.el('nav', 'design-nav', header);
      for (const t of ['Work', 'Icons', 'Tools', 'Help']) u.el('span', '', nav, t);
      u.el('div', 'menu-clock', header, 'Mon Aug 17 1992    10:24 AM');
      const body = u.el('div', 'design-body', shell);
      const rail = u.el('nav', 'command-rail', body);
      const logo = u.el('button', 'rail-logo', rail);
      logo.type = 'button';
      logo.addEventListener('click', () => env.log('decoy', { what: 'SkyWays Travel' }));
      logo.innerHTML =
        '<svg viewBox="0 0 120 80" aria-hidden="true"><g fill="#ddd" stroke="#eee" stroke-width="1" shape-rendering="crispEdges"><path d="M6 44L28 42 80 34 102 34 111 38 115 41 109 46 69 48 22 49 6 48Z"/><path d="M41 41L73 3H79L75 35Z"/><path d="M36 48L22 77 71 53 90 48Z"/><path d="M67 64L77 57 78 62 86 65Z"/><path d="M68 68H87V70H67Z"/></g><path d="M10 46H104M28 41H45" stroke="#0039b6" stroke-width="2"/><g fill="#0039b6"><rect x="96" y="37" width="4" height="2"/><rect x="102" y="38" width="4" height="2"/></g></svg><b>SkyWays<br>Travel</b>';
      const icons = [
        '<svg viewBox="0 0 32 32"><path d="M4 18L23 6 29 5 30 8 24 15 18 18 14 29 10 28 11 20 5 23 2 22 6 17 2 15 3 12 11 15Z" fill="#0038bd" stroke="#111" stroke-width="1.5"/><path d="M8 16L23 8 27 8M13 20L19 14" stroke="#fff" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 32 38"><path d="M3 9H29V35H3Z" fill="#0034b4" stroke="#111" stroke-width="2"/><path d="M10 9V3H22V9M12 9V5H20V9" fill="none" stroke="#111" stroke-width="2"/><path d="M15 15V23M11 19L15 24 20 19" fill="none" stroke="#eee" stroke-width="2"/><path d="M5 11H27" stroke="#fff"/></svg>',
        '<svg viewBox="0 0 32 38"><path d="M16 2L22 4 24 9 23 15 18 18 12 18 8 14 8 7 11 3Z" fill="#0036b4" stroke="#111" stroke-width="1.5"/><path d="M3 35V29L7 23 12 20H20L27 25 30 31V35Z" fill="#0036b4" stroke="#111" stroke-width="1.5"/><path d="M10 5L10 12M6 27L4 31" stroke="#ddd"/></svg>',
        '<svg viewBox="0 0 32 38"><path d="M5 3H26V35H3V6Z" fill="#0032ad" stroke="#111" stroke-width="2"/><path d="M5 3V33H26" fill="none" stroke="#ddd"/><text x="16" y="29" text-anchor="middle" font-size="30" font-family="monospace" fill="#eee" font-weight="700">?</text></svg>',
      ];
      ['Flights', 'My Trips', 'Profile', 'Help'].forEach((name, i) => {
        const b = u.el('button', 'command-item' + (i ? '' : ' active'), rail);
        b.innerHTML = icons[i] + '<span>' + name + '</span>';
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: name }));
      });
      const globe = u.el('div', 'rail-globe', rail);
      globe.innerHTML =
        '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="world-clip"><circle cx="32" cy="32" r="29"/></clipPath></defs><circle cx="32" cy="32" r="29" fill="#002fab" stroke="#001857" stroke-width="2"/><g clip-path="url(#world-clip)" fill="#b7b7b7" stroke="#002fab" stroke-width="1" shape-rendering="crispEdges"><path d="M1 14L16 4 19 10 27 8 22 17 26 23 17 31 12 31 9 25 4 25 0 20ZM14 35L23 30 29 35 30 44 24 51 24 59 20 63 17 54 16 42Z"/><path d="M34 1L37 9 32 12 36 17 45 12 54 18 60 17 66 27 59 34 48 30 45 35 40 32 38 24 28 25 25 19 30 16 28 10ZM31 28L41 27 48 34 45 46 40 54 34 48 31 38ZM49 47L55 42 64 45 62 55 53 55 48 51Z"/></g><path d="M13 9L20 5M4 23L9 16M38 6L48 9M47 54L40 60" stroke="#ddd" stroke-width="2"/></svg>';
      const win = u.el('div', 'win', body);
      const wt = u.el('div', 'win-title', win);
      u.el('span', 'win-close', wt, '✕');
      u.el('b', '', wt, 'SkyWays Travel - Book a Flight');
      const wg = u.el('span', 'win-gad', wt);
      ['depth', 'size', 'close'].forEach((n) => u.el('span', 'gadget ' + n, wg));
      Object.assign(_c, { shell, body: win, win, toolbar: wt, gadgets: wg, header: win });
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
      _c.toolbar.insertBefore(_c.headerTools, _c.gadgets);
    },
    'frame.body': () => (_c) => { _c.body = _c.win; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note');
        _c.win.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util, win = _c.win;
      const footer = u.el('footer', 'design-footer', win);
      const selected = u.el('fieldset', 'selected-flight', footer);
      u.el('legend', '', selected, 'Selected Flight');
      const facts = u.el('div', 'selected-facts', selected);
      for (const label of ['Airline', 'Departure', 'Arrival', 'Duration', 'Price']) {
        const fact = u.el('div', 'selected-fact ' + label.toLowerCase(), facts);
        u.el('span', 'fact-label', fact, label + ':');
        const v = u.el('span', 'fact-value', fact, '—');
        v.dataset.fact = label.toLowerCase();
      }
      const book = u.el('button', 'book-flight', footer, 'Book Flight');
      book.type = 'button';
      book.disabled = true;
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
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
      return { el, dismiss };    },
  };
  env.site({
    name: 'design-use-shop-flight-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-flight-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0739bb'],
      LOW_ACCENTS: ['#0739bb'],
      parts,
    },
  });
})();
