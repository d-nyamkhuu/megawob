// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'garden-rail', body);
      util.el('div', 'garden-logo', rail, 'Gardenly');
      for (const [icon, item] of [['⌂','Home'],['◈','Plants'],['☷','My Lists'],['▦','Calendar'],['♧','Learn'],['♧','Shop']]) {
        const a = util.el('a', item === 'Plants' ? 'garden-nav active' : 'garden-nav', rail);
        a.href = '#';
        util.el('span', 'garden-nav-icon', a, icon);
        util.el('span', '', a, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const index = util.el('aside', 'garden-index', body);
      util.el('h1', 'garden-index-title', index, 'Plants');
      util.el('div', 'garden-search', index, '⌕　Search plants, herbs, flowers...　☷');
      const records = util.el('div', 'garden-records', index);
      let plantNo = 0;
      for (const [name, type] of [['Sweet basil','Herb'],['Thyme','Herb'],['Rosemary','Herb'],['Mint','Herb'],['Oregano','Herb'],['Lavender','Flower'],['Sage','Herb'],['Chives','Herb'],['Cilantro','Herb']]) {
        const row = util.el('div', name === 'Sweet basil' ? 'garden-record selected' : 'garden-record', records);
        const thumb = util.el('img', 'garden-thumb', row);
        thumb.src = `sites/design-avoid-dark-patterns-nag-03/assets/plant-${++plantNo}.jpg`;
        thumb.alt = '';
        const txt = util.el('span', 'garden-record-text', row);
        util.el('strong', '', txt, name); util.el('small', '', txt, type);
      }
      S.frameSidebar(_c, rail);
      Object.assign(_c, { body, index, plantNo, rail, records });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-nag-03',
    template: 'site/base',
    design: { parts },
  });
})();
