(function () {
  'use strict';
  const palette = { bg: '#bd2024', panel: '#faf7ec', fg: '#090909', muted: '#666666', line: '#a5a5a5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('bauhaus-notebook', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const center = u.el('div', 'center', app);
      const header = u.el('header', 'notebook-heading', center);
      const toolbar = u.el('div', 'notebook-toolbar', center);
      Object.assign(_c, { app, center, header, toolbar });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('aside', 'aside', document.body);
      const entries = ['Math', 'Notes', 'Help', 'Settings'];
      entries.forEach((label, i) => {
        const tab = u.el('div', 'notebook-tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', tab, label);
        const icon = u.svg('svg', { class: 'tab-icon', viewBox: '0 0 60 60', 'aria-hidden': 'true' }, tab);
        if (i === 0) {
          u.svg('rect', { x: 7, y: 4, width: 46, height: 52, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, icon);
          for (let y = 14; y < 49; y += 12)
            for (let x = 16; x < 48; x += 12)
              u.svg('rect', { x, y, width: 7, height: 7, rx: 1, fill: 'currentColor' }, icon);
        } else if (i === 1) {
          u.svg('rect', { x: 7, y: 4, width: 46, height: 52, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, icon);
          for (let y = 15; y < 48; y += 9)
            u.svg('path', { d: `M17 ${y}h27`, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, icon);
        } else if (i === 2) {
          u.svg('circle', { cx: 30, cy: 30, r: 25, fill: 'none', stroke: 'currentColor', 'stroke-width': 4 }, icon);
          const q = u.svg('text', { x: 30, y: 43, 'text-anchor': 'middle', 'font-size': 39, 'font-family': 'Arial', 'font-weight': 700, fill: 'currentColor' }, icon);
          q.textContent = '?';
        } else {
          const gear = u.svg('text', { x: 30, y: 48, 'text-anchor': 'middle', 'font-size': 52, 'font-family': 'Arial', fill: 'currentColor' }, icon);
          gear.textContent = '⚙';
        }
      });
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
      if (_c.submit) _c.submit.classList.add('notebook-end-' + _c.placement);
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.center.appendChild(foot);
      if (_c.submit) _c.submit.classList.add('notebook-end-' + _c.placement);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.center.appendChild(dock);
      if (_c.submit) _c.submit.classList.add('notebook-end-' + _c.placement);
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
    name: 'design-solve-puzzle-algebra-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-algebra-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c92327'],
      LOW_ACCENTS: ['#c92327'],
      parts,
    },
  });
})();
