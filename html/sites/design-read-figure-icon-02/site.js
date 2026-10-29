(function () {
  'use strict';
  const C = { site: 'design-read-figure-icon-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        root = u.el('main', 'app', document.body);
      document.body.className = 'brightworks instruction-' + ctx.display + (ctx.finish ? ' finish-mode' : '');
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
      const body = u.el('div', 'workspace', root);
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
        drawLegendIcon(badge, icon, 'rail');
        u.el('span', '', row, label);
      });
      const content = u.el('div', 'content-area', body);
      const center = u.el('section', 'center', content);
      let display = ctx.display || 'header';
      if (window.innerWidth < 1120 && (display === 'panel' || display === 'toast')) display = 'header';
      if (display === 'header') u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', content);
      if (display === 'panel') {
        u.el('b', 'episode-title', aside, 'Task instructions');
        u.el('p', 'episode-instruction', aside, ctx.instruction);
      }
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
      function drawLegendIcon(parent, kind, size = 'legend') {
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
      legend.forEach(([kind, label]) => {
        const row = u.el('div', 'legend-row', list);
        const icon = u.el('span', 'legend-icon', row);
        drawLegendIcon(icon, kind);
        u.el('span', '', row, label);
      });
      const footer = u.el('footer', 'bottom', root);
      let submit = null;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const label = labels.map(labelOf).find((x) => x.toLowerCase() === 'submit') || labelOf(labels[0]);
      const end = (parent, cls, text, action) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', action);
        return b;
      };
      if (!ctx.finish) {
        const mode = ctx.rng.fork('chrome/end-form').pick(['header', 'header', 'footer', 'link']);
        if (mode === 'header') submit = end(top, 'episode-end episode-toolbar', label, ctx.submit);
        else if (mode === 'footer') submit = end(footer, 'episode-end footer-end', label, ctx.submit);
        else {
          submit = end(footer, 'episode-link footer-link', label, ctx.submit);
        }
        const collide = ctx.rng.fork('chrome/collide');
        if (collide.bool(0.3)) {
          const decoy =
            labels.map(labelOf).find((x) => x.toLowerCase() !== label.toLowerCase() && x.toLowerCase() === 'ok') ||
            'OK';
          end(top, 'episode-xtra episode-toolbar-xtra', decoy, () =>
            env.log('decoy', { label: decoy, collide: true }),
          );
        }
      }
      if (display === 'toast') {
        const toast = u.el('div', 'episode-toast', document.body);
        u.el('b', '', toast, 'Task note');
        u.el('p', '', toast, ctx.instruction);
      }
      if (ctx.finish) footer.remove();
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
