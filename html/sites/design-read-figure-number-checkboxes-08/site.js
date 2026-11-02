(function () {
  'use strict';
  const palette = { bg: '#0a2c56', panel: '#f8f7ee', fg: '#09264c', muted: '#63738a', line: '#12345d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame has dedicated panel and toast layouts at every size.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'pixel-craft instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        tabs = u.el('nav', 'menu', top);
      ['Draw', 'View', 'Settings', 'Help'].forEach((label, i) => {
        const tab = u.el('div', 'ribbon-tab' + (!i ? ' active' : ''), tabs, label);
        tab.setAttribute('aria-hidden', 'true');
        tab.addEventListener('click', () => env.log('decoy', { label, what: 'tab' }));
      });
      const toolbar = u.el('div', 'header-tools', top);
      const ribbon = u.el('section', 'ribbon', app),
        tools = u.el('div', 'tool-strip', ribbon);
      const toolData = [
        ['Select', 'select', '▸'], ['Eraser', 'eraser', '◩'],
        ['Fill', 'fill', '■'], ['Clear', 'clear', '□'],
        ['Undo', 'undo', '↶'], ['Redo', 'redo', '↷'], ['Show Grid', 'grid', '▦'],
      ];
      toolData.forEach((item, i) => {
        if ([2, 4, 6].includes(i)) u.el('i', 'tool-divider', tools);
        const b = u.el('div', 'ribbon-tool' + (!i ? ' chosen' : ''), tools);
        b.addEventListener('click', () => env.log('decoy', { label: item[0], what: 'tool' }));
        u.el('span', 'tool-icon ' + item[1], b, item[2]);
        if (item[1] === 'grid') u.el('span', 'fake-check', b, '✓');
        u.el('b', 'tool-label', b, item[0]);
      });
      const iconPaths = {
        undo: 'M8 8H20V3L3 18 20 33V25H37V46H49V20H45V12H8Z',
        redo: 'M44 8H32V3L49 18 32 33V25H15V46H3V20H7V12H44Z',
      };
      ['undo', 'redo'].forEach((name) => {
        const icon = tools.querySelector('.tool-icon.' + name);
        icon.textContent = '';
        const svg = u.svg('svg', { viewBox: '0 0 54 52', 'aria-hidden': 'true' }, icon);
        u.svg('path', {
          d: iconPaths[name], fill: name === 'undo' ? '#249fdb' : '#9aa9b9',
          stroke: name === 'undo' ? '#09264c' : '#63738a',
          'stroke-width': 3, 'stroke-linejoin': 'miter',
        }, svg);
        u.svg('path', {
          d: name === 'undo' ? 'M8 17L18 8V15H41V21' : 'M44 17L34 8V15H11V21',
          fill: 'none', stroke: name === 'undo' ? '#83cdf0' : '#c7d2dd', 'stroke-width': 2,
        }, svg);
      });
      const eraser = tools.querySelector('.tool-icon.eraser');
      eraser.textContent = '';
      const eraserArt = u.svg('svg', { viewBox: '0 0 62 62', 'aria-hidden': 'true' }, eraser);
      u.svg('path', { d: 'M38 3H46V7H50V11H54V15H58V25L26 57H16V53H12V49H8V45H4V35L34 5H38Z', fill: '#09264c' }, eraserArt);
      u.svg('path', { d: 'M38 7H44V11H48V15H52V19H54V23L35 42 17 24Z', fill: '#f3b5b1' }, eraserArt);
      u.svg('path', { d: 'M15 27 33 45 24 53H18V49H14V45H10V41H8V37Z', fill: '#fff' }, eraserArt);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center);
      Object.assign(_c, { app, toolbar, center, brief, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.brief.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('status');
      status.textContent = 'Ready.';
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
    name: 'design-read-figure-number-checkboxes-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0789bd'], LOW_ACCENTS: ['#0789bd'], parts,
    },
  });
})();
