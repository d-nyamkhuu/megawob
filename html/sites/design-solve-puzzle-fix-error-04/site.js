(function () {
  'use strict';
  const palette = { bg: '#bfc1c1', panel: '#d5d6d5', fg: '#111820', muted: '#414749', line: '#666b6d' };
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
      const u = _c.util;
      document.body.classList.add('risc', 'risc-layout', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', class: 'title-icon' }, top);
      u.svg('circle', { cx: 11, cy: 9, r: 5, fill: '#b7d5ea', stroke: '#111', 'stroke-width': 2 }, icon);
      u.svg('circle', { cx: 22, cy: 9, r: 5, fill: '#b7d5ea', stroke: '#111', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M2 28v-5c0-6 4-9 9-9s9 3 9 9v5M17 16c7-3 13 1 13 8v4', fill: '#9ab4ca', stroke: '#111', 'stroke-width': 2 }, icon);
      u.el('span', '', top, 'People');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'win-' + kind, wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const toolbar = u.el('nav', 'menu', app);
      ['New', 'Edit', 'Delete', 'Find', 'Print', 'Card'].forEach((label, i) => {
        const item = u.el('div', 'tool tool-' + i, toolbar);
        u.el('span', 'tool-icon', item, ['＋', '✎', '▤', '⌕', '▣', '☷'][i]);
        u.el('span', 'tool-label', item, label);
      });
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, toolbar, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'work', _c.center);
      const index = u.el('section', 'contact-index', work);
      u.el('div', 'index-head', index, 'Contacts');
      const cols = u.el('div', 'index-cols', index);
      u.el('span', '', cols, 'Name');
      u.el('span', '', cols, 'Company');
      const list = u.el('div', 'contact-list', index);
      [
        ['Adams, Ruth', 'Blue Sky Travel'], ['Baker, Tom', 'Riverside Books'],
        ['Carter, Elaine', 'Northfield School'], ['Davies, Mark', 'Pixel Press'],
        ['Ellis, Jo', 'Sunrise Catering'], ['Foster, Helen', 'Maple Computers'],
        ['Grant, Peter', 'Hillview Clinic'], ['Hughes, Laura', 'Clover Design'],
        ['Irwin, Simon', 'Riverside Books'], ['Jones, Claire', 'Blue Sky Travel'],
        ['King, Robert', 'Eastwood Motors'], ['Lewis, Daniel', 'Maple Computers'],
        ['Morris, Anne', 'Westbridge Gallery'], ['Nelson, Chris', 'Hillview Clinic'],
        ['Owen, Victoria', 'Clover Design'], ['Parker, Steven', 'Sunrise Catering'],
      ].forEach((row, i) => {
        const r = u.el('div', 'contact-row' + (i === 0 ? ' current' : ''), list);
        u.el('span', '', r, row[0]);
        u.el('span', '', r, row[1]);
      });
      u.el('aside', 'aside', document.body);
      _c.body = work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.appendChild(note);
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
    name: 'design-solve-puzzle-fix-error-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-fix-error-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#315fa8'],
      LOW_ACCENTS: ['#315fa8'],
      parts,
    },
  });
})();
