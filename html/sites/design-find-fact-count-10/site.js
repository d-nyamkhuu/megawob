(function () {
  'use strict';
  const icons = {
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8m-8 3h8"/>',
    doc: '<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    users: '<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20z"/><circle cx="10" cy="8" r="3.5"/><path d="M17 4.8a3.3 3.3 0 0 1 0 6.4m2.5 4.3a3.3 3.3 0 0 1 2.5 3.2V20h-3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-3l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.5-2.6 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.5-2.6 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h3l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.5 2.6-1.4 1.1a7 7 0 0 1 0 2z"/>',
    bulb: '<path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12.7c.8.6 1 1.3 1 2.3h6c0-1 .2-1.7 1-2.3A7 7 0 0 0 12 2z"/>',
  };
  function icon(u, parent, cls, key) {
    const el = u.el('span', cls, parent);
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`;
    return el;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design already has dedicated space for each note mode.
      _c.display = _c.ctx.display || 'hidden';
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
      const shell = u.el('div', 'fd-shell', document.body);
      const body = u.el('div', 'fd-body', shell);
      const rail = u.el('aside', 'fd-rail', body);
      icon(u, rail, 'fd-brand', 'book');
      u.el('strong', 'fd-brand-name', rail, 'FlowDocs');
      const nav = u.el('nav', 'fd-nav', rail);
      [
        ['doc', 'Documentation'], ['search', 'Search'], ['bookmark', 'Bookmarks'],
        ['clock', 'Recent'], ['users', 'Shared with me'], ['trash', 'Trash'],
      ].forEach((x, i) => {
        const item = u.el('div', 'fd-nav-item' + (i === 0 ? ' active' : ''), nav);
        icon(u, item, 'fd-nav-icon', x[0]);
        u.el('span', '', item, x[1]);
      });
      const content = u.el('div', 'fd-content', body);
      const head = u.el('header', 'fd-head', content);
      const heading = u.el('div', 'fd-head-title', head);
      u.el('h1', '', heading, 'Product Documentation');
      u.el('div', 'fd-subtitle', heading, 'Guides, references and release notes');
      const search = u.el('div', 'fd-search', head);
      icon(u, search, 'fd-search-icon', 'search');
      u.el('span', '', search, 'Search documentation...');
      Object.assign(_c, { shell, content, head, header: heading });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('fd-instruction', 'fd-instruction-header', 'shown');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('fd-head-tools');
    },
    'frame.body': () => (_c) => {
      const area = _c.util.el('div', 'fd-area', _c.content);
      Object.assign(_c, { body: area });
    },
    'frame.panel': (base) => (_c) => {
      const side = _c.util.el('aside', 'fd-side', _c.body);
      base({ ..._c, body: side });
      const note = side.querySelector('.ref-panel');
      if (note) note.classList.add('fd-card', 'fd-task-panel');
      _c.side = side;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage fd-stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.side);
      const tips = u.el('section', 'fd-card fd-tips', _c.side);
      const th = u.el('h2', 'fd-card-title', tips);
      icon(u, th, 'fd-card-icon', 'bulb');
      u.el('span', '', th, 'Tips');
      const ul = u.el('ul', '', tips);
      [
        'Use the Find button to quickly search the document.',
        'The count should include exact matches, including those in headings and within paragraphs.',
        'Lowercase or part of a longer word (do not count).',
        'Use Find to search this document.',
      ].forEach((x) => u.el('li', '', ul, x));
      const info = u.el('section', 'fd-card fd-info', _c.side);
      const ih = u.el('h2', 'fd-card-title', info);
      icon(u, ih, 'fd-card-icon', 'doc');
      u.el('span', '', ih, 'Document info');
      [
        ['Title', 'Fleet Operations Guide'], ['Type', 'Help Center Article'],
        ['Last updated', 'Mar 14, 2024'], ['Size', '48 KB'], ['Sections', '7'],
      ].forEach((x) => {
        const row = u.el('div', 'fd-info-row', info);
        u.el('span', '', row, x[0]);
        u.el('span', '', row, x[1]);
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('fd-instruction', 'fd-instruction-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'fd-dock', _c.shell);
      [
        ['home', 'Home'], ['doc', 'Documentation'], ['folder', 'Projects'],
        ['users', 'Team'], ['settings', 'Settings'],
      ].forEach((x, i) => {
        const item = u.el('div', 'fd-dock-item' + (i === 1 ? ' selected' : ''), dock);
        icon(u, item, 'fd-dock-icon', x[0]);
        u.el('span', '', item, x[1]);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'fd-overlay fd-overlay-' + ctx.kind, document.body);
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
  const palette = { bg: '#f6f8fb', panel: '#fff', fg: '#111827', muted: '#596579', line: '#d9e0e9' };
  env.site({
    name: 'design-find-fact-count-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1673e6'], LOW_ACCENTS: ['#1673e6'], parts,
    },
  });
})();
