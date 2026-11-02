(function () {
  'use strict';
  const palette = {
    bg: '#f3eee4', panel: '#fffdf9', fg: '#1f1a15', muted: '#6f675c', line: '#d6cdbd',
  };
  const D = { brand: 'Flight Finder', menu: ['File', 'Edit', 'View', 'Help'], obstruction: null };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('gnome', 'instruction-' + _c.display);
      document.body.classList.toggle('instruction-panel-rail', _c.display === 'panel');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const tb = u.el('header', 'titlebar', shell);
      const ico = u.el('span', 'ico', tb);
      ico.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10.5"/><path d="M8 6.5a6.5 6.5 0 0 1 7.5-.4M18 10a6.5 6.5 0 0 1-3.3 7.8M9 18a6.5 6.5 0 0 1-3.4-6.7"/><circle cx="6" cy="8" r="1.7" fill="currentColor"/><circle cx="18" cy="8" r="1.7" fill="currentColor"/><circle cx="12" cy="18" r="1.7" fill="currentColor"/></svg>';
      u.el('span', 'ttl', tb, D.brand);
      const wb = u.el('div', 'wbtns', tb);
      u.el('i', '', wb);
      u.el('i', '', wb);
      u.el('i', 'x', wb);
      const menu = u.el('nav', 'menubar', shell);
      for (const m of D.menu) u.el('span', '', menu, m);
      const body = u.el('div', 'design-body');
      const main = u.el('div', 'main-col', body);
      const side = u.el('aside', 'trip', body);
      Object.assign(_c, { shell, menu, body, main, side, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.main;
      base(_c);
      _c.header = header;
      const note = _c.main.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'flight-task');
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) panel.classList.add('episode-panel');
      const u = _c.util;
      const side = _c.side;
      u.el('h2', '', side, 'Your trip');
      u.el('div', 'trip-route', side, '— → —');
      u.el('div', 'trip-date', side, 'One-way');
      u.el('h3', '', side, 'Selected flight');
      u.el('div', 'sel', side, 'Choose a flight from the list.');
      const book = u.el('button', 'trip-book', side, 'Book');
      book.type = 'button';
      book.disabled = true;
      u.el('div', 'lab passenger', side, 'Passenger');
      u.el('div', 'fakein', side, 'John Doe');
      u.el('div', 'lab', side, 'Contact email');
      u.el('div', 'fakein', side, 'john.doe@example.com');
      u.el('div', 'hint', side, 'You’ll confirm details on the airline’s site after booking.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'toast-note');
        _c.main.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.side.appendChild(foot);
        foot.querySelector('.ref-foot-text').remove();
        _c.side.classList.add('has-foot');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.side.appendChild(dock);
        _c.side.classList.add('has-float');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
    name: 'design-use-shop-flight-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'gnome.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-flight-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#e8892f'],
      LOW_ACCENTS: ['#e8892f'],
      TITLES: ['Flight Finder'],
      parts,
    },
  });
})();
