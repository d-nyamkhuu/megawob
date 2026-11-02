(function () {
  'use strict';
  const D = {
    brand: 'Willow & Fork',
    obstruction: [
      'We’re Continuing to Serve What Brings Us Together',
      'Same great food, a calmer, more comfortable experience.',
      'Collapse announcement',
    ],
  };
  const palette = {
    bg: '#f3f0e8', panel: '#faf8f1', fg: '#343a22',
    muted: '#626675', line: '#d1cec5',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if ((_c.ctx.display === 'panel' || _c.ctx.display === 'toast') &&
          (_c.W < 1260 || _c.H < 700)) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Georgia,serif');
      document.body.classList.add('top', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const nav = u.el('nav', 'design-nav', header);
      const S =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
      const ni = [
        [
          'Order',
          S + '<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7M7 3v7M11 10a2 2 0 0 1-2 2M17 21V3c-2 1-3 4-3 8h3"/></svg>',
        ],
        ['Account', S + '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>'],
        ['', S + '<path d="M5 8h14l1 13H4zM9 8V6a3 3 0 0 1 6 0v2"/></svg>'],
      ];
      ni.forEach((n, i) => {
        const it = u.el('span', 'nav-item', nav);
        it.innerHTML = n[1];
        if (n[0]) u.el('span', '', it, n[0]);
        else u.el('i', 'nav-badge', it, '0');
      });
      const announcement = u.el('div', 'announcement-space', shell);
      announcement.setAttribute('aria-hidden', 'true');
      const body = u.el('div', 'design-body', shell);
      const side = u.el('aside', 'brand-side', body);
      u.el('div', 'design-brand', side, D.brand);
      u.el('div', 'brand-sub', side, 'KITCHEN');
      u.el('div', 'brand-rule', side);
      u.el('div', 'brand-tag', side, 'Good food brings people together.');
      const leaf = u.el('div', 'brand-leaf', side);
      leaf.innerHTML =
        '<svg viewBox="0 0 48 48" width="44" height="44" fill="#4a5032"><path d="M5 43Q18 16 40 6" fill="none" stroke="#4a5032" stroke-width="1.4"/><path d="M15 28Q7 19 15 10Q20 20 15 28M23 20Q18 8 26 4Q30 13 23 20M29 14Q30 3 43 3Q41 12 29 14M19 23Q29 16 36 23Q28 29 19 23M12 32Q22 28 30 37Q20 39 12 32"/></svg>';
      const bt = u.el('div', 'brand-foot', side);
      u.el('i', '', bt);
      u.el('div', '', bt, 'Seasonal Ingredients.');
      u.el('div', '', bt, 'Lasting Connections.');
      Object.assign(_c, { shell, header: body, body, navBar: nav });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'task-note-header');
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.navBar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note', 'task-note-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'task-note-toast');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const fl = _c.util.el('span', 'footer-label', foot);
      ['Help', 'Contact', 'Privacy'].forEach((t, i) => {
        if (i) _c.util.el('b', '', fl, '|');
        _c.util.el('span', '', fl, t);
      });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {

      const u = ctx.util;
      const named = D.obstruction;
      if (ctx.initial) {
        const shell = document.querySelector('.site-shell');
        shell.classList.remove('announcement-collapsed');
        const el = u.el('section', 'site-announcement initial-announcement', document.body);
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', named[0]);
        const emblem = u.el('div', 'announcement-emblem', el);
        emblem.innerHTML =
          '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M4 59Q23 21 55 8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M18 38Q8 24 19 15Q25 28 18 38M29 26Q24 10 35 3Q39 18 29 26M40 20Q42 5 62 5Q57 19 40 20M25 32Q38 21 51 30Q42 39 25 32M16 42Q34 37 43 54Q27 56 16 42M36 24Q50 20 60 31Q46 36 36 24"/><path d="m53 46 5-3-2 6 4 2-4 2-2-3-2-4" fill="#fff9e9"/></svg>';
        u.el('h2', 'announcement-title', el, named[0]);
        u.el('p', 'announcement-copy', el, named[1]);
        const dismiss = u.el('button', 'announcement-collapse', el, named[2]);
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          shell.classList.add('announcement-collapsed');
          ctx.dismiss();
          shell.querySelector('.stage').dispatchEvent(new Event('announcement-layout'));
        });
        return { el, dismiss };
      }
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
      dismiss.addEventListener('click', () => {
        ctx.dismiss();
      });
      return { el, dismiss };    },
  };
  env.site({
    name: 'design-use-shop-food-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner', p: 1 },
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#4a5032'], LOW_ACCENTS: ['#4a5032'], parts,
    },
  });
})();
