(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-flight-06', brand: 'SkyWays Travel',
    nav: ['Home', 'Flights', 'Hotels', 'Cars', 'Help'], obstruction: null,
    notes: [
      'Search for flights using the details on the left.',
      'Review the one-way flight options.',
      'Select a flight and click “Book Selected Flight”.',
      'Enter your passenger information.',
    ],
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', "'Times New Roman',Times,serif");
      document.body.classList.add('doc-page', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const doc = u.el('div', 'doc', shell);
      u.el('div', 'doc-brand', doc, D.brand);
      const nav = u.el('nav', 'doc-nav', doc);
      D.nav.forEach((n, i) => {
        if (i) u.el('span', '', nav, '|');
        const a = u.el('a', '', nav, n);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: n });
        });
      });
      u.el('hr', 'doc-rule', doc);
      const margin = u.el('aside', 'margin', shell);
      const note = u.el('section', 'task-note', margin);
      u.el('h2', 'task-heading', note, 'Your Task');
      u.el('hr', '', margin);
      const an = u.el('section', 'action-notes', margin);
      u.el('h2', '', an, 'Action Notes');
      const ol = u.el('ol', '', an);
      for (const t of D.notes) u.el('li', '', ol, t);
      u.el('hr', 'mrule', margin);
      const footer = u.el('footer', 'design-footer', margin);
      Object.assign(_c, { shell, doc, menu: nav, margin, note, footer, header: doc });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) instruction.classList.add('doc-task');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.doc; },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = b;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.doc);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.note.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#222222', line: '#000000' };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#c0c0c0'], LOW_ACCENTS: ['#c0c0c0'], parts,
    },
  });
})();
