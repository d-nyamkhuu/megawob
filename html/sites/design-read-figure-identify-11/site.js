(function () {
  'use strict';
  const NOTES = [
    ['New message', '10:18', 'Team update available\nin your inbox.', '#2b7cf6', 'M3 5h18v14H3z'],
    ['System update', '10:16', 'A restart is recommended\nfor the latest security fixes.', '#9161df',
      'M12 3a2 2 0 0 0-2 2 5 5 0 0 0-4 5v5l-2 3h16l-2-3v-5a5 5 0 0 0-4-5 2 2 0 0 0-2-2zM9 20h6l-3 2z'],
    ['Calendar reminder', '10:12', 'Design meeting\nin 10 minutes.', '#10a970',
      'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M8 12h1v1H8zM12 12h1v1h-1zM16 12h1v1h-1zM8 16h1v1H8zM12 16h1v1h-1zM16 16h1v1h-1z'],
    ['Cloud sync complete', '10:07', 'Your files are up to date.', '#687180',
      'M7 17a4 4 0 0 1 0-8 5 5 0 0 1 10 1 3.5 3.5 0 0 1 0 7z'],
  ];
  const palette = { bg: '#f3f4f5', panel: '#ffffff', fg: '#101521', muted: '#505c70', line: '#d3d7df' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'gnome brief-left instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      app.classList.toggle('finish-mode', _c.ctx.finish);
      app.classList.add('end-' + _c.placement);
      const bar = u.el('div', 'gbar', app);
      u.el('span', 'g-act', bar, 'Activities');
      const ap = u.el('span', 'g-app', bar);
      u.el('i', 'g-dot', ap);
      u.el('b', '', ap, 'Shape Quiz');
      u.el('span', 'g-clock', bar, 'Apr 26  10:24');
      const tray = u.el('span', 'g-tray', bar);
      const ti = u.svg('svg', { width: 70, height: 18, viewBox: '0 0 70 18' }, tray);
      u.svg('path', { d: 'M3 7a9 9 0 0 1 12 0M6 10a5 5 0 0 1 6 0', fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ti);
      u.svg('path', { d: 'M26 7h3l4-3v10l-4-3h-3z', fill: '#fff' }, ti);
      u.svg('rect', { x: 48, y: 4, width: 10, height: 11, rx: 2, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ti);
      const top = u.el('header', 'top', app);
      const ic = u.el('i', 'h-icon', top);
      u.el('i', '', ic);
      u.el('span', 'h-title', top, 'Shape Quiz');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M4 10h12' : kind === 'max' ? 'M5 5h10v10H5z' : 'M5 5l10 10M15 5L5 15',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      const side = u.el('section', 'side', center);
      u.el('h2', '', side, 'Workspace');
      u.el('p', '', side, 'A simple workspace for exploring geometric figures and their names.');
      const ul = u.el('ul', '', side);
      ['There is one correct answer.', 'Click a button to select it.'].forEach((t, i) => {
        const li = u.el('li', '', ul);
        const s = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26' }, li);
        if (i === 0) {
          u.svg('circle', { cx: 13, cy: 13, r: 10, fill: 'none', stroke: '#222', 'stroke-width': 2 }, s);
          u.svg('circle', { cx: 13, cy: 13, r: 4, fill: '#222' }, s);
        } else u.svg('path', { d: 'M8 4v16l4-4 3 6 3-1-3-6h5z', fill: '#222' }, s);
        u.el('span', '', li, t);
      });
      Object.assign(_c, { app, top, center, side, header: top });
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
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
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
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const tools = foot.querySelector('.ref-tools');
      foot.querySelector('.ref-foot-text').remove();
      const tm = u.el('div', 'timer', foot);
      const tsv = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, tm);
      u.svg('circle', { cx: 20, cy: 20, r: 16, fill: 'none', stroke: '#222', 'stroke-width': 3 }, tsv);
      u.svg('path', { d: 'M20 10v10l6 4', fill: 'none', stroke: '#222', 'stroke-width': 3 }, tsv);
      u.el('span', '', tm, 'Timer\nPaused');
      u.el('div', 'tnote', foot, 'The timer will start after notifications are cleared.');
      u.el('i', 'vsep', foot);
      const reset = u.el('button', 'reset', foot, 'Reset');
      reset.type = 'button';
      foot.appendChild(tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay notes ' + ctx.kind, document.body);
      const hd = u.el('div', 'nhead', el);
      u.el('b', '', hd, 'Notifications (4)');
      const dismiss = u.el('button', 'dismiss-all', hd, 'Dismiss all');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      NOTES.forEach((n) => {
        const c = u.el('div', 'ncard', el);
        const ico = u.el('i', 'nico', c);
        ico.style.background = n[3];
        const s = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 24 24' }, ico);
        u.svg(
          'path',
          {
            d: n[4],
            fill: ['Cloud sync complete', 'System update', 'New message'].includes(n[0]) ? '#fff' : 'none',
            stroke: n[0] === 'New message' ? '#2b7cf6' : '#fff',
            'stroke-width': 1.5,
          },
          s,
        );
        if (n[0] === 'New message')
          u.svg(
            'path',
            { d: 'M3 5l9 8 9-8M3 19l6-6M21 19l-6-6', fill: 'none', stroke: '#2b7cf6', 'stroke-width': 1.2 },
            s,
          );
        const t = u.el('div', 'ntext', c);
        const r = u.el('div', 'nrow', t);
        u.el('b', '', r, n[0]);
        u.el('span', '', r, n[1]);
        u.el('p', '', t, n[2]);
        u.el('span', 'nx', c, '✕');
      });
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-identify-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/read-figure-identify-05a342.css', 'gnome.css', 'templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'toast' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d70ef'],
      LOW_ACCENTS: ['#1d70ef'],
      parts,
    },
  });
})();
