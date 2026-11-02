// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      if (_c.display === 'header') header.classList.add('explorer-instructed');
      const titlebar = util.el('div', 'explorer-titlebar', header);
      util.el('span', 'explorer-title-icon', titlebar, '📁');
      util.el('span', 'explorer-title', titlebar, 'Project Files');
      const windowBtns = util.el('div', 'explorer-window-btns', titlebar);
      util.el('span', '', windowBtns, '−');
      util.el('span', '', windowBtns, '□');
      util.el('span', 'close', windowBtns, '×');
      const menubar = util.el('nav', 'explorer-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Favorites', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'explorer-toolbar', header);
      for (const [ico, item] of [['▤','Organize⌄'], ['▣','Open'], ['👥','Share with⌄'], ['▤','Print'], ['◉','Burn'], ['📁','New folder']]) {
        const b = util.el('span', 'explorer-tool', toolbar);
        util.el('i', '', b, ico); util.el('span', '', b, item);
      }
      const folderHead = util.el('div', 'explorer-folder-head', header);
      util.el('div', 'explorer-big-folder', folderHead, '📁');
      const folderInfo = util.el('div', 'explorer-folder-info', folderHead);
      util.el('div', 'explorer-folder-name', folderInfo, 'Documents');
      util.el('div', '', folderInfo, 'File folder');
      util.el('div', '', folderInfo, 'Date modified:  Apr 12, 2024 10:15 AM');
      S.frameBrand(_c, header);
      Object.assign(_c, { folderHead, folderInfo, header, menubar, titlebar, toolbar, windowBtns });
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const { body, util } = _c;
      body.classList.add('be-has-inspector');
      const inspector = util.el('aside', 'be-inspector', body);
      const heading = util.el('div', 'be-inspector-heading', inspector);
      const icon = util.el('span', 'be-inspector-icon', heading);
      icon.innerHTML = '<svg viewBox="0 0 70 60" aria-hidden="true"><defs><linearGradient id="be-folder-fill" x2="0" y2="1"><stop stop-color="#ffe994"/><stop offset=".55" stop-color="#ffd151"/><stop offset="1" stop-color="#d99b20"/></linearGradient></defs><path d="M5 14h20l7 6h31v35H5z" fill="#f2bf38" stroke="#71410c" stroke-width="2"/><path d="M5 12V7h21l8 8H5z" fill="#ffe891" stroke="#71410c" stroke-width="2"/><path d="M5 20h58l-4 34H7z" fill="url(#be-folder-fill)" stroke="#71410c" stroke-width="2"/><path d="M9 24h49" stroke="#fff5c5" stroke-width="2"/></svg>';
      const caption = util.el('div', 'be-inspector-caption', heading);
      util.el('div', 'be-inspector-name', caption, 'Folder');
      util.el('div', 'be-inspector-kind', caption, 'Folder');
      util.el('div', 'be-inspector-rule', inspector);
      const row = (label, cls) => {
        const wrap = util.el('div', 'be-inspector-row', inspector);
        util.el('span', 'be-inspector-label', wrap, label);
        util.el('span', cls, wrap, '—');
      };
      row('Location:', 'be-inspector-location');
      row('Size:', 'be-inspector-size');
      row('Modified:', 'be-inspector-modified');
      row('Created:', 'be-inspector-created');
      util.el('div', 'be-inspector-rule', inspector);
      util.el('div', 'be-inspector-description-title', inspector, 'Description:');
      util.el('div', 'be-inspector-description', inspector, 'Folder information.');
    },
  };

  env.site({
    name: 'design-use-file-manager-move-05',
    template: 'site/base',
    design: { parts },
  });
})();
