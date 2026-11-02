(function () {
  'use strict';
  const palette = { bg: '#f7f8f9', panel: '#ffffff', fg: '#101522', muted: '#8797ad', line: '#8797ad' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original portal uses its center pane for each instruction mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('directory', 'split-level', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top),
        globe = u.svg('svg', { width: 100, height: 100, viewBox: '0 0 100 100', class: 'globe' }, brand);
      u.svg('circle', { cx: 50, cy: 50, r: 47, fill: '#0757ce' }, globe);
      u.svg('path', {
        d: 'M48 5c-8 9-9 18-4 25l-8 9 6 8-9 7 8 12-1 11 9 17 10-6-2-13 10-13-3-9 11-9-9-6 8-9-8-7 2-12-13-7z',
        fill: '#5cbd57', stroke: '#e8eeff', 'stroke-width': 1,
      }, globe);
      u.el('div', 'brand-copy', brand, 'WorldWeb');
      u.el('div', 'brand-tag', brand, 'Your Guide to the Internet');
      const search = u.el('div', 'search-box', top);
      u.el('strong', '', search, 'Search the Web:');
      const field = u.el('input', 'search-input', search);
      field.type = 'text';
      field.setAttribute('aria-label', 'Search the Web');
      const sb = u.el('button', 'search-button', search, 'Search');
      sb.type = 'button';
      u.el('div', 'search-modes', search, '◉  Web Pages       ◯  Directories       ◯  News');
      const quick = u.el('div', 'quick-links', top);
      u.el('div', '', quick, 'Home  |  Help  |  Site Map  |  Contact');
      u.el('div', 'date', quick, 'Monday, March 9, 1998');
      const center = u.el('section', 'center');
      Object.assign(_c, { app, quick, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const directory = u.el('nav', 'directory-links', _c.app);
      const groups = [
        ['Arts & Humanities', 'Literature', 'History', 'Visual Arts', 'Performing Arts', 'Philosophy', 'More...'],
        ['Business & Economy', 'Companies', 'Investing', 'Jobs', 'Real Estate', 'Small Business', 'More...'],
        ['Computers & Internet', 'Hardware', 'Software', 'Internet', 'Programming', 'Multimedia', 'More...'],
        ['Education', 'K-12', 'Colleges & Universities', 'Distance Learning', 'Libraries', 'Reference', 'More...'],
        ['Health', 'Medicine', 'Mental Health', 'Fitness', 'Nutrition', 'Diseases', 'More...'],
        ['Recreation & Sports', 'Travel', 'Outdoors', 'Sports', 'Games', 'Hobbies', 'More...'],
      ];
      groups.forEach((items) => {
        const col = u.el('div', 'directory-column', directory);
        u.el('strong', '', col, items[0]);
        items.slice(1).forEach((label) => {
          const a = u.el('a', '', col, label);
          a.href = '#';
          a.addEventListener('click', (e) => e.preventDefault());
        });
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'instruction-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.quick;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.app.appendChild(_c.center);
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'instruction-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-odd-even-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0649c9'], LOW_ACCENTS: ['#0649c9'], parts,
    },
  });
})();
