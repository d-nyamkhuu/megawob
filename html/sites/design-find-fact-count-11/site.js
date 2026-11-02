(function () {
  'use strict';
  const palette = { bg: '#b9b9b9', panel: '#dedede', fg: '#111', muted: '#454545', line: '#777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast lives above the document even at short viewports.
      _c.display = _c.ctx.display || 'hidden';
      if (_c.display === 'panel' && !_c.roomy) _c.display = 'header';
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', top, '✣');
      u.el('span', 'ds-brand', top, 'Technical Library');
      const win = u.el('div', 'ds-window', top);
      ['−', '□', '×'].forEach((text) => u.el('button', '', win, text));
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Document|Tools|Window|Help'.split('|').forEach((text) => u.el('span', '', nav, text));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      const icons = {
        Open: '<svg viewBox="0 0 36 36"><path d="M7 3h16l7 7v23H7z"/><path d="M23 3v8h7M12 16h13M12 20h13M12 24h13M12 28h9"/></svg>',
        Library: '<svg viewBox="0 0 36 36"><path d="M3 10h12l3 4h15v18H3z"/><path d="M3 14h30"/></svg>',
        Print: '<svg viewBox="0 0 36 36"><path d="M10 12V4h16v8M9 27H5V14h26v13h-4M10 22h16v11H10z"/><path d="M26 17h2"/></svg>',
        Find: '<svg viewBox="0 0 36 36"><circle cx="15" cy="15" r="10"/><path d="m22 22 10 10"/></svg>',
      };
      Object.entries(icons).forEach(([label, icon]) => {
        const b = u.el('button', 'ds-tool', toolbar);
        u.el('span', 'ds-tool-icon', b).innerHTML = icon;
        u.el('span', '', b, label);
        if (label === 'Find') b.addEventListener('click', () => {
          const target = document.querySelector('.ds-stage .rl-tbtn');
          if (target) target.click();
        });
      });
      const summary = u.el('section', 'ds-summary', document.body);
      const cover = u.el('div', 'ds-cover', summary);
      u.el('span', 'ds-paper-icon', cover, '▤');
      const info = u.el('div', 'ds-summary-title', summary);
      u.el('strong', '', info, 'The Quartz Graphics System');
      ['Technical Note', 'Version 2.1', 'March 12, 1993'].forEach((t) => u.el('span', '', info, t));
      const meta = u.el('div', 'ds-summary-meta', summary);
      [['Author:', 'NeXT Computer, Inc.'], ['Format:', 'Document'], ['Pages:', '12'], ['Size:', '542 KB'], ['Topic:', 'Graphics']].forEach(([a, b]) => {
        u.el('span', '', meta, a); u.el('span', '', meta, b);
      });
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h3', '', rail, 'Library');
      const tree = u.el('div', 'ds-tree', rail);
      [
        ['▾', '▰', 'Technical Notes', true], ['　', '▤', 'The Quartz Graphics System', true],
        ['　', '▤', 'Display PostScript'], ['　', '▤', 'Window Server Guide'],
        ['　', '▤', 'Application Kit Overview'], ['　', '▤', 'Sound and Media'],
        ['　', '▤', 'Networking Basics'], ['▸', '▰', 'Developer Guides'],
        ['▸', '▰', 'Reference'], ['▸', '▰', 'Release Notes'], ['▸', '▰', 'Samples'],
      ].forEach(([chev, icon, label, active]) => {
        const row = u.el('div', `ds-tree-row${active ? ' active' : ''}`, tree);
        u.el('span', 'ds-tree-chev', row, chev);
        u.el('span', 'ds-tree-icon', row, icon);
        u.el('span', 'ds-tree-label', row, label);
      });
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, toolbar, body, rail, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const title = _c.util.el('strong', '', null, 'Task');
        note.prepend(title);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-head-tools');
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const title = _c.rail.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.main);
      const inspector = u.el('aside', 'ds-inspector', _c.main);
      const it = u.el('div', 'ds-inspector-title', inspector);
      u.el('strong', '', it, 'Document Inspector'); u.el('span', '', it, '▴');
      u.el('h3', '', inspector, 'General');
      const facts = u.el('div', 'ds-facts', inspector);
      [['Title:', 'The Quartz Graphics System'], ['Author:', 'NeXT Computer, Inc.'], ['Version:', '2.1'], ['Date:', 'March 12, 1993'], ['Pages:', '12'], ['Size:', '542 KB'], ['Topic:', 'Graphics']].forEach(([a, b]) => {
        u.el('span', '', facts, a); u.el('span', '', facts, b);
      });
      u.el('h3', 'ds-key-title', inspector, 'Keywords');
      const kws = u.el('div', 'ds-keywords', inspector);
      ['Quartz', 'graphics', 'rendering', 'Window Server', 'compositing', 'PostScript', 'NeXTSTEP', 'images', 'fonts'].forEach((t) => u.el('div', '', kws, t));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        const title = _c.util.el('strong', '', null, 'Task');
        note.prepend(title);
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('ds-ready');
      text.textContent = 'Ready';
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
    name: 'design-find-fact-count-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#333'], LOW_ACCENTS: ['#333'], parts },
  });
})();
