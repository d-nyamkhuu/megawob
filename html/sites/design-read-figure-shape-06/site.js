(function () {
  'use strict';
  const ICON = {
    select: '<path d="M5 3l0 15 4-4 3 7 3-1-3-7 6 0z" fill="#111"/>',
    rect: '<rect x="4" y="5" width="16" height="14" fill="none" stroke="#333" stroke-width="1.6"/>',
    circle: '<circle cx="12" cy="12" r="9" fill="none" stroke="#333" stroke-width="1.6"/>',
    line: '<path d="M5 20L20 4" stroke="#333" stroke-width="1.6"/>',
    text: '<path d="M4 4h16M12 4v17M8 21h8M4 4v4M20 4v4" fill="none" stroke="#333" stroke-width="1.6"/>',
    zoom: '<circle cx="10" cy="10" r="7" fill="none" stroke="#333" stroke-width="1.6"/><path d="M15 15l6 6" stroke="#333" stroke-width="1.8"/>',
    fit: '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" fill="none" stroke="#333" stroke-width="1.8"/>',
    eye: '<path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7s-7-2-10-7z" fill="none" stroke="#333" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="#333"/>',
    eyeoff: '<path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7s-7-2-10-7z" fill="none" stroke="#333" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="#333"/><path d="M3 21L21 3" stroke="#333" stroke-width="1.8"/>',
  };
  const icon = (u, p, k) => {
    const s = u.el('span', 'nb-ic nb-ic-' + k, p);
    s.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24">' + ICON[k] + '</svg>';
  };
  const items = (u, parent, list) => list.forEach((t) => {
    const r = u.el('div', 'nb-item' + (t[2] ? ' on' : ''), parent);
    icon(u, r, t[0]);
    u.el('span', '', r, t[1]);
  });
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('nbook', 'stagger', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const logo = u.el('span', 'nb-logo', top);
      logo.innerHTML = '<svg width="20" height="22" viewBox="0 0 20 22"><rect x="2" y="1" width="16" height="20" rx="2" fill="#ff914b" stroke="#ffbc8e"/><path d="M5 3v16M7 3v16M9 3v16M11 3v16M13 3v16M15 3v16" stroke="#ffd0aa" stroke-width=".65"/></svg>';
      u.el('span', 'nb-title', top, 'Notebook');
      const menu = u.el('nav', 'nb-menu', top);
      ['File', 'Edit', 'View', 'Help'].forEach((m) => u.el('span', '', menu, m));
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6,
        }, svg);
      }
      const mid = u.el('div', 'nb-mid', app);
      const left = u.el('aside', 'nb-left', mid);
      u.el('h4', '', left, 'Tools');
      items(u, left, [['select', 'Select', 1], ['rect', 'Rectangle'], ['circle', 'Circle'], ['line', 'Line'], ['text', 'Text']]);
      u.el('hr', '', left);
      u.el('h4', '', left, 'View');
      items(u, left, [['zoom', 'Zoom In'], ['zoom', 'Zoom Out'], ['fit', 'Fit']]);
      const center = u.el('div', 'center', mid);
      const right = u.el('aside', 'nb-right', mid);
      Object.assign(_c, { app, top, mid, center, right, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('nb-top-actions');
    },
    'frame.body': () => (_c) => { _c.body = _c.mid; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      const panel = _c.right.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('nb-task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
      const u = _c.util;
      const right = _c.right;
      u.el('h4', '', right, 'Properties');
      ['Type', 'Color', 'Size', 'Position'].forEach((k) => {
        const r = u.el('div', 'nb-prop', right);
        u.el('span', '', r, k);
        u.el('span', '', r, '—');
      });
      u.el('hr', '', right);
      u.el('h4', '', right, 'Layers');
      items(u, right, [['eye', 'Layer 1', 1], ['eyeoff', 'Layer 2']]);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('nb-toast');
        note.setAttribute('role', 'status');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      const count = footer.querySelector('.ref-foot-text');
      count.classList.add('nb-count');
      count.textContent = 'Items: —';
      const tools = footer.querySelector('.ref-tools');
      ['Clear', 'Reset'].forEach((label) => {
        const button = _c.util.el('button', 'nb-btn', null, label);
        button.type = 'button';
        footer.insertBefore(button, tools);
      });
      _c.foot = footer;
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
  const palette = { bg: '#f1f1f1', panel: '#fcf9f2', fg: '#17212a', muted: '#444444', line: '#bbbbbb' };
  env.site({
    name: 'design-read-figure-shape-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff6a1a'],
      LOW_ACCENTS: ['#ff6a1a'],
      parts,
    },
  });
})();
