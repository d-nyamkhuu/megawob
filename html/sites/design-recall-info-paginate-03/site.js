// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Decorative inspector fields remain empty until a detail view is available.
      const inspector = util.el('aside', 'ref-inspector', body);
      inspector.setAttribute('aria-live', 'polite');
      util.el('div', 'ref-inspector-title', inspector, 'Properties');
      const detailGroup = util.el('fieldset', 'ref-inspector-group', inspector);
      util.el('legend', '', detailGroup, 'Item Details');
      const detailValues = {};
      const field = (parent, label, key, multiline) => {
        const row = util.el('label', `ref-inspector-row${multiline ? ' is-multiline' : ''}`, parent);
        util.el('span', 'ref-inspector-label', row, `${label}:`);
        const value = util.el('span', 'ref-inspector-value', row, '');
        detailValues[key] = value;
      };
      for (const [label, key] of [['Name','name'], ['Price','price'], ['Rating','rating'], ['Category','category'], ['Supplier','supplier']]) field(detailGroup, label, key, false);
      field(detailGroup, 'Description', 'description', true);
      const moreGroup = util.el('fieldset', 'ref-inspector-group ref-inspector-more', inspector);
      util.el('legend', '', moreGroup, 'Other Information');
      for (const [label, key] of [['Stock #','stock'], ['Warranty','warranty'], ['Weight','weight'], ['Dimensions','dimensions']]) field(moreGroup, label, key, false);
      field(moreGroup, 'Notes', 'notes', true);
      Object.assign(_c, { detailGroup, detailValues, field, inspector, moreGroup, stage });
    },
  };

  env.site({
    name: 'design-recall-info-paginate-03',
    template: 'site/base',
    design: { parts },
  });
})();
