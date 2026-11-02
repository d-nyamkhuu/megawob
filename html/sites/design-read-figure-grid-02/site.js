(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-grid-02',
    title: 'Coordinate Plotter',
    menu: 'File     Edit     View     Tools     Help',
    note: 'Feedback',
    aside: 'Click a point on the grid\nto see the coordinates here.',
  };
  const palette = { bg: '#071c2c', panel: '#102b40', fg: '#c9e2f2', muted: '#a9cce2', line: '#42637d' };
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
      const { util: u, ctx, display } = _c;
      document.body.classList.add('blueprint', 'instruction-' + display);
      document.body.classList.toggle('finish', !!ctx.finish);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 16, height: 16, rx: 2, fill: '#8bd9ed', stroke: '#e4f4fa' }, icon);
      u.svg('path', { d: 'M5 14l3-7 3 7 2-4 2 4', fill: 'none', stroke: '#173b53', 'stroke-width': 1.3 }, icon);
      u.el('span', 'window-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [['min', '−'], ['max', '□'], ['close', '×']])
        u.el('span', 'window-control ' + kind, wc, label);
      u.el('nav', 'menu', app, C.menu);
      const workspace = u.el('div', 'workspace', app);
      const main = u.el('section', 'main-column', workspace);
      const brief = u.el('div', 'brief', main);
      u.el('b', 'brief-label', brief, 'Task');
      Object.assign(_c, { app, top, workspace, main, brief, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.brief.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
      _c.util.el('p', 'brief-copy', _c.brief,
        'Use the mouse to select the correct point on the grid.\nDo not enter coordinates manually.');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('episode-actions');
    },
    'frame.body': () => (_c) => {
      const aside = _c.util.el('aside', 'aside', _c.workspace);
      Object.assign(_c, { aside, body: _c.workspace });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task instructions';
      }
      const u = _c.util;
      u.el('header', 'aside-head', _c.aside, C.note);
      const readout = u.el('div', 'readout-panel', _c.aside);
      for (const line of ['Selected Coordinate:　　 —　 —', 'X value:　　　　　　　 —', 'Y value:　　　　　　　 —', 'Distance from Origin:　 —'])
        u.el('div', 'readout-line', readout, line);
      u.el('p', 'aside-copy', _c.aside, C.aside);
      _c.sideFoot = u.el('footer', 'side-foot', _c.aside);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('section', 'stage', _c.main);
      u.el('div', 'plot-heading', stage, 'Coordinate Grid');
      const toolbar = u.el('div', 'plot-toolbar', stage);
      const tools = u.el('div', 'plot-tools', toolbar);
      ['➤', '♧', '⊕', '⊖', '⌖'].forEach((symbol, i) => {
        const b = u.el('span', 'tool-button' + (i === 0 ? ' active' : ''), tools, symbol);
        b.setAttribute('aria-hidden', 'true');
      });
      const toggles = u.el('div', 'plot-toggles', toolbar);
      ['Show Grid', 'Show Axes', 'Show Coordinates'].forEach((label) => {
        const item = u.el('span', 'plot-toggle', toggles);
        u.el('i', 'checkmark', item, '✓');
        u.el('span', '', item, label);
      });
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction-toast');
        note.setAttribute('role', 'note');
        _c.brief.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.sideFoot.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = '';
      }
      _c.util.el('footer', 'bottom', _c.app);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.sideFoot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-grid-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f4e66b'],
      LOW_ACCENTS: ['#f4e66b'],
      parts,
    },
  });
})();
