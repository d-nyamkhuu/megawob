// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const ghTools = util.el('div', 'gh-global-tools', header);
      util.el('span', 'gh-search', ghTools, '⌕  Search or jump to…');
      util.el('span', 'gh-add', ghTools, '+  ⌄');
      util.el('span', 'gh-bell', ghTools, '♧');
      util.el('span', 'gh-user', ghTools, '');
      Object.assign(_c, { ghTools, headerTools, submit });
    },
  };

  env.site({
    name: 'design-resist-injection-code-05',
    template: 'site/base',
    design: { parts },
  });
})();
