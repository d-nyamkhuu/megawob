// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('mac-titlebar');
        util.el('span', 'mac-title-icon', header, '◩');
        util.el('span', 'mac-app-name', header, '');
        const rail = util.el('nav', 'saas-rail', document.body);
        const logo = util.el('div', 'saas-logo', rail, '◩');
        logo.setAttribute('aria-label', 'Workspace');
        const navIcons = {
          Projects:
            '<svg viewBox="0 0 24 24"><path d="M3.5 6.5h6l2 2h9v10.8a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2z"/><path d="M3.5 9h17"/></svg>',
          Search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="7.2"/><path d="m16.2 16.2 4.3 4.3"/></svg>',
          Assets:
            '<svg viewBox="0 0 24 24"><path d="m12 2.8 8.5 4.5-8.5 4.5-8.5-4.5z"/><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5"/></svg>',
          Team: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4"/><path d="M2.8 20v-1.5a6.2 6.2 0 0 1 12.4 0V20zM16 4.9a3.4 3.4 0 0 1 0 6.5M18 14.2a5 5 0 0 1 3.2 4.7V20h-3"/></svg>',
          Reports: '<svg viewBox="0 0 24 24"><path d="M4 20V12h4v8zM10 20V5h4v15zM16 20V9h4v11z"/></svg>',
          Settings:
            '<svg viewBox="0 0 24 24"><path d="M10 2.8h4l.6 2.4 2 .9 2.2-1.1 2.8 2.8-1.1 2.2.9 2 .6 2.4h-4l-.6 2.4-2 .9-2.2-1.1-2.8 2.8 1.1 2.2-.9 2H10l-.6-2.4-2-.9-2.2 1.1-2.8-2.8 1.1-2.2-.9-2-.6-2.4h4l.6-2.4 2-.9 2.2 1.1z" transform="translate(0 -1) scale(.92)"/><circle cx="12" cy="12" r="3"/></svg>',
        };
        for (const [icon, label] of [
          ['▱', 'Projects'],
          ['⌕', 'Search'],
          ['⬡', 'Assets'],
          ['♧', 'Team'],
          ['▥', 'Reports'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('a', `saas-nav-item${label === 'Projects' ? ' active' : ''}`, rail);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
          const glyph = util.el('span', 'saas-nav-icon', item);
          glyph.innerHTML = navIcons[label];
          util.el('span', 'saas-nav-label', item, label);
        }
        const winControls = util.el('div', 'mac-window-controls', header);
        for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
        const menu = util.el('nav', 'mac-menu', document.body);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Arrange', 'Window', 'Help']) {
          const entry = util.el('span', '', menu, item);
          entry.dataset.role = 'menu';
        }
        const toolbar = util.el('div', 'mac-toolbar', document.body);
        for (const [icon, label] of [
          ['▯', 'New'],
          ['📂', 'Open'],
          ['✂', 'Cut'],
          ['▧', 'Copy'],
          ['▣', 'Paste'],
          ['T', 'Text'],
          ['□', 'Box'],
          ['▧', 'Image'],
          ['↔', 'Align'],
          ['⇆', 'Distribute'],
        ]) {
          const tool = util.el('div', 'mac-tool', toolbar);
          util.el('span', 'mac-tool-icon', tool, icon);
          util.el('span', 'mac-tool-label', tool, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { header, logo, menu, navIcons, rail, toolbar, winControls });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const assets = util.el('aside', 'mac-assets', body);
        const tabs = util.el('div', 'mac-tabs', assets);
        util.el('b', '', tabs, 'Assets');
        util.el('span', '', tabs, 'Styles');
        util.el('span', '', tabs, 'Layers');
        util.el('div', 'mac-select', assets, 'All Assets　 ▾');
        for (const [i, label] of ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'].entries()) {
          const row = util.el('div', `mac-asset${i === 0 ? ' selected' : ''}`, assets);
          util.el('span', `mac-thumb thumb-${i + 1}`, row);
          util.el('span', '', row, label);
        }
        util.el('div', 'mac-divider', assets);
        for (const [shape, label] of [
          ['▰', 'Rectangle'],
          ['⬭', 'Oval'],
          ['★', 'Star'],
          ['―', 'Line'],
        ]) {
          const row = util.el('div', 'mac-shape', assets);
          util.el('span', '', row, shape);
          util.el('span', '', row, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { assets, body, tabs });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const stageWindow = util.el('div', 'mac-stage-window', stage);
        util.el('div', 'mac-stage-head', stageWindow, '▤　Untitled Layout');
        util.el('div', 'mac-canvas-host', stageWindow);
        const tips = util.el('aside', 'mac-tips', body);
        util.el('h2', '', tips, 'Dragging Tips');
        for (const [title, art] of [
          ['Move cards', '▭　　⇢　 ▯'],
          ['Resize boxes', '▱　　↘'],
          ['Align edges', '▰　┆　┆　▰'],
          ['Space evenly', '▰　↔　▰　↔　▰'],
        ]) {
          const tip = util.el('section', 'mac-tip', tips);
          util.el('h3', '', tip, title);
          util.el('div', 'mac-tip-art', tip, art);
        }
        S.frameAlign(_c, stage);
        const records = util.el('section', 'saas-records', body);
        const recordsHead = util.el('div', 'saas-records-head', records);
        const recordsTitle = util.el('div', 'saas-records-title', recordsHead);
        util.el('strong', '', recordsTitle, 'Properties');
        util.el('span', '', recordsTitle, '4 items');
        const search = util.el('div', 'saas-search', recordsHead);
        util.el('span', '', search, '⌕');
        util.el('span', '', search, 'Search properties…');
        const table = util.el('div', 'saas-table', records);
        const headings = util.el('div', 'saas-table-row saas-table-heading', table);
        for (const col of ['Name', 'Location', 'Type', 'Added', '']) util.el('span', '', headings, col);
        for (const [i, rowData] of [
          ['Lakeview Cabin', 'Whistler, BC', 'Cabin', 'Mar 3, 2024'],
          ['Pine Ridge House', 'Bend, OR', 'House', 'Feb 18, 2024'],
          ['Seaside Retreat', 'Carmel, CA', 'House', 'Jan 27, 2024'],
          ['Alpine Chalet', 'Aspen, CO', 'Chalet', 'Dec 12, 2023'],
        ].entries()) {
          const row = util.el('div', 'saas-table-row', table);
          util.el('span', `saas-mini-thumb thumb-${i + 1}`, row);
          for (const value of rowData) util.el('span', '', row, value);
          util.el('span', 'saas-row-more', row, '•••');
        }
        Object.assign(_c, { headings, records, recordsHead, recordsTitle, search, stage, stageWindow, table, tips });
      },
  };

  env.site({
    name: 'design-align-layout-align-02',
    template: 'site/base',
    design: { parts },
  });
})();
