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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'ref-tips', body);
      const tipsHead = util.el('div', 'ref-tips-head', tips);
      util.el('span', 'ref-tips-icon', tipsHead, '💡');
      util.el('span', '', tipsHead, 'Tips');
      const tipsList = util.el('ul', '', tips);
      for (const line of [
        'Select one or more items in a list and move them with the arrow buttons.',
        'You can also double-click an item to move it, or drag items between lists.',
        'Use Ctrl-click to select multiple items, or Shift-click to select a range.',
        'Use the filters to quickly find items in each list.',
      ]) util.el('li', '', tipsList, line);
      Object.assign(_c, { stage, tips, tipsHead, tipsList });
    },
  };

  env.site({
    name: 'design-transfer-items-filter-03',
    template: 'site/base',
    design: { parts },
  });
})();
