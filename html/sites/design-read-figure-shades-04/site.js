(function () {
  'use strict';
  const palette = { bg: '#207936', panel: '#c4c4c4', fg: '#111', muted: '#666', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has room for all three note locations even in the smallest window.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'gem instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const bar = u.el('header', 'menubar', app);
      const logo = u.svg('svg', { width: 30, height: 26, viewBox: '0 0 30 26', class: 'logo' }, bar);
      u.svg('path', {
        d: 'M12 1h3v10c0 7-4 12-12 14v-3c6-2 9-6 9-12zM16 1h3v9c0 6 3 10 9 12v3c-8-2-12-7-12-14zM14 1h3v24h-3z',
        fill: '#111',
      }, logo);
      for (const m of ['Desk', 'File', 'Edit', 'Options']) u.el('span', 'mi', bar, m);
      u.el('span', 'clock', bar, 'Mon Mar 10 14:27');
      const win = u.el('div', 'gwin', app);
      const tb = u.el('div', 'gtitle', win);
      u.el('span', 'gad', tb, '–');
      u.el('span', 'gtt', tb, 'Tile Selector');
      u.el('span', 'gad sm', tb, '');
      u.el('span', 'gad sm', tb, '□');
      u.el('span', 'gad sm', tb, '✕');
      const body = u.el('div', 'gbody', win);
      const center = u.el('div', 'center', body);
      const aside = u.el('aside', 'aside', body);
      Object.assign(_c, { app, header: tb, body, center, aside });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      _c.util.el('b', '', _c.aside, 'Your Selections');
      _c.util.el('p', 'aside-copy', _c.aside, 'Select tiles');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief', 'is-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.aside.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
      const u = _c.util;
      const dk = u.el('div', 'desk', _c.app);
      for (const n of ['A:', 'B:']) {
        const f = u.svg('svg', { width: 70, height: 70, viewBox: '0 0 70 70', 'shape-rendering': 'crispEdges' }, dk);
        u.svg('path', { d: 'M4 2h57l5 5v60H3V2z', fill: '#aaa', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M9 3h43v29H9z', fill: '#164f29', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M19 4h29v21H19z', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M36 6h7v16h-7z', fill: '#111' }, f);
        u.svg('path', { d: 'M7 38h53v28H7z', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M12 40h43v25H12z', fill: '#ddd', stroke: '#111', 'stroke-width': 2 }, f);
        u.svg('path', { d: 'M6 34h55M62 9v54', fill: 'none', stroke: '#eee', 'stroke-width': 2 }, f);
        const t = u.svg('text', { x: 34, y: 62, 'text-anchor': 'middle', 'font-size': 24, 'font-family': 'monospace', 'font-weight': 'bold' }, f);
        t.textContent = n;
      }
      const tr = u.svg('svg', { width: 70, height: 70, viewBox: '0 0 70 70', 'shape-rendering': 'crispEdges' }, dk);
      u.svg('path', { d: 'M17 16h37v46l-4 5H21l-4-5z', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, tr);
      u.svg('path', { d: 'M13 13l8-5h30l8 5v7H13zM28 7V3h15v4', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, tr);
      u.svg('path', { d: 'M17 13h38M21 23v38M29 23v38M37 23v38M45 23v38M52 23v38', fill: 'none', stroke: '#111', 'stroke-width': 3 }, tr);
      u.svg('path', { d: 'M24 23v38M32 23v38M40 23v38M48 23v38M18 11h34', fill: 'none', stroke: '#eee', 'stroke-width': 2 }, tr);
      u.el('span', 'tlabel', dk, 'TRASH');
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
    name: 'design-read-figure-shades-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#888'],
      LOW_ACCENTS: ['#888'],
      parts,
    },
  });
})();
