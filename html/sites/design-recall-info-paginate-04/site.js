// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appNav = util.el('nav', 'catalog-nav', document.body);
      document.body.insertBefore(appNav, header);
      appNav.setAttribute('aria-label', 'Catalog navigation');
      for (const [label, selected] of [['Home', false], ['Catalog', true], ['Orders', false], ['Customers', false], ['Reports', false], ['Support', false]]) {
        const link = util.el('a', selected ? 'catalog-navlink is-current' : 'catalog-navlink', appNav, label);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      const search = util.el('form', 'catalog-search', appNav);
      search.addEventListener('submit', (e) => { e.preventDefault(); env.log('decoy', { what: 'search' }); });
      const searchInput = util.el('input', '', search);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search products';
      searchInput.setAttribute('aria-label', 'Search products');
      const searchButton = util.el('button', '', search, 'Search');
      searchButton.type = 'submit';
      S.frameBrand(_c, header);
      Object.assign(_c, { appNav, header, search, searchButton, searchInput });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const catalogSide = util.el('aside', 'catalog-side', body);
      const categoryBox = util.el('section', 'catalog-box catalog-categories', catalogSide);
      util.el('h2', 'catalog-box-title', categoryBox, 'Product Categories');
      const categoryTree = util.el('div', 'catalog-tree', categoryBox);
      for (const [label, level, bold, selected] of [
        ['All Products (68)', 0, true, false], ['⊟  Electronics (18)', 0, true, false], ['Digital Cameras (6)', 1, false, true],
        ['MP3 Players (4)', 1, false, false], ['Headphones (4)', 1, false, false], ['Monitors (4)', 1, false, false],
        ['⊟  Home & Garden (12)', 0, true, false], ['Kitchen Appliances (5)', 1, false, false], ['Outdoor Gear (4)', 1, false, false], ['Lighting (3)', 1, false, false],
        ['⊟  Office (14)', 0, true, false], ['Desk Chairs (4)', 1, false, false], ['Desks (4)', 1, false, false], ['Storage (6)', 1, false, false],
        ['⊟  Sports (10)', 0, true, false], ['Fitness (4)', 1, false, false], ['Cycling (3)', 1, false, false], ['Camping (3)', 1, false, false],
        ['⊟  Toys & Games (8)', 0, true, false], ['Building Sets (4)', 1, false, false], ['Board Games (4)', 1, false, false],
      ]) {
        const row = util.el('div', `catalog-tree-row${selected ? ' is-selected' : ''}${bold ? ' is-group' : ''}`, categoryTree, label);
        row.style.setProperty('--indent', level);
      }
      const recentBox = util.el('section', 'catalog-box catalog-recent', catalogSide);
      util.el('h2', 'catalog-box-title', recentBox, 'Recently Viewed');
      const recentList = util.el('div', 'catalog-recent-list', recentBox);
      for (const name of ['TrailShot D90', 'SunCam X2', 'PeakView Pro', 'Orion Compact', 'TrailShot A50']) util.el('div', '', recentList, `▤　${name}`);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, catalogSide, categoryBox, categoryTree, recentBox, recentList });
    },
  };

  env.site({
    name: 'design-recall-info-paginate-04',
    template: 'site/base',
    design: { parts },
  });
})();
