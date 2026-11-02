// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'mac-menu', header);
      util.el('span', 'mac-apple', menu, '');
      for (const label of ['File', 'Edit', 'View', 'Special', 'Help']) util.el('span', 'mac-menu-item', menu, label);
      util.el('span', 'mac-clock', menu, '▣　3:24 PM');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'mac-rail', body);
      for (const [icon, label] of [['☺','Finder'], ['▱','Applications'], ['▤','Documents'], ['▰','Desktop'], ['▰','Hard Disk']]) {
        const item = util.el('div', 'mac-launcher', rail);
        util.el('span', 'mac-launcher-icon', item, icon);
        util.el('span', 'mac-launcher-label', item, label);
      }
      const trash = util.el('div', 'mac-trash', rail);
      util.el('span', 'mac-launcher-icon', trash, '▥');
      util.el('span', 'mac-launcher-label', trash, 'Trash');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, trash });
    },
  };

  env.site({
    name: 'design-use-file-manager-multidelete-01',
    template: 'site/base',
    design: { parts },
  });
})();
