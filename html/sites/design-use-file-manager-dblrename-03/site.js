// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instr = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Downloads');
      brand.dataset.role = 'brand';
      const winControls = util.el('div', 'ref-window-controls', header);
      for (const glyph of ['–', '□', '×']) {
        const control = util.el('button', '', winControls, glyph);
        control.type = 'button';
        control.setAttribute('aria-label', glyph === '–' ? 'Minimize' : glyph === '□' ? 'Maximize' : 'Close');
      }
      const nativeTools = util.el('div', 'ref-native-toolbar', header);
      const glyphs = [
        ['Back', '<path d="M20 12H5m0 0 7-7m-7 7 7 7"/>'],
        ['Forward', '<path d="M4 12h15m0 0-7-7m7 7-7 7"/>'],
        ['Up', '<path d="M12 20V5m0 0-7 7m7-7 7 7"/>'],
        ['Reload', '<path d="M20 8V3m0 0h-5M20 3l-4 4a8 8 0 1 0 2 7"/>'],
        ['Home', '<path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/>'],
        ['Computer', '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4"/>'],
        ['Search', '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'],
      ];
      const toolButton = (parent, label, path) => {
        const b = util.el('button', 'ref-tool-btn', parent);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        const icon = util.el('span', 'ref-tool-icon', b);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
        util.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
        return b;
      };
      const separator = () => util.el('span', 'ref-tool-separator', nativeTools);
      glyphs.slice(0, 4).forEach(([label, path]) => toolButton(nativeTools, label, path));
      separator();
      glyphs.slice(4).forEach(([label, path]) => toolButton(nativeTools, label, path));
      const rightTools = util.el('div', 'ref-toolbar-right', nativeTools);
      util.el('span', 'ref-tool-separator', rightTools);
      const view = util.el('button', 'ref-view-choice', rightTools, '▦  Icon View  ▾');
      view.type = 'button';
      view.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: 'Icon View' }));
      util.el('span', 'ref-tool-separator', rightTools);
      const zoom = util.el('button', 'ref-zoom-choice', rightTools, '100%  ▾');
      zoom.type = 'button';
      zoom.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: '100%' }));
      Object.assign(_c, { brand, glyphs, header, nativeTools, rightTools, separator, title, toolButton, view, winControls, zoom });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const osSide = util.el('aside', 'ref-os-sidebar', body);
      const tabs = util.el('div', 'ref-os-tabs', osSide);
      util.el('strong', 'ref-os-tab active', tabs, 'Folder View');
      util.el('span', 'ref-os-tab', tabs, 'File Details');
      const group = (title, entries) => {
        const box = util.el('section', 'ref-os-box', osSide);
        util.el('strong', 'ref-os-box-title', box, title);
        for (const [icon, label] of entries) {
          const row = util.el('div', 'ref-os-row', box);
          util.el('span', 'ref-os-icon', row, icon);
          util.el('span', '', row, label);
        }
      };
      group('Folder Tasks', [['📁', 'Create a new folder'], ['▤', 'Copy the selected items'], ['✂', 'Move the selected items'], ['✖', 'Delete the selected items'], ['↶', 'Undo the last action']]);
      group('Other Places', [['▣', 'Desktop'], ['📁', 'My Documents'], ['📁', 'Pictures'], ['📁', 'Projects']]);
      const details = util.el('section', 'ref-os-box ref-os-details', osSide);
      util.el('strong', 'ref-os-box-title', details, 'Details');
      util.el('div', 'ref-os-detail-name', details, '📁   Design');
      util.el('div', 'ref-os-detail', details, '      File Folder');
      util.el('div', 'ref-os-detail', details, '      12 items');
      util.el('div', 'ref-os-detail', details, '      Size: 8.4 MB');
      util.el('div', 'ref-os-detail', details, '      Modified: Apr 28, 2021  10:24 AM');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, details, group, osSide, tabs });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const detailsBand = util.el('div', 'ref-details-list', body);
      const tableHead = util.el('div', 'ref-details-head', detailsBand);
      for (const label of ['Name', 'Size', 'Type', 'Date Modified']) util.el('span', '', tableHead, label);
      util.el('div', 'ref-details-rows', detailsBand);
      Object.assign(_c, { detailsBand, tableHead });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, detailsBand, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      // Static filler for the details band: names the use-file-manager content banks never use.
      const rows = detailsBand.querySelector('.ref-details-rows');
      for (const [name, size, type, modified] of [
        ['Desktop Backup', '', 'File folder', ''],
        ['Saved Games', '', 'File folder', ''],
        ['readme_old.txt', '4 KB', 'plain text document', '2023-06-09 10:12'],
        ['setup-notes.txt', '11 KB', 'plain text document', '2023-06-05 14:40'],
      ]) {
        const row = util.el('div', 'ref-details-row', rows);
        util.el('span', 'ref-detail-name', row, name);
        row.dataset.ext = type === 'File folder' ? 'folder' : 'txt';
        for (const value of [size, type, modified]) util.el('span', '', row, value);
      }
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-dblrename-03',
    template: 'site/base',
    design: { parts },
  });
})();
