// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      const { header, util } = _c;
      const ghTools = util.el('div', 'gh-global-tools', header);
      util.el('span', 'gh-search', ghTools, '⌕  Search or jump to…');
      util.el('span', 'gh-add', ghTools, '+  ⌄');
      util.el('span', 'gh-bell', ghTools, '♧');
      util.el('span', 'gh-user', ghTools, '');
      Object.assign(_c, { ghTools });
    },
  };

  env.site({
    name: 'design-resist-injection-code-05',
    template: 'site/base',
    design: { parts },
  });
})();
