// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, label, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // retain the scaffold's existing title draw
      const brand = util.el('div', 'ref-brand', header);
      brand.dataset.role = 'brand';
      const appIcon = util.el('div', 'flow-app-icon', brand, '⌘');
      const appTitle = util.el('div', 'flow-app-copy', brand);
      util.el('div', 'flow-app-name', appTitle, 'Order Processing');
      util.el('div', 'flow-app-desc', appTitle, 'Automates processing of new orders, with fraud check and delivery.');
      const appMeta = util.el('div', 'flow-app-meta', appTitle);
      for (const [key, value] of [['Status', 'Active'], ['Version', '1.3.0'], ['Last modified', 'Apr 12, 2018 10:24'], ['Owned by', 'Operations'], ['Environment', 'Production']]) {
        const item = util.el('div', 'flow-meta-item', appMeta);
        util.el('span', 'flow-meta-label', item, key);
        util.el('span', 'flow-meta-value', item, value);
      }
      const stats = util.el('div', 'flow-stats', header);
      for (const [value, label] of [['6', 'Steps'], ['5', 'Connections'], ['0', 'Errors'], ['0', 'Warnings']]) {
        const item = util.el('div', 'flow-stat', stats);
        util.el('strong', '', item, value);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { appIcon, appMeta, appTitle, brand, header, stats });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-place-04',
    template: 'site/base',
    design: { parts },
  });
})();
