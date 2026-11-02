(function () {
  'use strict';
  const palette = {
    bg: '#faf9f2', panel: '#fffefa', fg: '#101010', muted: '#5e6779', line: '#bebebe',
    font: 'Liberation Sans Narrow,Arial,sans-serif',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses its own right pane even at the smaller viewports.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'side-right instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { util: u, ctx } = _c;
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, 'TRAIN & COACH TICKETS');
      u.el('div', 'design-sub', chrome, 'Same route. Different options.');
      const trip = u.el('div', 'design-trip', chrome);
      const tp = (ctx.spec && ctx.spec.tickets && ctx.spec.tickets[0] && ctx.spec.tickets[0].place) || 'Riverton → Lakeside';
      u.el('div', 'design-route', trip, tp);
      u.el('div', 'design-when', trip, 'Tue, Apr 27, 2021  |  1 adult');
      const note = u.el('section', 'task-note');
      const side = _c.display === 'header' || _c.display === 'panel';
      note.hidden = !side;
      if (_c.display === 'header') u.el('h2', '', note, 'Your Task');
      Object.assign(_c, { shell, chrome, note, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.note);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const pref = u.el('section', 'prefs-panel', _c.note);
      u.el('h3', '', pref, 'PREFERENCES');
      u.el('p', '', pref, 'Sort by');
      const sort = u.el('button', '', pref, 'Departure time');
      sort.type = 'button';
      sort.addEventListener('click', () => (sort.textContent = sort.textContent === 'Departure time' ? 'Price' : 'Departure time'));
      u.el('p', 'prefs-sub', pref, 'Show only');
      for (const name of ['Direct services only', 'No transfers', 'Flexible with time']) {
        const l = u.el('label', '', pref);
        const c = u.el('input', '', l);
        c.type = 'checkbox';
        l.append(' ' + name);
      }
      const tc = u.el('div', 'task-ctl', _c.note);
      u.el('span', '', tc, 'Task controls');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      if (_c.display === 'header' || _c.display === 'panel') {
        _c.note.appendChild(foot);
        foot.classList.add('side-foot');
      } else _c.shell.appendChild(foot);
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
    name: 'design-use-shop-ticket-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#c7ff35'], LOW_ACCENTS: ['#c7ff35'], parts,
    },
  });
})();
