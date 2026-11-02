(function () {
  'use strict';
  const palette = { bg: '#d5d5d5', panel: '#ffffff', fg: '#102b54', muted: '#4c5c70', line: '#aeb7c0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This catalog uses the same compact note card for header and panel modes.
      _c.display = _c.ctx.display || 'header';
      if (_c.W < 1100 && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = !_c.ctx.finish;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'electron catalog instruction-' +
        (_c.display === 'panel' ? 'header' : _c.display) + (_c.ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#ee8520', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M4 18l6-8 4 5 3-7 6 10H4z', fill: '#67a148', stroke: '#fff', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Picture Catalog');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      u.el('nav', 'menu', top, 'File    Edit    View    Picture    Tools    Help');
      const toolbar = u.el('nav', 'xp-toolbar', app);
      for (const item of [
        ['New Folder', '#e2a51b', 'M3 11h30v19H3z M3 11V6h12l4 5', 'folder'],
        ['Add Pictures', '#45a844', 'M7 3h17l7 7v22H7z M24 3v8h7 M17 16v11 M11.5 21.5h11', 'add'],
        ['View', '#91a8b9', 'M14 4a10 10 0 100 20 10 10 0 000-20 M21 21l10 10', 'view'],
        ['Slideshow', '#3682cb', 'M3 5h29v23H3z M12 33h11 M17 28v5 M14 12l10 5-10 6z', 'slide'],
        ['Rotate Left', '#2b9a48', 'M9 13H3l7-8 M4 13a13 13 0 102-5', 'rotate'],
        ['Rotate Right', '#2b9a48', 'M27 13h6l-7-8 M32 13a13 13 0 11-2-5', 'rotate'],
        ['Delete', '#e52620', 'M6 6l24 24 M30 6L6 30', 'delete'],
        ['Properties', '#5186bf', 'M4 4h28v28H4z M9 9h7v7H9z M20 10h8 M20 14h8 M9 22h19 M9 26h19', 'props'],
      ]) {
        const b = u.el('button', 'xp-tool', toolbar);
        const svg = u.svg('svg', { viewBox: '0 0 36 36', class: 'xp-tool-icon ' + item[3] }, b);
        u.svg('path', { d: item[2], fill: item[3] === 'folder' ? '#ffca36' : 'none', stroke: item[1],
          'stroke-width': item[3] === 'delete' ? 3.4 : item[3] === 'view' ? 2.8 : 2.2,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
        u.el('span', '', b, item[0]);
      }
      // The instruction section runs before body; attach its card to the catalog band later.
      const noteHome = u.el('div', 'catalog-note-home');
      Object.assign(_c, { app, top, toolbar, header: noteHome, noteHome });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const folders = u.el('nav', 'folder-pane', _c.app);
      u.el('div', 'folder-heading', folders, 'Folders');
      const root = u.el('div', 'folder-row root-row', folders);
      u.el('i', 'tree-toggle', root, '−');
      u.el('i', 'tree-folder', root);
      u.el('span', '', root, 'My Pictures');
      for (const name of ['Animals', 'Holidays', 'Nature', 'People', 'Sample Pictures']) {
        const row = u.el('div', 'folder-row child-row' + (name === 'Animals' ? ' active' : ''), folders);
        u.el('i', 'tree-folder', row);
        u.el('span', '', row, name);
      }
      const body = u.el('div', 'center', _c.app);
      const band = u.el('section', 'catalog-band', body);
      const preview = u.el('div', 'catalog-preview', band);
      const photo = u.el('img', 'catalog-photo', preview);
      photo.src = 'sites/design-read-figure-spatial-04/assets/alpine-lake.webp';
      const summary = u.el('div', 'catalog-summary', band);
      u.el('h1', '', summary, 'Animals');
      u.el('p', '', summary, '6 pictures');
      u.el('p', '', summary, 'Size:  4.8 MB');
      u.el('p', '', summary, 'Type:  File Folder');
      u.el('p', '', summary, 'Date Modified:  Apr 12, 2003  10:24 AM');
      const collage = u.el('div', 'catalog-collage', band);
      for (let i = 0; i < 3; i++) {
        const print = u.el('div', 'catalog-print print-' + i, collage);
        const image = u.el('img', '', print);
        image.src = 'sites/design-read-figure-spatial-04/assets/alpine-lake.webp';
      }
      u.el('div', 'catalog-camera', collage);
      body.appendChild(_c.noteHome);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHome;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-toast');
        const title = _c.util.el('b', '', null, 'Task note');
        note.insertBefore(title, note.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      if (!footer) return;
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      const count = footer.querySelector('.ref-foot-text');
      count.classList.add('catalog-count');
      count.textContent = '6 pictures';
      const viewTools = _c.util.el('div', 'catalog-view-tools');
      for (const [cls, text] of [['view-grid', '▦'], ['view-list', '▤'], ['zoom-label', '−'], ['zoom-track', '━━●━━━━━━'], ['zoom-label', '+']]) {
        _c.util.el('span', cls, viewTools, text);
      }
      footer.insertBefore(viewTools, footer.querySelector('.ref-tools'));
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock && _c.foot) _c.foot.insertBefore(dock, _c.foot.firstChild);
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
    name: 'design-read-figure-spatial-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#1769c2'], LOW_ACCENTS: ['#1769c2'], parts },
  });
})();
