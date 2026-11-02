(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#111111', muted: '#5c6370', line: '#a4adbb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const link = (p, t, cls) => u.el('a', cls || '', p, t);
      const page = u.el('div', 'catalog-page', document.body);
      const rail = u.el('aside', 'catalog-rail', page);
      u.el('div', 'campus-photo', rail);
      const nav = u.el('nav', 'rail-links', rail);
      ['Search Catalog', 'Advanced Search', 'Browse Subjects', 'New Arrivals', 'Journal Titles', 'Reserves', 'My Account']
        .forEach((t, i) => link(nav, t, i === 0 ? 'selected' : ''));
      const secondary = u.el('nav', 'rail-secondary', rail);
      ['Library Home', 'Hours', 'Using the Catalog', 'Research Help'].forEach((t) => link(secondary, t, ''));
      const content = u.el('div', 'catalog-content', page);
      const head = u.el('header', 'catalog-head', content);
      const identity = u.el('div', 'identity', head);
      u.el('div', 'uni-title', identity, 'Riverton University Library');
      u.el('div', 'uni-subtitle', identity, 'Online Catalog');
      const topnav = u.el('nav', 'topnav', head);
      ['Home', 'Help', 'About', 'Contact'].forEach((t, i) => {
        if (i) u.el('span', 'nav-divider', topnav, '|');
        link(topnav, t, '');
      });
      Object.assign(_c, { page, rail, content, head, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'task-note-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const banner = u.el('section', 'intro-banner', _c.content);
      u.el('h1', '', banner, 'Find Books, Journals, and More');
      u.el('p', '', banner, 'Search our collection of books, journals, maps, audiovisual materials and electronic resources.');
      u.el('div', 'books-photo', banner);
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-panel');
      if (note) note.classList.add('task-note', 'task-note-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stats = u.el('div', 'catalog-stats', _c.content);
      ['Total items in catalog: 352,416', 'Books: 278,993', 'Journals: 56,204', 'Audio/Visual: 12,379', 'Maps: 4,840'].forEach((t, i) => {
        if (i) u.el('span', 'stats-sep', stats, '|');
        u.el('span', '', stats, t);
      });
      _c.stage = u.el('main', 'catalog-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'task-note-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('catalog-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'catalog-overlay catalog-overlay-' + ctx.kind, document.body);
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
    name: 'design-act-in-time-loading-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-loading-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000ee'],
      LOW_ACCENTS: ['#0000ee'],
      parts,
    },
  });
})();
