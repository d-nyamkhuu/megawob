// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const sheet = util.el('div', 'ref-sheet', body);
        const stage = util.el('main', 'ref-stage', sheet);
        S.frameAlign(_c, stage);
        const related = util.el('aside', 'ref-related', sheet);
        util.el('strong', 'ref-related-title', related, 'Inventory Items');
        util.el('div', 'ref-related-search', related, '⌕　Search items...');
        for (const [icon, title, group] of [
          ['🪖', 'Safety Helmet', 'Safety Equipment'],
          ['🧤', 'Work Gloves, Leather', 'Safety Equipment'],
          ['🥽', 'Protective Goggles', 'Safety Equipment'],
          ['🎧', 'Ear Protection', 'Safety Equipment'],
          ['🦺', 'Hi-Vis Vest', 'Apparel'],
          ['🥾', 'Steel Toe Boots', 'Apparel'],
          ['😷', 'Respirator Mask', 'Safety Equipment'],
          ['🧰', 'First Aid Kit', 'Medical'],
          ['🧰', 'Toolbox', 'Tools'],
          ['◉', 'Duct Tape', 'Supplies'],
        ]) {
          const row = util.el('div', 'ref-related-row', related);
          util.el('span', 'ref-related-icon', row, icon);
          const copy = util.el('span', 'ref-related-copy', row);
          util.el('b', '', copy, title);
          util.el('small', '', copy, group);
        }
        related.children[3].classList.add('selected');
        Object.assign(_c, { related, stage });
      },
  };

  env.site({
    name: 'design-use-data-grid-cellEdit-01',
    template: 'site/base',
    design: { parts },
  });
})();
