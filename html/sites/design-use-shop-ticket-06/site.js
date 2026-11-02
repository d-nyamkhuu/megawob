(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-06',
    'brand': 'Campus Caf\u00e9 \u2013 Food Ordering',
    'mode': 'side-left',
    'tokens': {
      'bg': '#fdf8f0',
      'panel': '#fffdf9',
      'fg': '#14123a',
      'accent': '#fa6f5e',
      'font': "'Trebuchet MS','Segoe UI',Arial,sans-serif",
      'line': '#cfcde0',
      'muted': '#555468',
    },
    'nav': 'File    Edit    View    Options    Help',
    'obstruction': null,
    'footer': '',
  };
  const palette = { bg: '#fdf8f0', panel: '#fffdf9', fg: '#14123a', muted: '#555468', line: '#cfcde0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes occupy the original dedicated area above the tickets.
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
      document.documentElement.style.setProperty('--font', D.tokens.font);
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const deco = u.el('div', 'deco', shell);
      for (const c of ['d-circle', 'd-dots', 'd-tri', 'd-dots2', 'd-sun']) {
        u.el('i', c, deco);
      }
      const landscape = u.el('div', 'route-landscape', deco);
      landscape.innerHTML =
        '<svg viewBox="0 0 220 470" fill="none"><path d="M0 143L108 12l112 135v102H0z" fill="#d2ccff"/><path d="M105 146l86-95 29 32v138z" fill="#a499ef"/><path d="M0 169c99-39 188-22 220-7v162c-23 55-94 98-157 126L29 332c144-84 143-104 26-165z" fill="#d7d0ff"/><path d="M0 184c102-56 234-12 184 46C73 296 208 296 24 376" stroke="#fff9ee" stroke-width="30"/><path d="M0 174c127-60 224-12 177 53s68 70-48 125" stroke="white" stroke-width="3" stroke-dasharray="24 8"/><path d="M42 375l31-107 31 107zM66 145l11-40 11 40zM165 155l11-39 11 39z" fill="#554c96"/><g transform="translate(65 173) rotate(8)"><path d="M5 4Q0 3 0 14v49l13 12 109 14q16 1 16-14l-4-43Q132 19 115 17z" fill="#302574" stroke="#52499c" stroke-width="3"/><path d="M13 9l71 10 8 35-79-12z" fill="#51499d"/><path d="M91 23l26 2q7 1 10 12l3 18-31-2z" fill="#403c88"/><path d="M13 16l14 3v24l-14-3zm19 4l14 2v25l-14-3zm19 3l14 2 4 25-18-3zm20 3l11 2 5 25-13-2z" fill="#7771c1"/><path d="M104 29l22-1 3 7-24 3zM2 50l85 16 3 7L2 57z" fill="#ff8575"/><ellipse cx="23" cy="69" rx="7" ry="12" fill="#292255"/><ellipse cx="23" cy="69" rx="3" ry="7" fill="#cfcee9"/><ellipse cx="82" cy="79" rx="7" ry="12" fill="#292255"/><ellipse cx="82" cy="79" rx="3" ry="7" fill="#cfcee9"/><path d="M106 75l8 1m13 1l6-2" stroke="white" stroke-width="4" stroke-linecap="round"/></g></svg>';
      const idx = u.el('nav', 'side-index', shell);
      [
        ['1', 'Search'],
        ['2', 'Results'],
        ['3', 'Passenger'],
        ['4', 'Payment'],
        ['5', 'Submit'],
      ].forEach(([n, l], i) => {
        const it = u.el('div', 'ix' + (i === 0 ? ' on' : ''), idx);
        u.el('b', '', it, n);
        u.el('span', '', it, l);
      });
      const header = u.el('header', 'design-header', shell);
      const br = u.el('div', 'design-brand', header, 'RouteHop');
      u.el('i', 'brand-tri', br);
      const nav = u.el('nav', 'design-nav', header);
      for (const n of ['Trains', 'Coaches', 'Flights', 'Help']) u.el('span', '', nav, n);
      const av = u.el('div', 'user-ico', header);
      av.innerHTML =
        '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="20" cy="20" r="18"/><circle cx="20" cy="16" r="5.5"/><path d="M9 32c2-6 6-8 11-8s9 2 11 8"/></svg>';
      const body = u.el('div', 'design-body instruction-' + _c.display, shell);
      const noteSlot = u.el('section', 'note-slot', body);
      noteSlot.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, chrome: header, body, header: noteSlot, noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.noteSlot.querySelector('.ref-instruction');
      if (text) {
        text.classList.add('food-task');
        _c.util.el('i', 'note-line', _c.noteSlot);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('header-tools');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const text = _c.noteSlot.querySelector('.ref-panel-text');
      if (text) text.classList.add('food-task');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      _c.util.el('div', 'order-slot', footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
    name: 'design-use-shop-ticket-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-ticket-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#fa6f5e'],
      LOW_ACCENTS: ['#fa6f5e'],
      parts,
    },
  });
})();
