// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTitle = util.el('div', 'gtk-titlebar', document.body);
      document.body.insertBefore(appTitle, header);
      util.el('span', 'gtk-app-icon', appTitle, '⬡');
      util.el('strong', 'gtk-title', appTitle, 'City Manager');
      const win = util.el('div', 'gtk-window-controls', appTitle);
      for (const mark of ['−', '□', '×']) util.el('span', 'gtk-window-control', win, mark);
      const menu = util.el('nav', 'gtk-menubar', document.body);
      document.body.insertBefore(menu, header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'gtk-menu-item', menu, item);
      const toolbar = util.el('div', 'gtk-toolbar', document.body);
      document.body.insertBefore(toolbar, header);
      for (const [icon, label] of [['▯', 'New'], ['📁', 'Open'], ['✖', 'Delete'], ['▤', 'Properties']]) {
        const tool = util.el('div', 'gtk-tool', toolbar);
        util.el('span', 'gtk-tool-icon', tool, icon);
        util.el('span', 'gtk-tool-label', tool, label);
      }
      const tabs = util.el('nav', 'gtk-tabs', document.body);
      document.body.insertBefore(tabs, header);
      for (const [i, item] of ['All Regions', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'].entries()) {
        util.el('span', i === 0 ? 'gtk-tab active' : 'gtk-tab', tabs, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appTitle, header, menu, tabs, toolbar, win });
    },
  };

  env.site({
    name: 'design-transfer-items-filter-01',
    template: 'site/base',
    design: { parts },
  });
})();
