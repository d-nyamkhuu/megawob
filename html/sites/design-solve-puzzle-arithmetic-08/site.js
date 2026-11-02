(function () {
  'use strict';
  const palette = { bg: '#24170f', panel: '#f3eddf', fg: '#20160f', muted: '#9a8766', line: '#9a8766' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'walnut-studio instruction-' + _c.display;
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      const mark = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36', class: 'title-icon' }, brand);
      u.svg('rect', { x: 2, y: 2, width: 32, height: 32, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, mark);
      const sigma = u.svg('text', { x: 18, y: 27, 'text-anchor': 'middle', 'font-size': 27, 'font-family': 'Georgia', fill: 'currentColor' }, mark);
      sigma.textContent = 'Σ';
      u.el('span', 'brand-name', brand, 'Math Workspace');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        u.el('div', 'window-button ' + kind, wc, kind === 'min' ? '−' : kind === 'max' ? '□' : '×');
      }
      const center = u.el('div', 'center', app),
        bench = u.el('section', 'bench', center),
        heading = u.el('div', 'work-heading', bench);
      u.el('h1', '', heading, 'Arithmetic Practice');
      u.el('div', 'ornament', heading, '❧');
      Object.assign(_c, { app, top, center, bench, header: bench });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', _c.center);
      const details = u.el('section', 'inspector-panel details', aside);
      u.el('div', 'panel-heading', details, 'Task Details');
      const rows = [
        ['Task', 'Arithmetic Calculation'],
        ['Difficulty', 'Basic'],
        ['Input', 'Keyboard or Mouse'],
        ['Answer Format', 'Whole number'],
      ];
      const table = u.el('div', 'detail-rows', details);
      rows.forEach((row) => {
        const r = u.el('div', 'detail-row', table);
        u.el('span', '', r, row[0]);
        u.el('strong', '', r, row[1]);
      });
      const tools = u.el('section', 'inspector-panel tool-panel', aside);
      u.el('div', 'panel-heading', tools, 'Tools');
      const toolList = u.el('div', 'tool-list', tools);
      [['▦', 'Calculator'], ['◩', 'Clear'], ['⟲', 'Reset']].forEach((item) => {
        const b = u.el('button', 'tool-button', toolList);
        b.type = 'button';
        u.el('span', 'tool-icon', b, item[0]);
        u.el('span', '', b, item[1]);
      });
      if (_c.display !== 'panel') {
        const notes = u.el('section', 'inspector-panel notes-panel', aside);
        u.el('div', 'panel-heading', notes, 'Notes');
        const paper = u.el('div', 'notes-paper', notes);
        for (let i = 0; i < 5; i++) u.el('i', '', paper);
      }
      Object.assign(_c, { aside, body: _c.center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const card = _c.aside.querySelector('.ref-panel');
      if (card) {
        card.classList.add('inspector-panel', 'instruction-card');
        const title = card.querySelector('.ref-panel-title');
        title.classList.add('panel-heading');
        title.textContent = 'Exercise';
        card.querySelector('.ref-panel-text').classList.add('instruction-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.bench);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief', 'toast-note');
        _c.bench.insertBefore(note, _c.stage);
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
      if (_c.placement) document.body.classList.add('end-' + _c.placement);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
    name: 'design-solve-puzzle-arithmetic-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-arithmetic-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b38a43'],
      LOW_ACCENTS: ['#b38a43'],
      parts,
    },
  });
})();
