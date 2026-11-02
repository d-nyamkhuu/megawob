(function () {
  'use strict';
      function drawLegendIcon(u, parent, kind, size = 'legend') {
        const isRail = size === 'rail';
        const s = u.svg(
          'svg',
          {
            width: isRail ? 34 : 44,
            height: isRail ? 34 : 38,
            viewBox: '0 0 44 38',
            class: isRail ? 'rail-art' : 'legend-art',
          },
          parent,
        );
        const path = (d, fill, stroke = '#6f8594', sw = 1.3) =>
          u.svg('path', { d, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' }, s);
        const rect = (x, y, width, height, rx, fill, stroke = '#71818b') =>
          u.svg('rect', { x, y, width, height, rx, fill, stroke, 'stroke-width': 1.4 }, s);
        if (kind === 'home') {
          path('M3 17L22 3l19 14-3 4-4-3v17H10V18l-4 4z', '#d64c32', '#9b321f', 1.8);
          path('M13 35V21h18v14z', '#f7e4bd', '#987a55', 1.2);
          rect(19, 26, 7, 9, 1, '#8a6543', '#62482f');
        }
        if (kind === 'folder') {
          path('M3 9h13l4 4h21v19H3z', '#ffc629', '#bd8500', 1.5);
          path('M3 13h38v18H3z', '#ffd951', '#c18b00', 1.3);
        }
        if (kind === 'document') {
          path('M8 3h19l9 9v23H8z', '#f8fcff', '#7c8991', 1.6);
          path('M27 3v9h9', '#dbe6ed', '#7c8991', 1.4);
          for (let y = 17; y <= 29; y += 6)
            u.svg('path', { d: `M13 ${y}h17`, stroke: '#9aa8b0', 'stroke-width': 2 }, s);
        }
        if (kind === 'photo') {
          rect(4, 4, 36, 30, 2, '#eff8ff', '#647987');
          path('M7 27l9-10 7 7 5-6 9 9z', '#43a8d8', '#31815f', 1);
          path('M7 29h30v3H7z', '#54a94b', '#358746', 0.7);
        }
        if (kind === 'camera') {
          rect(4, 11, 36, 23, 4, '#aebbc3', '#596873');
          path('M10 11l4-6h15l5 6z', '#dce5e9', '#596873', 1.4);
          u.svg('circle', { cx: 23, cy: 22, r: 9, fill: '#1c3c56', stroke: '#4e5f69', 'stroke-width': 2 }, s);
          u.svg('circle', { cx: 23, cy: 22, r: 5.5, fill: '#178bd1', stroke: '#9ad6ff', 'stroke-width': 1.5 }, s);
        }
        if (kind === 'email') {
          rect(3, 6, 38, 27, 3, '#f4f8fa', '#75838d');
          path('M4 8l18 15L40 8', '#e1e8ec', '#839099', 1.8);
          path('M4 31l13-12m23 12L27 19', 'none', '#aab4ba', 1.2);
        }
        if (kind === 'people') {
          u.svg('circle', { cx: 15, cy: 12, r: 8, fill: '#078bd5', stroke: '#075a9d', 'stroke-width': 1.5 }, s);
          u.svg('circle', { cx: 30, cy: 15, r: 7, fill: '#79c530', stroke: '#468d1d', 'stroke-width': 1.5 }, s);
          path('M3 34v-4c0-8 5-13 12-13s12 5 12 13v4z', '#168ed5', '#075a9d', 1.4);
          path('M22 34v-3c0-7 4-11 10-11s10 4 10 11v3z', '#76c632', '#468d1d', 1.4);
        }
        if (kind === 'calendar') {
          rect(4, 6, 36, 29, 3, '#f8fbfd', '#637582');
          rect(4, 6, 36, 9, 2, '#df4c45', '#9c2929');
          for (let x = 12; x <= 31; x += 9) for (let y = 20; y <= 29; y += 8) rect(x, y, 5, 5, 0, '#b6c5ce', '#a6b4bc');
          u.svg('rect', { x: 11, y: 3, width: 3, height: 9, rx: 1.5, fill: '#d8e2e8', stroke: '#56636c' }, s);
          u.svg('rect', { x: 30, y: 3, width: 3, height: 9, rx: 1.5, fill: '#d8e2e8', stroke: '#56636c' }, s);
        }
        if (kind === 'star')
          path(
            'M22 3l5.8 11.6 12.8 1.8-9.3 8.9 2.2 12.2-11.5-6.1-11.5 6.1 2.2-12.2-9.3-8.9 12.8-1.8z',
            '#ffc426',
            '#d19000',
            1.8,
          );
        if (kind === 'trash') {
          path('M9 11h26l-2 23H11z', '#42494d', '#22292d', 1.7);
          path('M6 8h32v4H6z', '#30363a', '#171b1e', 1.4);
          rect(17, 4, 10, 4, 2, '#626b70', '#252b2e');
          for (const x of [16, 22, 28]) u.svg('path', { d: `M${x} 16v13`, stroke: '#d3d9dc', 'stroke-width': 2.2 }, s);
        }
        if (kind === 'clock') {
          u.svg('circle', { cx: 22, cy: 19, r: 15, fill: '#f5fbff', stroke: '#6288a9', 'stroke-width': 2.5 }, s);
          u.svg('circle', { cx: 22, cy: 19, r: 11.5, fill: '#e5f3fd', stroke: '#b8d8ee', 'stroke-width': 1.5 }, s);
          path('M22 9v10l7 5', 'none', '#4d789e', 2.3);
        }
      }
  const palette = { bg: '#fff', panel: '#fff', fg: '#123578', muted: '#71849b', line: '#cadff3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve this application's original note fallback at narrow widths.
      _c.display = _c.ctx.display || 'header';
      if (_c.W < 1120 && ['panel', 'toast'].includes(_c.display)) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = !_c.ctx.finish;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('brightworks', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const root = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', root);
      const brand = u.el('div', 'brand', top);
      u.el('span', 'leaf', brand, '');
      u.el('strong', 'brand-blue', brand, 'Bright');
      u.el('strong', 'brand-green', brand, 'Works');
      const tabs = u.el('nav', 'tabs', top);
      for (const [i, label] of ['Home', 'Documents', 'Photos', 'Contacts', 'Calendar'].entries()) {
        const a = u.el('div', 'tab' + (i === 0 ? ' active' : ''), tabs, label);
      }
      const search = u.el('div', 'searchbox', top);
      u.el('span', 'search-placeholder', search, 'Search');
      u.el('span', 'search-glass', search, '');
      Object.assign(_c, { shell: root, top });
      // The original header note is the green strip above the icon board.
      const center = u.el('section', 'center');
      Object.assign(_c, { center, header: center });
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
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'workspace', _c.shell);
      const rail = u.el('nav', 'rail', body);
      const navItems = [
        ['home', 'Home'],
        ['document', 'Documents'],
        ['camera', 'Photos'],
        ['people', 'Contacts'],
        ['calendar', 'Calendar'],
        ['star', 'Favorites'],
        ['clock', 'Recent Items'],
        ['folder', 'Shared with Me'],
        ['trash', 'Deleted Items'],
      ];
      navItems.forEach(([icon, label], i) => {
        if (i === 5) u.el('div', 'rail-divider', rail);
        const row = u.el('div', 'rail-item' + (i === 0 ? ' selected' : ''), rail);
        const badge = u.el('span', 'rail-icon', row);
        drawLegendIcon(u, badge, icon, 'rail');
        u.el('span', '', row, label);
      });
      const content = u.el('div', 'content-area', body);
      content.appendChild(_c.center);
      const aside = u.el('aside', 'aside', content);
      Object.assign(_c, { body, aside });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.aside });
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task instructions';
      const u = _c.util, aside = _c.aside;
      u.el('h2', 'tips-title', aside, 'Icon Tips');
      u.el(
        'p',
        'aside-copy',
        aside,
        'Choose an icon to represent your item. You can use these icons for files, folders, and shortcuts.',
      );
      u.el('h2', 'legend-title', aside, 'Icon Legend');
      const legend = [
        ['folder', 'Folder'],
        ['document', 'Document'],
        ['photo', 'Photo'],
        ['camera', 'Camera'],
        ['email', 'Email'],
        ['people', 'People'],
        ['calendar', 'Calendar'],
        ['star', 'Favorite'],
        ['trash', 'Trash / Delete'],
      ];
      const list = u.el('div', 'legend', aside);
      legend.forEach(([kind, label]) => {
        const row = u.el('div', 'legend-row', list);
        const icon = u.el('span', 'legend-icon', row);
        drawLegendIcon(u, icon, kind);
        u.el('span', '', row, label);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        const title = _c.util.el('b', 'note-title', null, 'Task note');
        note.prepend(title);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.shell.appendChild(foot);
        foot.querySelector('.ref-foot-text').remove();
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-read-figure-icon-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-icon-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0873cc'],
      LOW_ACCENTS: ['#0873cc'],
      parts,
    },
  });
})();
