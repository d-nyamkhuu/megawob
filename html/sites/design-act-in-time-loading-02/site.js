(function () {
  'use strict';
  const palette = { bg: '#c6c6c6', panel: '#d0d0d0', fg: '#111', muted: '#444', line: '#777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const title = u.el('header', 'os-title', document.body);
      u.el('span', 'os-appicon', title, '▣');
      u.el('strong', '', title, 'IBM Books - Search');
      const win = u.el('div', 'os-window', title);
      ['−', '□', '×'].forEach((x) => u.el('span', 'os-window-btn', win, x));
      const menu = u.el('nav', 'os-menu', document.body);
      ['File', 'Edit', 'View', 'Search', 'Bookmarks', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'os-tools', document.body);
      [ ['↶', 'Back'], ['↷', 'Forward'], ['⌂', 'Home'], ['⌕', 'Search'], ['◫', 'Topics'], ['▤', 'Library'] ].forEach(([i, t]) => {
        const b = u.el('div', 'os-tool', tools);
        u.el('b', '', b, i);
        u.el('span', '', b, t);
      });
      const apphead = u.el('div', 'os-apphead', document.body);
      u.el('span', 'os-bookmark', apphead, '◫');
      u.el('strong', '', apphead, 'IBM Books');
      u.el('i', '', apphead, 'Technical and General Reading for a Smarter Workplace');
      Object.assign(_c, { header: apphead, tools });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('os-note', 'os-note-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'os-frame', document.body);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: document.body });
      const panel = document.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('os-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const searchrow = u.el('div', 'os-query', _c.body);
      u.el('label', '', searchrow, 'Search for:');
      u.el('div', 'os-queryspace', searchrow);
      const help = u.el('footer', 'os-help', _c.body);
      u.el('b', '', help, 'Search Tips');
      [
        ['▪', 'Type one or more words and click Search.'],
        ['▪', 'Use quotes for an exact phrase (e.g. “road map”).'],
        ['▪', 'You can use AND, OR to combine words (e.g. computer AND hardware).'],
        ['▪', "Browse Categories if you're not sure of the exact words."],
      ].forEach(([b, t]) => {
        const item = u.el('div', 'os-tip', help);
        u.el('b', '', item, b);
        u.el('span', '', item, t);
      });
      _c.end = u.el('div', 'os-end', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('os-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.end.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.end.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'os-overlay os-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies to remember your preferences.',
        toast: 'Your search preferences have been saved.',
        chat: 'IBM Books help desk. How may we assist?',
        promo: 'Discover the latest workplace titles.',
        banner: 'Library services are available during regular business hours.',
      };
      u.el('span', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-loading-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#008b96'], LOW_ACCENTS: ['#008b96'], parts },
  });
})();
