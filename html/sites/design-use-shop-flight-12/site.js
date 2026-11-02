(function () {
  'use strict';
  const palette = { bg: '#dbeafa', panel: '#ffffff', fg: '#12396c', muted: '#5e6779', line: '#bebebe' };
  const D = { obstruction: null };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'top instruction-' + _c.display;
      document.documentElement.style.setProperty('--font', 'Lato,Carlito,Calibri,"Trebuchet MS","Segoe UI",Arial,sans-serif');
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
      if (_c.placement) shell.classList.add('end-in-' + _c.placement);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.insertAdjacentHTML('beforeend', '<svg class="sky-plane" viewBox="0 0 54 45" aria-hidden="true"><path fill="#fff" d="M47 8C54 6 56 10 50 13L34 20 24 42 18 43 25 24 13 29 9 35 4 35 6 27 0 22 3 18 12 23 25 18 15 4 21 2 33 15Z"/></svg>');
      u.el('span', '', brand, 'SkyTrip');
      u.el('span', 'sky-tag', header, 'Flights. A simpler way.');
      const nav = u.el('nav', 'design-nav', header);
      for (const label of ['Home', 'Flights', 'Hotels', 'My Trips', 'Help']) {
        const item = u.el('span', '', nav, label);
        item.addEventListener('click', () => env.log('decoy', { label }));
      }
      const ban = u.el('div', 'sky-banner', shell);
      u.el('div', 'sky-h', ban, 'Explore Tomorrow');
      u.el('div', 'sky-s', ban, 'New places. Same easy search.');
      ban.insertAdjacentHTML(
        'beforeend',
        '<svg class="sky-art" viewBox="0 0 1672 157" preserveAspectRatio="none"><defs><linearGradient id="sky-blue" x2="0" y2="1"><stop stop-color="#cee6fd"/><stop offset="1" stop-color="#b9dff0"/></linearGradient><linearGradient id="sky-sweep" x2="0" y2="1"><stop stop-color="#91c6ed"/><stop offset="1" stop-color="#6eace0"/></linearGradient><linearGradient id="sky-city" x2="0" y2="1"><stop stop-color="#275d87"/><stop offset="1" stop-color="#295c8c"/></linearGradient></defs><path fill="url(#sky-blue)" d="M0 0h1672v157H0z"/><g fill="#fff" opacity=".65"><circle cx="319" cy="49" r="26"/><circle cx="284" cy="63" r="24"/><ellipse cx="301" cy="76" rx="57" ry="14"/></g><circle cx="795" cy="91" r="38" fill="#ffdf62"/><path fill="url(#sky-sweep)" d="M1012 0H1672V157H477C689 134 856 88 1012 0z"/><path fill="#759d80" opacity=".8" d="M0 77l135 80H0z"/><path fill="#85a16e" d="M477 157l188-49 151 49z"/><path fill="#3979a6" d="M764 145l72-8 86-30 66 21 47 29H764z"/><path fill="url(#sky-city)" d="M816 157l106-50 42 12 2-20 23 0 1 20 7 0 0-36 7 0 3-6 13 0 4 6 6 0 0 23 2 0 0-67 31 0 0 75 7 0 1-33 18 0 0-18 27 0 0 29 13 0 0 20 5 0 0-57 5 0 1-9 18 0 3 8 4 0 0 45 11 0 0-65 8-22 16 0 10 26 0 13 5 0 0-30 17 0 1 31 9 5 0 33 7 0 26 26 17 32z"/><path fill="#75a69e" d="M1258 157l74-18 42 18z"/></svg>',
      );
      const body = u.el('div', 'design-body', shell);
      Object.assign(_c, { shell, toolbar: header, header: body, body });
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
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const back = _c.util.el('button', 'footer-label', foot, 'Back');
      back.type = 'button';
      back.disabled = true;
      back.setAttribute('aria-label', 'Back to flight search');
      foot.prepend(back);
      const status = foot.querySelector('.ref-foot-text');
      status.textContent = 'Ready';
      status.classList.add('footer-status');
      status.hidden = !_c.ctx.finish;
      _c.foot = foot;
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
    name: 'design-use-shop-flight-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#2b69b6'], LOW_ACCENTS: ['#2b69b6'], parts,
    },
  });
})();
