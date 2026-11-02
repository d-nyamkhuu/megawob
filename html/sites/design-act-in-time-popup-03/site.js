(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#eff8ff', fg: '#111', muted: '#334', line: '#a9c9ed' };
  const catsL = [
    ['Arts & Humanities', 'Literature', 'History', 'Philosophy', 'Visual Arts', 'Performing Arts', 'Museums'],
    ['Business & Economy', 'Companies', 'Investing', 'Jobs', 'Real Estate', 'Small Business', 'Economy'],
    ['Computers & Internet', 'Hardware', 'Software', 'Programming', 'Internet', 'Web Design', 'Computer Science'],
    ['Education', 'Colleges & Universities', 'K-12', 'Distance Learning', 'Libraries', 'Reference', 'Scholarships'],
  ];
  const catsR = [
    ['Health & Medicine', 'Diseases & Conditions', 'Fitness', 'Mental Health', 'Nutrition', 'Medical Research', 'Pharmaceuticals'],
    ['News & Media', 'World News', 'U.S. News', 'Television', 'Radio', 'Newspapers', 'Magazines'],
    ['Recreation & Sports', 'Outdoors', 'Sports', 'Games', 'Hobbies', 'Travel', 'Autos'],
    ['Society & People', 'Government', 'Law', 'Religion', 'People Finder', 'Nonprofit Organizations', 'Community'],
  ];
  function links(u, parent) {
    ['Home', 'Help', 'Site Map', 'Contact'].forEach((x, i) => {
      if (i) u.el('i', '', parent, '|');
      u.el('a', '', parent, x);
    });
  }
  function column(u, board, groups) {
    const col = u.el('aside', 'ww-column', board);
    groups.forEach((g) => {
      const card = u.el('section', 'ww-category', col);
      u.el('h2', '', card, g[0]);
      const list = u.el('div', 'ww-links', card);
      g.slice(1).forEach((s) => u.el('a', '', list, s));
    });
    return col;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const header = u.el('div', 'ww-instruction', document.body);
      header.classList.toggle('ww-instruction-empty', _c.display !== 'header');
      u.el('span', 'ww-date', header, 'April 27, 1998');
      const mast = u.el('header', 'ww-masthead', document.body);
      u.el('div', 'ww-globe', mast, '🌎');
      const identity = u.el('div', 'ww-identity', mast);
      u.el('b', '', identity, 'WorldWeb Directory');
      u.el('small', '', identity, 'Your Guide to the Internet');
      const search = u.el('div', 'ww-search', mast);
      u.el('label', '', search, 'Search the Web:');
      const input = u.el('input', '', search);
      input.setAttribute('aria-label', 'Search the Web');
      u.el('button', '', search, 'Search').type = 'button';
      links(u, u.el('nav', 'ww-nav', mast));
      Object.assign(_c, { header, mast });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.classList.toggle('ww-has-end', _c.headerTools.childElementCount > 0);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ww-board', document.body);
      const left = column(u, body, catsL);
      const center = u.el('section', 'ww-center', body);
      const right = column(u, body, catsR);
      Object.assign(_c, { body, left, center, right });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ww-note-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task Instructions';
        _c.left.prepend(panel);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.center);
      const featured = u.el('section', 'ww-featured', _c.center);
      u.el('h2', '', featured, "Today's Featured Links");
      const fl = u.el('div', 'ww-feature-list', featured);
      [
        ['Space Exploration', 'World News', 'Healthy Living'],
        ['Travel Guide', 'Classic Literature', 'Science Resources'],
      ].forEach((group) => {
        const g = u.el('div', '', fl);
        group.forEach((s) => u.el('a', '', g, s));
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ww-toast');
        _c.right.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ww-footer');
      foot.querySelector('.ref-foot-text').remove();
      const nav = _c.util.el('div', 'ww-footnav');
      links(_c.util, nav);
      foot.prepend(nav);
      const copy = _c.util.el('span', 'ww-copyright');
      copy.textContent = '© 1998 WorldWeb Directory. All rights reserved.';
      nav.after(copy);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const offer = ctx.kind === 'promo';
      u.el('b', 'ww-offer-title', el, offer ? 'Special Offer' : 'WorldWeb Directory');
      u.el(
        'p',
        '',
        el,
        offer
          ? 'Try WorldWeb Plus for only $9.95 a month.'
          : {
              cookie: 'We use cookies to remember your preferences.',
              toast: 'Changes synced.',
              chat: 'Hello. How can we help?',
              banner: 'Scheduled maintenance tonight.',
            }[ctx.kind] || 'Welcome to WorldWeb Directory.',
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-popup-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#001caa'],
      LOW_ACCENTS: ['#001caa'],
      parts,
    },
  });
})();
