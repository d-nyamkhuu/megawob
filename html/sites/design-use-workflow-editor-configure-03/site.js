// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Relayboard'];

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Relayboard's primary navigation is a segmented tab strip. Keep it static so
      // adding the visual frame does not consume any episode RNG draws.
      const tabs = util.el('nav', 'rb-tabs', header);
      for (const [icon, text, active] of [['♧', 'Workflows', true], ['⚒', 'Integrations', false],
        ['☷', 'Activity', false], ['▥', 'Library', false], ['⚙', 'Settings', false]]) {
        const tab = util.el('button', active ? 'rb-tab is-active' : 'rb-tab', tabs);
        tab.type = 'button';
        util.el('span', 'rb-tab-icon', tab, icon);
        util.el('span', '', tab, text);
        tab.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
      }
      const search = util.el('label', 'rb-search', header);
      util.el('span', 'rb-search-icon', search, '⌕');
      const searchInput = util.el('input', '', search);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search workflows...';
      searchInput.setAttribute('aria-label', 'Search workflows');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header, search, searchInput, tabs });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-configure-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
