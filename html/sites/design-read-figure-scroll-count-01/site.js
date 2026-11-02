(() => {
  'use strict';
  const SITE = 'design-read-figure-scroll-count-01';
  const palette = { bg: '#b8e4fb', panel: '#f8fcff', fg: '#09234c', muted: '#23466a', line: '#91c9ed' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if (_c.W <= 1100 || _c.H < 700) {
        if (display === 'panel' || display === 'toast') display = 'header';
      }
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('aero', 'inspector', `instruction-${_c.display}`);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Aero Files');
      const toolbar = u.el('div', 'aero-tools', app);
      Object.assign(_c, { app, header: top, toolbar });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'menu', document.body);
      const dockItems = [
        ['Home','M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10'],
        ['Files','M3 7h7l2 2h9v11H3z M3 7V5h7l2 2'],
        ['Photos','M4 7h16v13H4z M8 7l1.5-3h5L16 7 M12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7'],
        ['Music','M10 18V5l10-2v13 M10 18a3 2.5 0 1 1-6 0 3 2.5 0 0 1 6 0 M20 16a3 2.5 0 1 1-6 0 3 2.5 0 0 1 6 0'],
        ['Videos','M4 5h16v14H4z M9 5v14 M15 5v14 M4 9h5m6 0h5M4 15h5m6 0h5'],
        ['Internet','M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20'],
        ['Settings','M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'],
      ];
      dockItems.forEach(([label, path], index) => {
        const item = u.el('div', `dock-item${index === 1 ? ' active' : ''}`, menu);
        const icon = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, item);
        u.svg('path', { d: path, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, icon);
        u.el('span', '', item, label);
      });
    },
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
      const body = u.el('div', 'center', _c.app);
      const aside = u.el('aside', 'aside', document.body);
      Object.assign(_c, { body, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) panel.querySelector('.ref-panel-title').textContent = 'Task instructions';
      const u = _c.util;
      const folderBox = u.el('b', 'folder-preview', _c.aside, '');
      const folder = u.svg('svg', { viewBox: '0 0 180 150', class: 'inspector-folder', 'aria-hidden': 'true' }, folderBox);
      const defs = u.svg('defs', {}, folder);
      const back = u.svg('linearGradient', { id: 'folderBack', x1: '0', y1: '0', x2: '0.15', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#fff27b' }, back); u.svg('stop', { offset: '.45', 'stop-color': '#ffd529' }, back); u.svg('stop', { offset: '1', 'stop-color': '#efa900' }, back);
      const face = u.svg('linearGradient', { id: 'folderFace', x1: '0', y1: '0', x2: '.2', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#fff98a' }, face); u.svg('stop', { offset: '.5', 'stop-color': '#ffdb37' }, face); u.svg('stop', { offset: '1', 'stop-color': '#f4b20a' }, face);
      const folderShadow = u.svg('filter', { id: 'folderShadow', x: '-30%', y: '-30%', width: '160%', height: '180%' }, defs);
      u.svg('feDropShadow', { dx: '0', dy: '3', stdDeviation: '3', 'flood-color': '#49677c', 'flood-opacity': '.45' }, folderShadow);
      u.svg('path', { d: 'M22 45V30q0-8 9-8h43l15 17h61q9 0 9 9v66q0 10-10 10H31q-9 0-9-10z', fill: 'url(#folderBack)', stroke: '#ce9300', 'stroke-width': 3, filter: 'url(#folderShadow)' }, folder);
      u.svg('path', { d: 'M24 61q0-10 10-10h43l14 16h58q10 0 10 10v38q0 9-10 9H33q-9 0-9-10z', fill: 'url(#folderFace)', stroke: '#d49a00', 'stroke-width': 3 }, folder);
      u.svg('path', { d: 'M31 59h45l12 13h61', fill: 'none', stroke: '#fff9b1', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: '.9' }, folder);
      const details = u.el('div', 'aside-copy', _c.aside);
      [['Name:', 'Holiday Photos'], ['Type:', 'File Folder'], ['Location:', 'C:\\Users\\Public\\Pictures'], ['Size:', '—'], ['Modified:', 'Mar 12, 2006  10:24 AM']].forEach(([label, value]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', 'detail-label', row, label);
        u.el('span', 'detail-value', row, value);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-toast');
        const title = _c.util.el('b', '', null, 'Task note');
        note.prepend(title);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = { cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.', chat: 'Need help with this exercise?', promo: 'Try the new practice collection.', banner: 'An updated practice collection is available.' };
      u.el('span', '', el, messages[ctx.kind] || '');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: SITE,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { [SITE]: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1680c6'],
      LOW_ACCENTS: ['#1680c6'],
      parts,
    },
  });
})();
