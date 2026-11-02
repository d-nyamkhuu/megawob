(function () {
  'use strict';
  const palette = { bg: '#eee', panel: '#fff', fg: '#111', muted: '#50545a', line: '#c3c6ca' };
  const parts = {
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
      const title = u.el('header', 'ds-titlebar', document.body);
      u.el('span', 'ds-appicon', title, '▣');
      u.el('span', 'ds-brand', title, 'Riverton Chronicle – Document Viewer');
      u.el('span', 'ds-window-controls', title, '−　□　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Document', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      const icons = [
        '<svg viewBox="0 0 24 24"><path d="M3 7h7l2 2h9v10H3z"/><path d="M3 7V5h7l2 2"/></svg>',
        '<svg viewBox="0 0 24 24"><path d="M6 3h12v6H6zM5 10h14v10H5z"/><path d="M8 14h8M8 17h8"/></svg>',
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6M7 10h6"/></svg>',
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6"/></svg>',
      ];
      [['', 'Open'], ['', 'Print'], ['', 'Zoom In'], ['', 'Zoom Out'], ['100%', '▾']].forEach((x, i) => {
        const b = u.el('button', i === 4 ? 'ds-zoom' : 'ds-tool', toolbar);
        b.type = 'button';
        const icon = u.el('b', '', b);
        icon.innerHTML = i < 4 ? icons[i] : x[0];
        u.el('span', '', b, x[1]);
      });
      const main = u.el('div', 'ds-main', document.body);
      const content = u.el('main', 'ds-content', main);
      Object.assign(_c, { toolbar, main, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const inspector = u.el('aside', 'ds-inspector', _c.main);
      u.el('h2', '', inspector, 'Document Properties');
      const meta = u.el('div', 'ds-meta', inspector);
      [
        ['Title', 'Riverton Meadows Park Welcomes Visitors'],
        ['Source', 'Riverton Chronicle'],
        ['Date', 'April 18, 2011'],
        ['Author', 'Staff Writer'],
        ['Type', 'Newspaper Article'],
        ['Pages', '3'],
        ['Size', '742 KB'],
        ['Dimensions', '8.5 × 11 in'],
        ['Language', 'English'],
      ].forEach((x) => {
        const row = u.el('div', 'ds-meta-row', meta);
        u.el('span', '', row, x[0] + ':');
        u.el('span', '', row, x[1]);
      });
      u.el('h2', 'ds-pages-title', inspector, 'Pages');
      const pages = u.el('div', 'ds-pages', inspector);
      [
        ['Page 1', 'Riverton Meadows Park Welcomes Visitors'],
        ['Page 2', 'Community Events at Riverton Meadows'],
        ['Page 3', 'Park Information and Visitor Guide'],
      ].forEach((x, i) => {
        const row = u.el('div', 'ds-page ' + (!i ? 'selected' : ''), pages);
        u.el('div', 'ds-thumb', row);
        const text = u.el('div', 'ds-page-text', row);
        u.el('b', '', text, x[0]);
        u.el('span', '', text, x[1]);
        u.el('i', '', row, String(i + 1));
      });
      Object.assign(_c, { inspector, body: _c.main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
      const panel = _c.inspector.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'ds-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('ds-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ds-ready');
      ready.textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
    name: 'design-find-fact-count-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-count-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a30000'],
      LOW_ACCENTS: ['#a30000'],
      parts,
    },
  });
})();
