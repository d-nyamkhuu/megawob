// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frameBrand': (base) => function (_c, header) {
      const brand = base(_c, header);
      const node = brand || _c.util.el('div', 'ref-brand', header, 'Acme Sales');
      node.textContent = 'Acme Sales';
      node.dataset.role = 'brand';
      return node;
    },
    'frame.nav': (base) => function (_c) {
      base(_c);
      let nav = _c.header.querySelector('.ref-nav');
      if (!nav) nav = _c.util.el('nav', 'ref-nav', _c.header);
      ['Home', 'Accounts', 'Contacts', 'Orders', 'Products', 'Reports', 'Dashboards'].forEach((label, i) => {
        let link = nav.children[i];
        if (!link) {
          link = _c.util.el('a', 'ref-navlink', nav, label);
          link.dataset.role = 'nav';
          link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        } else link.textContent = label;
      });
    },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const sheet = util.el('div', 'ref-sheet', body);
        const stage = util.el('main', 'ref-stage', sheet);
        S.frameAlign(_c, stage);
        const tips = util.el('section', 'ref-tips', sheet);
        util.el('strong', 'ref-tips-title', tips, '💡　Tips');
        for (const [title, copy] of [
          ['Sort', 'Click a column header to sort ascending or descending.'],
          ['Filter', 'Use the Filters button to show records that match specific values.'],
          ['Select multiple', 'Click the checkbox to select a row. Shift-click to select a range, or use the header checkbox to select all.'],
          ['Reorder columns', 'Drag and drop a column header to change the column order.'],
          ['Resize columns', 'Drag the edge of a column header to resize.'],
        ]) {
          const tip = util.el('div', 'ref-tip', tips);
          util.el('b', '', tip, title);
          util.el('span', '', tip, copy);
        }
        Object.assign(_c, { stage });
      },
  };

  env.site({
    name: 'design-use-data-grid-cellEdit-05',
    template: 'site/base',
    design: { parts },
  });
})();
